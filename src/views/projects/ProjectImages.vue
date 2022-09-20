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
      <header class="card-header">
        <p class="card-header-title">
          {{img.name }}
        </p>
        <button class="card-header-icon" aria-label="more options" @click="openModal(img)">
          <b-icon icon="cog" size="is-small"></b-icon>
        </button>
      </header>

      <div class="card-image" @click="show=true;url=baseUrl + '/projects/'+project.uuid+'/assets/'+ img.sha1;">
        <b-image :src="baseUrl + '/projects/'+project.uuid+'/assets/'+ img.sha1" ratio="4by3"></b-image>
      </div>
    </div>
    <b-modal v-model="isModalOpen">
      <div class="dropdown-content">
        <a href="#" class="dropdown-item" @click="makeDefaultImage(openImage)">
          Set as main Image
        </a>
        <a :href="baseUrl + '/projects/'+project.uuid+'/assets/'+ openImage.sha1+'?download=true'" class="dropdown-item">
          Download
        </a>

        <a href="#" class="dropdown-item" @click.prevent="editAsset(openImage)">Edit</a>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import { useProjectsStore } from "../../stores/projects.js";
import { useAssetsStore } from "../../stores/assets.js";
import pinia from "@/stores/store.js";
import FileUpload from "../../components/FileUpload.vue";

export default {
  name: "ProjectImages",
  created() { },
  data() {
    return {
      show: false,
      url: "",
      openImage: {},
      isModalOpen: false,
      baseUrl: import.meta.env.VITE_API_URL,
    };
  },
  computed: {
    project() {
      return useProjectsStore(pinia).selectedProject;
    },
    images() {
      return useProjectsStore(pinia).getSelectedProjectImages.sort((a, b) => (a.name > b.name) ? 1 : -1);
    },
  },
  props: {},
  methods: {
    makeDefaultImage(img) {
      useProjectsStore(pinia).setSelectedProjectImage(img.sha1);
    },
    onUploaded() {
      useProjectsStore(pinia).fetchProjectImages(this.project.uuid, true);
    },
    openModal(img) {
      this.isModalOpen = true;
      this.openImage = img;
    },
    closeModal() {
      this.openImage = false;
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
.card,
.upload {
  width: 300px;
  max-width: 300px;
  min-width: 300px;
}

.card:hover header {
  display: flex;
}

header {
  display: none;
  background-color: rgba(245, 245, 245, 0.5);
  position: absolute;
  z-index: 1;
  width: 300px;
  max-width: 300px;
}

.card-header-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 260px;
  max-width: 260px;
  font-size: 1rem;
  display: inline-block
}
</style>
