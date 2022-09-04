<template>
  <router-link
    class="title is-4"
    :to="{ path: '/' + context + '/' + project.uuid }"
  >
    <div class="card m-1">
      <div class="card-image">
        <b-image
          :src="baseUrl + project?.default_image_path"
          ratio="4by3"
        ></b-image>
      </div>
      <div class="card-content">
        <div class="media">
          <div class="media-content">
            {{ project.name }}
          </div>
        </div>
      </div>
    </div></router-link
  >
</template>

<script>
export default {
  name: "ProjectCard",
  created() {},
  data() {
    return {
      baseUrl: import.meta.env.VITE_API_URL,
    };
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
    context: {
      type: String,
      required: true,
    },
  },
  methods: {},
};
</script>

<style scoped>
.card {
  width: 300px;
  max-width: 300px;
  min-width: 300px;
}
.card .media-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
