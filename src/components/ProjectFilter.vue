<template>
  <b-sidebar position="static" type="is-light" fullheight open mobile="hide">
    <div class="p-2">
      <b-field label="Filter">
        <b-autocomplete rounded v-model="filter.search" :data="filteredDataArray" placeholder="Name" :clearable="true" @select="(option) => (selected = option)">
          <template #empty>No results found</template>
        </b-autocomplete>
      </b-field>
      <div class="field is-grouped is-grouped-multiline">
        <div class="control" v-for="(l, k) in filter.tags" :key="k">
          <div class="tags has-addons is-clickable" @click="filter.search = k" >
            <span class="tag is-dark">{{ k }}</span>
            <span class="tag is-info">{{ l }}</span>
          </div>
        </div>
      </div>
      <b-field label="Initialized">
        <b-switch type="is-info" v-model="filter.initialized"></b-switch>
      </b-field>

      <b-field label="Initialize projects" v-if="!filter.initialized">
        <b-button type="is-info" @click="initProjects" expanded>I'm sure</b-button>
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
    })
  },
  props: {},
  methods: {
    initProjects() {
      this.$emit("initializeProjects");
    }  
  },
};
</script>

<style>
.b-sidebar {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}
</style>
