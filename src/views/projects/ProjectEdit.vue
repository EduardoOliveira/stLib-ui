<template>
  <div class="mx-5 card">
    <project-edit-form></project-edit-form>
    <footer class="card-footer">
      <a href="#" class="card-footer-item" @click.prevent="save()">Save</a>
      <a href="/discovery" class="card-footer-item">Cancel</a>
    </footer>
  </div>
</template>

<script>
import { useProjectsStore } from "../../stores/projects.js";
import { mapWritableState } from "pinia";
import pinia from "@/stores/store.js";
import ProjectEditForm from "../../components/ProjectEditForm.vue";

export default {
  name: "ProjectEdit",
  components: { ProjectEditForm },
  created() {},
  data() {
    return {};
  },
  computed: {
    ...mapWritableState(useProjectsStore, {
      project: "selectedProject",
    }),
  },
  props: {},
  methods: {
    save() {
      useProjectsStore(pinia).percistProject();
      this.$router.push("/projects/"+ this.project.uuid);
    },
  },
  mounted() {},
};
</script>

<style scoped></style>
