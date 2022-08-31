<template>
  <div>
    <FileUpload :project="project" :url="this.baseUrl + '/models'" v-if="hasUpload" />
    <div class="card mb-2" v-for="(model, sha1) in models" :key="sha1">
      <div class="card-content">
        <div class="media">
          <div class="media-left">
            <figure class="image is-48x48">
              <img :src="baseUrl + '/models/render/' + model.sha1" :alt="model.name">
            </figure>
          </div>
          <div class="media-content">
            <p class="title is-4">{{ model.name }}</p>
          </div>
        </div>
      </div>

      <footer class="card-footer">
        <a :href="baseUrl + '/models/get/' + model.sha1" class="card-footer-item">Download</a>
        <a v-if="hasViewer && !visible.includes(model.sha1)" @click="onAddToViewer(model)" class="card-footer-item">View</a>
        <a v-if="hasViewer &&  visible.includes(model.sha1)" @click="removeFromViewer(model)" class="card-footer-item">Hide</a>
      </footer>
    </div>
  </div>
</template>

<script>
import { useProjectsStore } from "../stores/projects.js";
import pinia from "../stores/store.js";
import FileUpload from "./FileUpload.vue";

export default {
  name: "ModelList",
  created() { },
  data() {
    return {
      baseUrl: import.meta.env.VITE_API_URL,
      visible: []
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
  computed: {
    project() {
      return useProjectsStore(pinia).getSelectedProject;
    }
  },
  methods: {
    onAddToViewer(model) {
      this.visible.push(model.sha1);
      this.$emit("add-to-viewer", model);
    },
    removeFromViewer(model) {
      this.visible.splice(this.visible.indexOf(model.sha1), 1);
      this.$emit("remove-from-viewer", model);
    },
  },
  components: {
    FileUpload
  }
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