<template>
  <div class="container is-flex is-flex-direction-row is-flex-wrap-wrap">
    <project-card
      v-for="(project, uuid) in projects"
      :key="uuid"
      :project="project"
      context="discovery"
    ></project-card>
  </div>
</template>

<script>
import ProjectCard from "../../components/ProjectCard.vue";
import { DiscoveryService } from "../../services/discoveryService.js";

export default {
  name: "DiscoveryIndex",
  components: { ProjectCard },
  data() {
    return {
      error: null,
      projects: [],
    };
  },
  beforeRouteEnter(to, from, next) {
    DiscoveryService.getProjects().then((response) => {
      console.log(response.data);
      next((vm) => {
        vm.projects = response.data;
      });
    });
  },
  beforeRouteUpdate(to, from, next) {
    this.projects = [];
    DiscoveryService.getProjects()
      .then((response) => {
        this.setData(null, response.data);
        next();
      })
      .catch((err) => {
        this.setData(err);
      });
  },
  props: {},
  methods: {
    setData(err, projects) {
      if (err) {
        this.error = err.toString();
      } else {
        this.projects = projects;
      }
    },
  },
};
</script>

<style scoped></style>
