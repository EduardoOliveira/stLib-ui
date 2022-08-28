<template>
  <div class="is-flex is-flex-direction-column">
    <div class="is-flex is-flex-direction-row">
      <project-filter></project-filter>
      <div class="container is-flex is-flex-direction-row is-flex-wrap-wrap is-align-items-flex-start mt-5">
        <project-card
          v-for="project in projects"
          :key="project.uuid"
          :project="project"
          context="projects"
        ></project-card>
      </div>
    </div>
  </div>
</template>

<script>
import { useProjectsStore } from "../../stores/projects.js";
import pinia from "@/stores/store.js";
import ProjectCard from "../../components/ProjectCard.vue";
import ProjectFilter from "@/components/ProjectFilter.vue";

export default {
  name: "ProjectsIndex",
  components: { ProjectCard, ProjectFilter },
  created() {},
  data() {
    return {};
  },
  computed: {
    projects() {
      return useProjectsStore(pinia).getFilteredProjects;
    },
  },
  beforeRouteEnter(to, from, next) {
    useProjectsStore(pinia).fetchProjects();
    next();
  },
  beforeRouteUpdate(to, from, next) {
    useProjectsStore(pinia).fetchProjects();
    next();
  },
  props: {},
  methods: {
  },
};
</script>

<style scoped>

</style>
