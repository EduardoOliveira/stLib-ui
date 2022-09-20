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
import { TYPE } from "vue-toastification";

export default {
  name: "ProjectEdit",
  components: { ProjectEditForm },
  created() { },
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
      try {
        useProjectsStore(pinia).percistProject();
        this.$toast("Project Saved", {
          timeout: 2000,
        });
        this.$router.push("/projects/" + this.project.uuid);
      } catch (e) {
        this.$toast("Failed to save project", {
          timeout: 2000,
          type: TYPE.WARNING
        });
      }
    },
  },
  mounted() { },
};
</script>

<style scoped>

</style>
