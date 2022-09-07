import { defineStore } from "pinia";
import axios from "axios";

export const useProjectsStore = defineStore({
  id: "projects",
  state: () => ({
    projects: {},
    filteredProjects: {},
    selectedProject: {
      assets: {},
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
    getSelectedProjectModels: (state) => {
      if (state.selectedProject.assets) {
        return Object.values(state.selectedProject.assets).filter(
          (m) => m.asset_type === "model"
        );
      }
      return {};
    },
    getSelectedProjectFiles: (state) => {
      if (state.selectedProject.assets) {
        return Object.values(state.selectedProject.assets).filter(
          (m) => m.asset_type === "file"
        );
      }
      return {};
    },
    getSelectedProjectImages: (state) => {
      if (state.selectedProject.assets) {
        return Object.values(state.selectedProject.assets).filter(
          (m) => m.asset_type === "image"
        );
      }
      return {};
    },
    getSelectedProjectSlices: (state) => {
      if (state.selectedProject.assets) {
        return Object.values(state.selectedProject.assets).filter(
          (m) => m.asset_type === "slice"
        );
      }
      return {};
    },
  },
  actions: {
    async fetchProjects() {
      const response = await axios.get("/projects");
      this.filter.searchableKeys = [];
      for (let i in response.data) {
        response.data[i].assets = {};

        if (!this.filter.searchableKeys.includes(response.data[i].name)) {
          this.filter.searchableKeys.push(response.data[i].name);
        }
        for (let tag of response.data[i].tags) {
          if (!this.filter.tags[tag]) {
            this.filter.tags[tag] = 1;
          } else {
            this.filter.tags[tag]++;
          }
        }
      }
      this.projects = response.data;
    },
    async fetchProject(uuid) {
      const response = await axios.get(`/projects/${uuid}`);
      let p = response.data;
      p.assets = {};
      this.projects[p.uuid] = p;
    },
    async percistProject(uuid) {
      console.log("persisting project", uuid, this.projects[uuid]);
      if (uuid) {
        for (let i in this.projects) {
          if (this.projects[i].uuid == uuid) {
            const response = await axios.post(
              "/projects/" + this.projects[i].uuid,
              this.projects[i]
            );
            this.project = response.data;
          }
        }
      } else {
        const response = await axios.post(
          "/projects/" + this.selectedProject.uuid,
          this.selectedProject
        );
        this.project = response.data;
      }
    },
    async selectProject(uuid) {
      if (Object.keys(this.projects[uuid].assets).length == 0) {
        await this.fetchProjectAssets(uuid);
      }
      this.selectedProject = this.projects[uuid];
    },
    async fetchProjectAssets(uuid, force = false) {
      if (Object.keys(this.projects[uuid].assets).length == 0 || force) {
        const response = await axios.get(`/projects/${uuid}/assets`);
        this.projects[uuid].assets = response.data;
      }
    },
    async setSelectedProjectImage(imgSha1) {
      this.selectedProject.default_image_path = imgSha1;
      await this.percistProject();
    },
    async initProject(uuid) {
      await axios.post(`/projects/${uuid}/init`);
      for (let i in this.projects) {
        if (this.projects[i].uuid == uuid) {
          this.projects[i].initialized = true;
        }
      }
    },
  },
});
