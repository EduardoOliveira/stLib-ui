<template>
  <div>

    <div class="box mb-2" v-if="hasUpload">
      <b-upload v-model="dropFiles" multiple drag-drop expanded>
        <section>
          <div class="content has-text-centered">
            <p>Drop your files here or click to upload</p>
          </div>
        </section>
      </b-upload>
      <div>
        <transition name="fade">
          <div class="mb-5" v-if="progress.length > 0"></div>
        </transition>
        <transition name="fade" v-for="(p, i) in progress" :key="i">
          <b-progress class='m-1' :value="p.progress" show-value format="percent">
            {{  p.name  }} - {{  p.progress  }}%
          </b-progress>
        </transition>
      </div>
    </div>


    <div class="card mb-2" v-for="(model, sha1) in models" :key="sha1">
      <div class="card-content">
        <div class="media">
          <div class="media-left">
            <figure class="image is-48x48">
              <img :src="baseUrl + '/models/render/' + model.sha1" :alt="model.name">
            </figure>
          </div>
          <div class="media-content">
            <p class="title is-4">{{  model.name  }}</p>
          </div>
        </div>
      </div>

      <footer class="card-footer">
        <a :href="baseUrl + '/models/get/' + model.sha1" class="card-footer-item">Download</a>
        <a v-if="hasViewer" @click="onAddToViewer(model)" class="card-footer-item">3D View</a>
      </footer>
    </div>
  </div>
</template>

<script>
import { useProjectsStore } from "../stores/projects.js";
import pinia from "../stores/store.js";

import axios from 'axios';
export default {
  name: "ModelList",
  created() { },
  data() {
    return {
      dropFiles: [],
      progress: [],
      changed: false,
      baseUrl: import.meta.env.VITE_API_URL,
    };
  },
  props: {
    models: {
      type: Array,
      required: true,
    },
    hasViewer: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasUpload: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  watch: {
    dropFiles(files) {
      this.uploadFiles(files);
    },
    progress(progress) {
      if(this.changed && progress.length == 0) {
        console.log('refresh');
        useProjectsStore(pinia).fetchProjectModels(this.project.uuid, true);
        this.changed = false;
      }
    }
  },
  computed: {
    project() {
      return useProjectsStore(pinia).getSelectedProject;
    },
  },
  methods: {
    onAddToViewer(model) {
      this.$emit("add-to-viewer", model);
    },
    uploadFiles(files) {
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          let p = {
            progress: 0,
            name: files[i].name
          };
          this.progress.push(p);
          const formData = new FormData();
          formData.append('file', this.dropFiles[i]);
          formData.append('project', this.project.uuid);
          const headers = { 'Content-Type': 'multipart/form-data' };
          axios.post(this.baseUrl+'/models', formData, {
            headers: headers,
            onUploadProgress: progressEvent => { p.progress = Math.floor(progressEvent.loaded / progressEvent.total * 100); }
          }).then((res) => {
            console.log(res);
            this.progress.splice(this.progress.indexOf(p), 1);
          });
          this.changed = true;
        }

      }
    }
  },
};
</script>

<style scoped>
.fade-enter-active {
  transition: opacity .5s;
}

.fade-leave-active {
  transition: opacity 10s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>