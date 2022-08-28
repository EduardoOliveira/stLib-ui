<template>
  <div></div>
</template>

<script>
import { ProjectsService } from "../../services/projectsService.js";

export default {
  name: "DiscoverPage",
  created() {},
  data() {
     return {
      project: {
        tags: [],
      },
      models: {},
    };
  },
  props: {},
   methods: {
    addTag(tag) {
      if (tag.name != "" && tag.value != "") {
        tag.new = false;
        this.project.tags.push({ name: "", value: "", new: true });
      }
    },
    removeTag(tag) {
      const index = this.project.tags.indexOf(tag);
      if (index > -1) {
        this.project.tags.splice(index, 1);
      }
    },
    projectModelImages(models) {
      let rtn = [];
      for (const [key, value] of Object.entries(models)) {
        rtn.push({
          type: "model",
          name: value.name,
          sha1: value.sha1,
        });
      }
      
      return rtn;
    },
    onImageChange(image) {
      if (image.type == "model") {
        this.project.default_image_path = '/models/render/' + image.sha1;
      }
    },
    save() {
      ProjectsService.save(this.project).then((response) => {
        this.$router.push("/projects");
      });
    },
    setData(err, models) {
      if (err) {
        this.error = err.toString();
      } else {
        this.models = models;
      }
    },
    initTags() {
      if (this.project != null) {
        if (this.project.tags.length == 0) {
          this.project.tags.push({ name: "", value: "", new: true });
        } else if (
          this.project.tags.length > 0 &&
          !this.project.tags[this.project.tags.length - 1].new
        ) {
          this.project.tags.push({ name: "", value: "", new: true });
        }
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    ProjectsService.getProjectModels(to.params.uuid).then((response) => {
      next((vm) => {
        vm.models = response.data;
      });
    });
  },
  beforeRouteUpdate(to, from, next) {
    this.models = {};
    ProjectsService.getProjectModels(to.params.uuid)
      .then((response) => {
        this.setData(null, response.data);
        next();
      })
      .catch((err) => {
        this.setData(err);
      });
  },
};
</script>

<style scoped></style>
