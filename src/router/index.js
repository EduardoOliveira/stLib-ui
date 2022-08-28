import Vue from 'vue'
import VueRouter from 'vue-router'
import ProjectsIndex from '../views/projects/ProjectsIndex.vue'
import ProjectPage from '../views/projects/ProjectPage.vue'
import ProjectEdit from '../views/projects/ProjectEdit.vue'
import ProjectModels from '../views/projects/ProjectModels.vue'


import DiscoveryIndex from '../views/discovery/DiscoveryIndex.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/projects',
      name: 'Projects',
      component: ProjectsIndex
    },
    {
      path: '/projects/:uuid',
      component: ProjectPage,
      children: [
        {
          path: '',
          component: ProjectModels
        },
        {
          path: 'edit',
          component: ProjectEdit
        }
      ]
    },
    {
      path: '/discovery',
      name: 'Discovery',
      component: DiscoveryIndex
    },
    /*{
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/projects/ProjectsIndex.vue')
    }*/
  ]
})

export default router
