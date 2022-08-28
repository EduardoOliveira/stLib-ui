<template>
  <div>
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

      <template #end>
        <b-navbar-item tag="div">
          <b-navbar-dropdown label="More">
            <b-navbar-item tag="router-link" :to="{ path: '/discovery' }">
              Discovery
            </b-navbar-item>
          </b-navbar-dropdown>
        </b-navbar-item>
      </template>
    </b-navbar>
      <transition name="fade">
        <router-view />
      </transition>
  </div>
</template>
