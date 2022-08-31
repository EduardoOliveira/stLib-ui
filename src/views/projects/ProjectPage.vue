<template>
  <div class="pt-5 is-flex is-flex-direction-column is-flex-grow-1 is-flex-shrink-1 overflow-inherit">
    <section class="hero has-background mx-5 mb-5 is-flex-shrink-0  is-dark">
      <img class="hero-background is-transparent" :src="baseUrl + project.default_image_path" />
      <div class="hero-body">
        <div class="container">
          <p class="title">
            {{  project.name  }}
          </p>
          <p class="subtitle" v-if="project.external_link != ''">
            <a :href="project.external_link">{{  project.external_link  }}</a>
          </p>
          <p class="subtitle" v-if="project.external_link == ''">&nbsp;</p>

          <div class="tags">
            <span class="tag is-info is-light" v-for="(tag, i) in project.tags" :key="i">
              {{  tag  }}
            </span>
          </div>
        </div>
      </div>

      <div class="hero-foot">
        <nav class="tabs is-fullwidth">
          <div class="container">
            <ul>
              <router-link :to="'/projects/' + project.uuid" v-slot="{ href, navigate, isExactActive }" custom>
                <li :class="[isExactActive && 'is-active']">
                  <a :href="href" @click="navigate">Models</a>
                </li>
              </router-link>
              <router-link :to="'/projects/' + project.uuid + '/slices'" v-slot="{ href, navigate, isExactActive }"
                custom>
                <li :class="[isExactActive && 'is-active']">
                  <a :href="href" @click="navigate">Slices</a>
                </li>
              </router-link>
              <router-link :to="'/projects/' + project.uuid + '/images'" v-slot="{ href, navigate, isExactActive }"
                custom>
                <li :class="[isExactActive && 'is-active']">
                  <a :href="href" @click="navigate">Images</a>
                </li>
              </router-link>
              <router-link :to="'/projects/' + project.uuid + '/files'" v-slot="{ href, navigate, isExactActive }"
                custom>
                <li :class="[isExactActive && 'is-active']">
                  <a :href="href" @click="navigate">Files</a>
                </li>
              </router-link>
              <router-link :to="'/projects/' + project.uuid + '/edit'" v-slot="{ href, navigate, isExactActive }"
                custom>
                <li :class="[isExactActive && 'is-active']">
                  <a :href="href" @click="navigate">Edit</a>
                </li>
              </router-link>
            </ul>
          </div>
        </nav>
      </div>
    </section>

    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import { useProjectsStore } from "../../stores/projects.js";
import pinia from "@/stores/store.js";

export default {
  name: "ProjectPage",
  created() { },
  data() {
    return {
      baseUrl: import.meta.env.VITE_API_URL,
    };
  },
  computed: {
    project() {
      return useProjectsStore(pinia).getSelectedProject;
    },
  },
  beforeRouteEnter(to, from, next) {
    useProjectsStore(pinia).selectProject(to.params.uuid);
    next();
  },
  beforeRouteUpdate(to, from, next) {
    useProjectsStore(pinia).selectProject(to.params.uuid);
    next();
  },
  props: {},
  methods: {
    setData(err, project) {
      if (err) {
        this.error = err.toString();
      } else {
        this.project = project;
      }
    },
  },
};
</script>

<style scoped>
.hero.has-background {
  position: relative;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  object-fit: cover;
  object-position: center center;
  width: 100%;
  height: 100%;
}

.hero-background.is-transparent {
  opacity: 0.3;
}
</style>
