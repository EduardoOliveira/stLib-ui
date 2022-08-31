<template>
  <div
    class="px-5 is-flex is-flex-direction-row is-flex-wrap-wrap is-align-items-flex-star is-align-content-baseline overflow-y-auto">
    <b-modal v-model="show">
      <p class="image">
        <img :src="url" />
      </p>
    </b-modal>
    <FileUpload :project="project" :url="baseUrl + '/images'" class="upload" @uploaded="onUploaded" />
    <div class="card m-1" v-for="img in images" :key="img.sha1">
      <div class="card-image" @click="
  show = true;
url = baseUrl + img.path + img.sha1;
      ">
        <b-image :src="baseUrl + img.path + img.sha1" ratio="4by3"></b-image>
      </div>

      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <p class="subtitle is-6">{{ img.name }}</p>
          </div>
        </div>
      </div>
      <footer class="card-footer">
        <a :href="baseUrl + img.path + img.sha1" class="card-footer-item">Download</a>
        <a @click="makeDefaultImage(img)" class="card-footer-item">Main image</a>
      </footer>
    </div>
  </div>
</template>

<script>
import { useProjectsStore } from "../../stores/projects.js";
import pinia from "@/stores/store.js";
import FileUpload from "../../components/FileUpload.vue";

export default {
  name: "ProjectImages",
  created() { },
  data() {
    return {
      show: false,
      url: "",
      baseUrl: import.meta.env.VITE_API_URL,
    };
  },
  computed: {
    project() {
      return useProjectsStore(pinia).selectedProject;
    },
    images() {
      let rtn = [];
      for (let img of useProjectsStore(pinia).selectedProject.images) {
        img.path = "/images/";
        rtn.push(img);
      }
      for (let model of useProjectsStore(pinia).selectedProject.models) {
        rtn.push({
          sha1: model.sha1,
          name: model.name,
          path: "/models/render/",
        });
      }
      return rtn.sort((a, b) => (a.name > b.name) ? 1 : -1);
    },
  },
  props: {},
  methods: {
    makeDefaultImage(img) {
      useProjectsStore(pinia).setSelectedProjectImage(img.path + img.sha1);
    },
    onUploaded() {
      useProjectsStore(pinia).fetchProjectImages(this.project.uuid, true);
    }
  },
  components: { FileUpload }
};
</script>

<style scoped>
.card,
.upload {
  width: 300px;
  max-width: 300px;
  min-width: 300px;
}
</style>
