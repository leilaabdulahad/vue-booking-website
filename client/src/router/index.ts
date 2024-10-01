import { createRouter, createWebHistory } from 'vue-router'
import CreatePropertyView from '../views/CreatePropertyView.vue'
import PropertiesViews from '../views/PropertiesViews.vue'
import PropertyDetail from '../components/PropertyDetail.vue'

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
    {
      path: '/property/:id',
      name: 'PropertyDetail',
      component: PropertyDetail,
      props: true,
    },

  ]
})

export default router