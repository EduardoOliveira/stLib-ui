<template>
  <div class="block mb-2">
    <b-upload v-model="dropFiles" multiple drag-drop expanded>
      <section>
        <div class="content has-text-centered">
          <p>Drop your files here or click to upload</p>
        </div>
      </section>
    </b-upload>
  </div>
</template>

<script>
import axios from "axios";
import { TYPE } from "vue-toastification";

export default {
  name: "FileUpload",
  created() {},
  data() {
    return {
      dropFiles: [],
      complete: false,
      baseUrl: import.meta.env.VITE_API_URL,
      visible: [],
      response: false,
    };
  },
  props: {
    project: {
      type: Object,
    },
    url: {
      type: String,
      default: "/projects",
    },
    newProject: {
      type: Boolean,
    },
  },
  watch: {
    dropFiles() {
      this.uploadFiles(this.dropFiles);
    },
    complete() {
      if (this.complete) {
        console.log("complete",this.response);
        this.$emit("uploaded", this.response);
        this.complete = false;
      }
    },
  },
  methods: {
    async uploadFiles(files) {
      if (files.length > 0) {
        if (this.newProject) {
          let toastId = this.$toast("0%", {
            closeButton: false,
          });
          const formData = new FormData();
          formData.append("project", "new");
          for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
          }
          this.response = await this.send("Uploading", formData, toastId);
          console.log("response", this.response);
        } else {
          for (let i = 0; i < files.length; i++) {
            this.sendFile(files[i], this.project.uuid);
          }
        }
        this.uploadFiles = [];
        this.complete = true;
      }
    },
    sendFile(file, id) {
      let toastId = this.$toast("0%", {
        closeButton: false,
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("project", id);
      this.send(file.name, formData, toastId);
    },
    async send(name, formData, toastId) {
      const headers = { "Content-Type": "multipart/form-data" };
      const resp = await axios({
        method: "post",
        url: this.url,
        data: formData,
        headers: headers,
        onUploadProgress: (progressEvent) => {
          this.$toast.update(toastId, {
            content: name + " - " + Math.floor(
            (progressEvent.loaded / progressEvent.total) * 100
          ) + "%",
          });
        },
      });
      console.log(resp.status);
      if (resp.status == 200) {
        this.$toast.update(toastId, {
          options: { timeout: 3000 },
          content: "Successfully uploaded " + name,
        });
        return resp.data;
      } else {
        this.$toast.update(toastId, {
          options: { timeout: 3000, type: TYPE.WARNING },
          content: "Ops... Something went wrong",
        });
        return false;
      }
    },
  },
};
</script>

<style scoped></style>
