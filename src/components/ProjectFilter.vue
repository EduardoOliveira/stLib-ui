<template>
  <b-sidebar position="static" :delay="true ? 500 : null" type="is-light" open>
    <div class="p-2 mt-5">
      <div class="block">
        <img
          src="https://raw.githubusercontent.com/buefy/buefy/dev/static/img/buefy-logo.png"
          alt="Lightweight UI components for Vue.js based on Bulma"
        />
      </div>

      <b-field label="Filter">
        <b-autocomplete
          rounded
          v-model="filter.search"
          :data="filteredDataArray"
          placeholder="Name or Tag"
          clearable
          @select="(option) => (selected = option)"
        >
          <template #empty>No results found</template>
        </b-autocomplete>
      </b-field>
      <b-field label="Initialized">
        <b-switch v-model="filter.initialized"></b-switch>
      </b-field>
    </div>
  </b-sidebar>
</template>

<script>
import { useProjectsStore } from "@/stores/projects.js";
import { mapWritableState } from "pinia";

export default {
  name: "ProjectFilter",
  data() {
    return {
      selected: null,
    };
  },
  computed: {
    filteredDataArray() {
      return this.filter.searchableKeys.filter((option) => {
        return option.toLowerCase().indexOf(this.filter.search.toLowerCase()) >= 0;
      });
    },

    ...mapWritableState(useProjectsStore, {
      filter: "filter",
    }),
  },
  props: {},
  methods: {},
};
</script>

<style>
.b-sidebar {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}
</style>
