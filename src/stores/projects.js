import { defineStore } from "pinia";
import axios from "axios";


export const useProjectsStore = defineStore({
  id: "projects",
  state: () => ({
    projects: [],
    filteredProjects: [],
    selectedProject: {
      models: [],
    },
    filter: {
      initialized: true,
      search: "",
      searchableKeys: new Set(),
    },
  }),
  getters: {
    getProjects: (state) => {
      return state.projects;
    },
    getFilteredProjects: (state) => {
      state.filteredProjects = [];
      
      for (let i in state.projects) {
        if (
          state.filter.initialized == state.projects[i].initialized &&
          (state.filter.search === "" ||
            state.projects[i].name
              .toLowerCase()
              .includes(state.filter.search.toLowerCase()) ||
            state.projects[i].tags.includes(state.filter.search))
        ) {
          state.filteredProjects.push(state.projects[i]);
        }
      }
      return state.filteredProjects;
    },
    getSelectedProject: (state) => state.selectedProject,
  },
  actions: {
    async fetchProjects() {
      const response = await axios.get("/projects");
      for (let i in response.data) {
        if (!this.projects.find((p) => p.uuid == response.data[i].uuid)) {
          response.data[i].models = [];
          response.data[i].images = [];
          response.data[i].slices = [];
          this.filter.searchableKeys.add(response.data[i].name);
          for (let tag of response.data[i].tags) {
            this.filter.searchableKeys.add(tag);
          }
          this.projects.push(response.data[i]);
        }
      }
    },
    async fetchProject(uuid) {
      const response = await axios.get(`/projects/${uuid}`);
      let p = response.data;
      p.models = [];
      p.images = [];
      this.projects.push(p);
    },
    async percistProject() {
      const response = await axios.post("/projects", this.selectedProject);
      this.project = response.data;
    },
    async selectProject(uuid) {
      for (let i in this.projects) {
        if (this.projects[i].uuid === uuid) {
          if (!this.projects[i].models || this.projects[i].models.length == 0) {
            await this.fetchProjectModels(uuid);
          }
          if (!this.projects[i].images || this.projects[i].images.length == 0) {
            await this.fetchProjectImages(uuid);
          }
          this.selectedProject = this.projects[i];
          return;
        }
      }
      
      await this.fetchProject(uuid);
      await this.fetchProjectModels(uuid);
      await this.fetchProjectImages(uuid);
      this.selectProject(uuid);
    },
    async fetchProjectModels(uuid) {
      for (let i in this.projects) {
        if (this.projects[i].uuid === uuid) {
          if (this.projects[i].models.length === 0) {
            const response = await axios.get(`/projects/${uuid}/models`);
            this.projects[i].models.push(...response.data);
          }
          return;
        }
      }
    },
    async fetchProjectImages(uuid) {
      for (let i in this.projects) {
        if (this.projects[i].uuid === uuid) {
          if (this.projects[i].images.length === 0) {
            const response = await axios.get(`/projects/${uuid}/images`);
            this.projects[i].images.push(...response.data);
          }
          return;
        }
      }
    },
    async setSelectedProjectImage(imagePath) {
      this.selectedProject.default_image_path=imagePath;
      await this.percistProject();
    },
  },
});
