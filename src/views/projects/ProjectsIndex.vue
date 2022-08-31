<template>
    <div class="is-flex is-flex-direction-row is-flex-grow-1 is-flex-shrink-1 overflow-inherit">
      <project-filter @initializeProjects="onInitializeProjects"/>
      <div class="is-flex-grow-1 is-flex-shrink-1 is-flex is-flex-wrap-wrap is-flex-direction-row is-align-items-baseline is-align-content-baseline p-5 overflow-y-auto">
        <project-card
          v-for="project in projects"
          :key="project.uuid"
          :project="project"
          context="projects"
        ></project-card>
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
      return useProjectsStore(pinia).getFilteredProjects.sort((a, b) => (a.name > b.name) ? 1 : -1);
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
    onInitializeProjects(){
      for(let i in this.projects){
        useProjectsStore(pinia).percistProject(this.projects[i].uuid);
      }
    }
  },
};
</script>

<style scoped>
</style>
