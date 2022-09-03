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
      tags: {},
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
      this.filter.searchableKeys = [];
      for (let i in response.data) {
        if (!this.projects.find((p) => p.uuid == response.data[i].uuid)) {
          response.data[i].models = [];
          response.data[i].images = [];
          response.data[i].slices = [];
          response.data[i].files = [];

          if (!this.filter.searchableKeys.includes(response.data[i].name)) {
            this.filter.searchableKeys.push(response.data[i].name);
          }

          for (let tag of response.data[i].tags) {
            if (!this.filter.tags[tag]){
              this.filter.tags[tag] = 1;
            }else{
              this.filter.tags[tag]++;
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
      p.files = [];
      this.projects.push(p);
    },
    async percistProject(uuid) {
      console.log("persisting project",uuid , this.projects[uuid]);
      if(uuid ){
        for(let i in this.projects){
          if(this.projects[i].uuid == uuid){
            const response = await axios.post("/projects/"+this.projects[i].uuid, this.projects[i]);
            this.project = response.data;
          }
        }
      }else{
        const response = await axios.post("/projects/"+this.selectedProject.uuid, this.selectedProject);
        this.project = response.data;
      }
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
          if (!this.projects[i].files || this.projects[i].files.length == 0) {
            await this.fetchProjectFiles(uuid);
          }
          this.selectedProject = this.projects[i];
          return;
        }
      }

      await this.fetchProject(uuid);
      await this.fetchProjectModels(uuid);
      await this.fetchProjectImages(uuid);
      await this.fetchProjectSlices(uuid);
      await this.fetchProjectFiles(uuid);
      this.selectProject(uuid);
    },
    async fetchProjectModels(uuid, force = false) {
      for (let i in this.projects) {
        if (this.projects[i].uuid === uuid) {
          if (this.projects[i].models.length === 0 || force) {
            const response = await axios.get(`/projects/${uuid}/models`);
            this.projects[i].models = response.data;
          }
          return;
        }
      }
    },
    async fetchProjectImages(uuid, force = false) {
      for (let i in this.projects) {
        if (this.projects[i].uuid === uuid) {
          if (this.projects[i].images.length === 0 || force) {
            const response = await axios.get(`/projects/${uuid}/images`);
            this.projects[i].images = response.data;
          }
          return;
        }
      }
    },
    async fetchProjectSlices(uuid, force = false) {
      for (let i in this.projects) {
        if (this.projects[i].uuid === uuid) {
          if (this.projects[i].slices.length === 0 || force) {
            const response = await axios.get(`/projects/${uuid}/slices`);
            this.projects[i].slices = response.data;
          }
          return;
        }
      }
    },
    async fetchProjectFiles(uuid, force = false) {
      for (let i in this.projects) {
        if (this.projects[i].uuid === uuid) {
          if (this.projects[i].files.length === 0 || force) {
            const response = await axios.get(`/projects/${uuid}/files`);
            this.projects[i].files = response.data;
          }
          return;
        }
      }
    },
    async setSelectedProjectImage(imagePath) {
      this.selectedProject.default_image_path = imagePath;
      await this.percistProject();
    },
  },
});
