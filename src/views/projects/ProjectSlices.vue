<template>
  <div class="mx-5 columns">
    <div class="column is-one-third">
      <FileUpload :project="project" :url="baseUrl + '/slices'" @uploaded="onUploaded" />
      <div class="card mb-2" v-for="(slice, sha1) in slices" :key="sha1">
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <figure class="image is-48x48">
                <img :src="baseUrl + '/images/' + slice.image?.sha1" :alt="slice.name">
              </figure>
            </div>
            <div class="media-content">
              <p class="title is-4">{{ slice.name }}</p>
            </div>
          </div>
        </div>

        <footer class="card-footer">
          <a class="card-footer-item">Print</a>
          <a :href="baseUrl + '/slices/get/' + slice.sha1" class="card-footer-item">Download</a>
          <a @click="onToDetails(slice)" class="card-footer-item">Details</a>
        </footer>
      </div>
    </div>
    <div class="box column is-two-thirds content mt-2" v-if="slice">
      <h4>{{ slice?.name }}</h4>
      <div class="columns">
        <div class="column is-third content">
          <h6>Path</h6>
          <p>{{ slice?.path }}</p>
        </div>
        <div class="column is-third content">
          <h6>Layers</h6>
          <p>{{ slice?.layer_count }}</p>
        </div>
        <div class="column is-third content">
          <h6>Cost</h6>
          <p>{{ slice?.cost }}</p>
        </div>
      </div>
      <h4>Filment</h4>
      <div class="columns">
        <div class="column is-third content">
          <h6>Length</h6>
          <p>{{ slice?.filament?.length }}</p>
        </div>
        <div class="column is-third content">
          <h6>Mass</h6>
          <p>{{ slice?.filament?.mass }}</p>
        </div>
        <div class="column is-third content">
          <h6>Weight</h6>
          <p>{{ slice?.filament?.weight }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useProjectsStore } from "../../stores/projects.js";
import pinia from "@/stores/store.js";
import FileUpload from "../../components/FileUpload.vue";

export default {
  name: "ProjectSlices",
  created() { },
  data() {
    return {
      slice: null,
      baseUrl: import.meta.env.VITE_API_URL,
    };
  },
  computed: {
    project() {
      return useProjectsStore(pinia).selectedProject;
    },
    slices() {
      let rtn = [];
      for (let img of useProjectsStore(pinia).selectedProject.slices) {
        rtn.push(img);
      }
      return rtn.sort((a, b) => (a.name > b.name) ? 1 : -1);
    },
  },
  props: {},
  methods: {
    onToDetails(slice) {
      this.slice = slice;
    },
    onUploaded() {
      useProjectsStore(pinia).fetchProjectSlices(this.project.uuid, true);
    }
  },
  components: { FileUpload }
};
</script>

<style scoped>
</style>
