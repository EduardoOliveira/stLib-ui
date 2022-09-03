<template>
  <div class="is-flex is-flex-grow-1 is-flex-shrink-1 overflow-inherit mx-5">
    <div class="column is-one-fifths mr-5 overflow-y-auto">
      <ModelList :models="models" :has-viewer="true" @add-to-viewer="addToVIewer" @remove-from-viewer="removeFromVIewer"/>
    </div>
    <ModelViewer :models="rendered" class="box column is-four-fifths is-hidden-touch p-0"/>
  </div>
</template>

<script>
import { useProjectsStore } from "../../stores/projects.js";
import pinia from "@/stores/store.js";
import ModelList from "../../components/ModelList.vue";
import ModelViewer from "../../components/ModelViewer.vue";

export default {
  name: "ProjectModels",
  created() {},
  data() {
    return {
      rendered: [],
    };
  },
  computed: {
    models() {
      return useProjectsStore(pinia).selectedProject.models.sort((a, b) => (a.name > b.name) ? 1 : -1);
    },
  },
  props: {},
  methods: {
    addToVIewer(model) {
      this.rendered.push(model);
    },
    removeFromVIewer(model) {
      for(let i = 0; i < this.rendered.length; i++) {
        if (this.rendered[i].sha1 == model.sha1) {
          this.rendered.splice(i, 1);
          break;
        }
      }
    },
  },
  components: { ModelList, ModelViewer },
};
</script>

<style scoped></style>
