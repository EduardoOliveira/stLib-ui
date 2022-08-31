<template>
  <div class="box mb-2">
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
          {{ p.name }} - {{ p.progress }}%
        </b-progress>
      </transition>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
export default {
  name: "FileUpload",
  created() { },
  data() {
    return {
      dropFiles: [],
      progress: [],
      changed: false,
      baseUrl: import.meta.env.VITE_API_URL,
      visible: []
    };
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  watch: {
    dropFiles(files) {
      this.uploadFiles(files);
    },
    progress(progress) {
      if (this.changed && progress.length == 0) {
        this.$emit("uploaded");
        this.changed = false;
      }
    }
  },
  methods: {
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
          axios.post(this.url, formData, {
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