<template>
  <div
    class="px-5 is-flex is-flex-direction-row is-flex-wrap-wrap is-align-items-flex-star is-align-content-baseline overflow-y-auto">
    <FileUpload :project="project" :url="baseUrl + '/files'" class="upload m-1"  @uploaded="onUploaded"/>
    <div class="card m-1" v-for="file in files" :key="file.sha1">
      <div class="card-image">
        <b-icon :icon="toIcon(file.extension)" size="is-large" type="is-info" class="mx-auto" style="display: block;">
        </b-icon>
      </div>
      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <p class="subtitle is-6 has-text-centered">{{ file.name }}</p>
          </div>
        </div>
      </div>
      <footer class="card-footer">
        <a :href="baseUrl + '/files/get/' + file.sha1" class="card-footer-item">Download</a>
      </footer>
    </div>
  </div>
</template>

<script>
import { useProjectsStore } from "../../stores/projects.js";
import pinia from "@/stores/store.js";
import FileUpload from "../../components/FileUpload.vue";

export default {
  name: "ProjectFiles",
  created() { },
  data() {
    return {
      baseUrl: import.meta.env.VITE_API_URL,
    };
  },
  computed: {
    project() {
      return useProjectsStore(pinia).selectedProject;
    },
    files() {
      return useProjectsStore(pinia).selectedProject.files.sort((a, b) => (a.name > b.name) ? 1 : -1);
    },
  },
  props: {},
  methods: {
    toIcon(extension) {
      if (extension == ".jpg" || extension == ".jpeg" || extension == ".png" || extension == ".gif") {
        return "image-area";
      } else if (extension == ".mp4" || extension == ".webm" || extension == ".ogg" || extension == ".ogv" || extension == ".avi" || extension == ".mov" || extension == ".wmv" || extension == ".flv" || extension == ".mkv" || extension == ".m4v" || extension == ".mpg" || extension == ".mpeg" || extension == ".3gp" || extension == ".3g2") {
        return "video-vintage";
      } else if (extension == ".pdf") {
        return "file-pdf-box";
      } else if (extension == ".doc" || extension == ".docx") {
        return "file-word";
      } else if (extension == "xls" || extension == ".xlsx") {
        return "file-excel";
      } else if (extension == ".ppt" || extension == ".pptx") {
        return "file-powerpoint";
      } else if (extension == ".txt") {
        return "file-text";
      } else if (extension == ".zip" || extension == ".rar") {
        return "zip-box";
      } else if (extension == ".mp3" || extension == ".wav" || extension == ".wma" || extension == ".aac" || extension == ".flac" || extension == ".m4a" || extension == ".oga" || extension == ".ogg" || extension == ".opus" || extension == ".webma" || extension == ".weba" || extension == ".webm") {
        return "music-note-eighth";
      } else if (extension == ".stp" || extension == ".blend") {
        return "cube";
      } else {
        return "text-box-outline"
      }
    },
    onUploaded() {
      useProjectsStore(pinia).fetchProjectFiles(this.project.uuid, true);
    }
  },
  components: { FileUpload }
};
</script>

<style scoped>
.card,
.upload {
  width: 200px;
  max-width: 200px;
  min-width: 200px;
}
</style>
