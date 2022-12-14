<template>
  <div
    class="is-flex is-flex-direction-row is-flex-grow-1 is-flex-shrink-1 overflow-inherit"
    v-on:dragover="isDrag"
    v-on:dragleave="endDrag"
  >
    <project-filter @initializeProjects="onInitializeProjects" />
    <div
      class="is-flex-grow-1 is-flex-shrink-1 is-flex is-flex-wrap-wrap is-flex-direction-row is-align-items-baseline is-align-content-baseline p-5 overflow-y-auto"
    >
      <project-card
        v-for="project in projects"
        :key="project.uuid"
        :project="project"
        context="projects"
      ></project-card>
    </div>
    <b-collapse
      aria-id="contentIdForA11y2"
      class="panel new-project"
      animation="slide"
      v-model="isOpen"
    >
      <template #trigger>
        <div
          class="panel-heading is-info"
          role="button"
          aria-controls="contentIdForA11y2"
          :aria-expanded="isOpen"
        >
          <strong>New Project</strong>
        </div>
      </template>
      <div class="panel-block" style="display:block">
          <div class="field has-addons">
            <div class="control">
              <input class="input" type="text" placeholder="URL or thing:xxx" v-model="url"/>
            </div>
            <div class="control">
              <a class="button is-info" @click="importProject"> Import </a>
            </div>
          </div>
          <file-upload new-project @uploaded="onUploaded" />
      </div>
    </b-collapse>
  </div>
</template>

<script>
import { useProjectsStore } from "../../stores/projects.js";
import pinia from "@/stores/store.js";
import ProjectCard from "../../components/ProjectCard.vue";
import ProjectFilter from "@/components/ProjectFilter.vue";
import FileUpload from "../../components/FileUpload.vue";
import axios from "axios";

export default {
  name: "ProjectsIndex",
  components: { ProjectCard, ProjectFilter, FileUpload },
  created() {},
  data() {
    return {
      isOpen: false,
      showZone: false,
      dropFiles: [],
      url: "",
    };
  },
  computed: {
    projects() {
      return useProjectsStore(pinia).getFilteredProjects.sort((a, b) =>
        a.name > b.name ? 1 : -1
      );
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
    onUploaded(response) {
      console.log("uploaded", response.uuid);
      if (response && response.uuid) {
        this.$router.push({ path: `/projects/${response.uuid}/edit` });
      }
    },
    onInitializeProjects() {
      for (let i in this.projects) {
        useProjectsStore(pinia).initProject(this.projects[i].uuid);
      }
    },
    isDrag: function () {
      this.isOpen = true;
    },
    endDrag: function () {
      setTimeout(() => (this.isOpen = false), 5000);
    },
    importProject() {
      if (this.url) {
        axios.post("/downloader/fetch", { url: this.url }).then(() => {
          this.$toast("Project imported", {
            type: "success",
          });
        }).catch(() => {
          this.$toast("Failed to import project", {
            type: "error",
          });
        });
      }
    },
  },
};
</script>

<style scoped>
.new-project {
  position: fixed;
  bottom: 0;
  right: 100px;
}
</style>
