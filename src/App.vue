<template>
  <div class="is-flex is-flex-direction-column is-flex-grow-1 is-flex-shrink-1 overflow-inherit">
    <b-navbar class="is-dark">
      <template #brand>
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <img
            src="https://raw.githubusercontent.com/buefy/buefy/dev/static/img/buefy-logo.png"
            alt="Lightweight UI components for Vue.js based on Bulma"
          />
        </b-navbar-item>
      </template>
      <template #start>
        <b-navbar-item tag="router-link" :to="{ path: '/projects' }">
          Projects
        </b-navbar-item>
      </template>
    </b-navbar>
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
  </div>
</template>

<style scoped>
</style>