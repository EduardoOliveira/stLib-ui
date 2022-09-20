<template>
  <router-link class="title is-4" :to="{ path: '/' + context + '/' + project.uuid }">
    <div class="card m-1">
      <header class="card-header">
        <p class="card-header-title">
          {{project.name }}
        </p>
      </header>
      <div class="card-image">
        <b-image :src="baseUrl+'/projects/'+project?.uuid +'/assets/'+ project?.default_image_path" ratio="4by3">
        </b-image>
      </div>
    </div>
  </router-link>
</template>

<script>

export default {
  name: "ProjectCard",
  created() { },
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
  methods: {
  },
};
</script>

<style scoped>
.card {
  width: 300px;
  max-width: 300px;
  min-width: 300px;
  position: relative;
}

.card:hover header{
  display: block;
}

.card .media-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

header {
  display: none;
  background-color: rgba(245, 245, 245, 0.5);
  position: absolute;
  z-index: 999;
  width: 300px;
  max-width: 300px;
}

.card-header-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 300px;
  max-width: 300px;
  font-size: 1rem;
  display:inline-block
}
</style>
