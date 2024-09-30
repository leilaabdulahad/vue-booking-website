import { createRouter, createWebHistory } from 'vue-router'
import CreatePropertyView from '../views/CreatePropertyView.vue'
import PropertiesViews from '../views/PropertiesViews.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView,
    // },
    {
      path: '/properties',
      name: 'properties',
      component: PropertiesViews,
    },
    {
      path: '/create-property',
      name: 'create-property',
      component: CreatePropertyView,
    },

  ]
})

export default router