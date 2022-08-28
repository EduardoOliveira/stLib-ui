<template>
  <div class="card-content">
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Name</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input class="input" type="text" name="name" v-model="p.name" placeholder="Benchie" />
          </div>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Path</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input class="input" type="text" name="path" disabled v-model="p.path" />
          </div>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">External Link</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input class="input" type="text" name="external_link" v-model="p.external_link"
              placeholder="Thigiverse or whatever" />
          </div>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Tags</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <b-taginput v-model="p.tags" ellipsis icon="label" placeholder="Add a tag"
              aria-close-label="Delete this tag">
            </b-taginput>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { useProjectsStore } from "@/stores/projects.js";
import {mapWritableState} from 'pinia'
export default {
  name: "ProjectEditForm",
  created() { },
  data() {
    return {
    };
  },
  computed: {
    ...mapWritableState(useProjectsStore, {
      p: 'selectedProject',
    }),
  },
  props: {
  },
  methods: {},
};
</script>

<style scoped>
</style>