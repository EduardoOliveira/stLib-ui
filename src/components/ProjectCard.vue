<template>
  <div class="card is-flex-shrink-0 m-1">
    <div class="card-image">
      <figure class="image is-16by9">
        <img
          :src="baseUrl + project?.default_image_path"
          alt="Placeholder image"
        />
      </figure>
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <router-link
            class="title is-4"
            :to="{ path: '/' + context + '/' + project.uuid }"
            >{{ project.name }}</router-link
          >
          <!--<p class="subtitle is-6">@johnsmith</p>-->
          
        </div>
      </div>
    </div>
  </div>
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
</style>
