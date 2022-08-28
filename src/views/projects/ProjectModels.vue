<template>
  <div class="columns">
    <div class="column is-two-fifths">
      <ModelList :models="models" :has-viewer="true" @add-to-viewer="addToVIewer"/>
    </div>
    <ModelViewer :models="rendered" class="column is-three-fifths" style="padding-right: 1.5rem" />
    <!--<div class="column is-three-fifths" style="padding-right: 1.5rem">
      <div id="3d-viewer"></div>
    </div>-->
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
      return useProjectsStore(pinia).selectedProject.models;
    },
  },
  props: {},
  methods: {
    addToVIewer(model) {
      this.rendered.push(model);
    },
  },
  components: { ModelList, ModelViewer },
};
</script>

<style scoped></style>
