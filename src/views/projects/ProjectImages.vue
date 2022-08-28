<template>
  <div
    class="container is-flex is-flex-direction-row is-flex-wrap-wrap is-align-items-flex-start"
  >
    <b-modal v-model="show">
      <p class="image">
        <img :src="url" />
      </p>
    </b-modal>
    <div class="card m-1" v-for="img in images" :key="img.sha1">
      <div
        class="card-image"
        @click="
          show = true;
          url = baseUrl + '/images/' + img.sha1;
        "
      >
        <b-image :src="baseUrl + '/images/' + img.sha1" ratio="4by3"></b-image>
      </div>

      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <p class="subtitle is-6">{{ img.name }}</p>
          </div>
        </div>
      </div>
      <footer class="card-footer">
        <a :href="baseUrl + '/images/' + img.sha1" class="card-footer-item"
          >Download</a
        >
        <a @click="makeDefaultImage(img)" class="card-footer-item"
          >Main image</a
        >
      </footer>
    </div>
  </div>
</template>

<script>
import { useProjectsStore } from "../../stores/projects.js";
import pinia from "@/stores/store.js";

export default {
  name: "ProjectImages",
  created() {},
  data() {
    return {
      show: false,
      url: "",
      baseUrl: import.meta.env.VITE_API_URL,
    };
  },
  computed: {
    images() {
      return useProjectsStore(pinia).selectedProject.images;
    },
  },
  props: {},
  methods: {
    makeDefaultImage(img) {
      useProjectsStore(pinia).setSelectedProjectImage("/images/" + img.sha1);
    },
  },
};
</script>

<style scoped>
.card {
  width: 300px;
  max-width: 300px;
  min-width: 300px;
}
</style>
