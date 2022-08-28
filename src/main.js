import Vue from 'vue'
import pinia from "@/stores/store.js";
import {PiniaVuePlugin } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.use(Buefy)
Vue.use(PiniaVuePlugin)
axios.defaults.baseURL = import.meta.env.VITE_API_URL


new Vue({
  router,
  pinia,
  render: (h) => h(App)
}).$mount('#app')
