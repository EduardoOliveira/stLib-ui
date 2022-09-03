<template>
  <div class="box mb-2">
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
      changed: false,
      baseUrl: import.meta.env.VITE_API_URL,
      visible: [],
    };
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  watch: {
    dropFiles(files) {
      this.uploadFiles(files);
    },
    progress(progress) {
      if (this.changed && progress.length == 0) {
        this.$emit("uploaded");
        this.changed = false;
      }
    },
  },
  methods: {
    uploadFiles(files) {
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          let p = {
            progress: 0,
            name: files[i].name,
          };
          let toastId = this.$toast(p.name + " - 0%", {
            closeButton: false,
          });
          
          const formData = new FormData();
          formData.append("file", this.dropFiles[i]);
          formData.append("project", this.project.uuid);
          const headers = { "Content-Type": "multipart/form-data" };
          axios
            .post(this.url, formData, {
              headers: headers,
              onUploadProgress: (progressEvent) => {
                p.progress = Math.floor(
                  (progressEvent.loaded / progressEvent.total) * 100
                );
                this.$toast.update(toastId, {
                  content: p.name + " - " + p.progress + "%",
                });
              },
            })
            .then((res) => {
              console.log(res);
              this.$toast.update(toastId,{options: { timeout:3000},content: "Successfully uploaded " + p.name});
            }).catch(()=>{
              this.$toast.update(toastId,{options: { timeout:3000,type:TYPE.WARNING},content: "Ops... Something went wrong"});
            });
          files.splice(i, 1);
          this.changed = true;
        }
      }
    },
  },
};
</script>

<style scoped>
</style>