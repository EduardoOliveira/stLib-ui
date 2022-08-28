<template>
  <div>
    <div class="card mb-2" v-for="(model,sha1) in models" :key="sha1">
        <div class="card-content">
            <div class="media">
                <div class="media-left">
                <figure class="image is-48x48">
                    <img :src="'http://192.168.2.186:8000/models/render/' +model.sha1" :alt="model.name" >
                </figure>
                </div>
                <div class="media-content">
                <p class="title is-4">{{model.name}}</p>
                </div>
            </div>
        </div>
        
        <footer class="card-footer">
            <a href="#" class="card-footer-item">Download</a>
            <a v-if="hasViewer" @click="onAddToViewer(model)" class="card-footer-item">3D View</a>
        </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModelList",
  created() {},
  data() {
    return {};
  },
  props: {
    models: {
      type: Array,
      required: true,
    },
    hasViewer: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasCreate: {
      type: Boolean,
      required: false,
      default: false,
    },
    createNewModel: {
      type: Function,
      required: false,
    },
  },
  methods: {
    onAddToViewer(model) {
      this.$emit("add-to-viewer", model);
    },
    onCreateNewModel() {
      this.createNewModel();
    },
  },
};
</script>

<style scoped></style>