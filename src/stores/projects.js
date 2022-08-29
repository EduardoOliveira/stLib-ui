import { defineStore } from "pinia";
import axios from "axios";


export const useProjectsStore = defineStore({
  id: "projects",
  state: () => ({
    projects: [],
    filteredProjects: [],
    selectedProject: {
      models: [],
      images: [],
      slices: [],
    },
    filter: {
      initialized: true,
      search: "",
      searchableKeys: [],
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
      this.filter.searchableKeys=[]
      for (let i in response.data) {
        if (!this.projects.find((p) => p.uuid == response.data[i].uuid)) {
          response.data[i].models = [];
          response.data[i].images = [];
          response.data[i].slices = [];
          
          if(!this.filter.searchableKeys.includes(response.data[i].name)){
            this.filter.searchableKeys.push(response.data[i].name);
          }

          for (let tag of response.data[i].tags) {
            if(!this.filter.searchableKeys.includes(tag)){
              this.filter.searchableKeys.push(tag);
            }
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
      p.slices = [];
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
          if (!this.projects[i].slices || this.projects[i].slices.length == 0) {
            await this.fetchProjectSlices(uuid);
          }
          this.selectedProject = this.projects[i];
          return;
        }
      }
      
      await this.fetchProject(uuid);
      await this.fetchProjectModels(uuid);
      await this.fetchProjectImages(uuid);
      await this.fetchProjectSlices(uuid);
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
    async fetchProjectSlices(uuid) {
      for (let i in this.projects) {
        if (this.projects[i].uuid === uuid) {
          if (this.projects[i].slices.length === 0) {
            const response = await axios.get(`/projects/${uuid}/slices`);
            this.projects[i].slices.push(...response.data);
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
