<template>
  <div class="mx-5 columns">
    <div class="column is-one-third">
      <FileUpload :project="project" :url="baseUrl + '/slices'" @uploaded="onUploaded" />
      <div class="card mb-2" v-for="(slice, sha1) in slices" :key="sha1">
        <div class="card-content" @click="onToDetails(slice)">
          <div class="media">
            <div class="media-left">
              <figure class="image is-48x48">
                <img :src="baseUrl + '/projects/'+project.uuid+'/assets/' + slice?.slice.image?.sha1" :alt="slice.name">
              </figure>
            </div>
            <div class="media-content">
              <p class="title is-4">{{ slice.name }}</p>
            </div>
          </div>
        </div>

        <footer class="card-footer">
          <a class="card-footer-item">Print</a>
          <a :href="baseUrl + '/projects/'+project.uuid+'/assets/'+ slice.sha1+'?download=true'"
            class="card-footer-item">Download</a>
          <a class="card-footer-item" @click.prevent="editAsset(slice)">Edit</a>
        </footer>
      </div>
    </div>
    <div class="box column is-two-thirds content mt-2" v-if="slice">
      <h4>{{ slice?.name }}</h4>
      <div class="columns">
        <div class="column content">
          <h6>Path</h6>
          <p>{{ project.path+'/'+slice?.name }}</p>
        </div>
        <div class="column content">
          <h6>Duration</h6>
          <p>{{ slice?.slice?.duration }}</p>
        </div>
        <div class="column content">
          <h6>Layers</h6>
          <p>{{ slice?.slice?.layer_count }}</p>
        </div>
        <div class="column content">
          <h6>Duration</h6>
          <p>{{ slice?.slice?.duration }}</p>
        </div>
        <div class="column content">
          <h6>Cost</h6>
          <p>{{ slice?.slice?.cost }}</p>
        </div>
      </div>
      <h4>Filament</h4>
      <div class="columns">
        <div class="column content">
          <h6>Length</h6>
          <p>{{ slice?.slice?.filament?.length }}mm</p>
        </div>
        <div class="column content">
          <h6>Mass</h6>
          <p>{{ slice?.slice?.filament?.mass }}mm&#179;</p>
        </div>
        <div class="column content">
          <h6>Weight</h6>
          <p>{{ slice?.slice?.filament?.weight }}g</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useProjectsStore } from "../../stores/projects.js";
import { useAssetsStore } from "../../stores/assets.js";
import pinia from "@/stores/store.js";
import FileUpload from "../../components/FileUpload.vue";

export default {
  name: "ProjectSlices",
  created() { },
  data() {
    return {
      slice: null,
      isModalOpen: false,
      openSlice: {},
      baseUrl: import.meta.env.VITE_API_URL,
    };
  },
  computed: {
    project() {
      return useProjectsStore(pinia).selectedProject;
    },
    slices() {
      let rtn = [];
      for (let img of useProjectsStore(pinia).getSelectedProjectSlices) {
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
    },
    editAsset(asset) {
      useAssetsStore(pinia).setSelectedAsset(asset);
      this.$router.push({ path: "/assets" });
    },
  },
  components: { FileUpload }
};
</script>

<style scoped>
.card:hover header {
  display: flex;
}

header {
  display: none;
  background-color: rgba(245, 245, 245, 0.5);
  position: absolute;
  z-index: 1;
  width: 100%;
  max-width: 100%;
}

.card-header-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  max-width: 100%;
  font-size: 1rem;
  display: inline-block
}
</style>
