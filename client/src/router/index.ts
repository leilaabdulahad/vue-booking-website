import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SignInView from '@/views/SignInView.vue'
import CreatePropertyView from '@/views/CreatePropertyView.vue'
import PropertiesViews from '@/views/PropertiesViews.vue'
import PropertyDetail from '@/components/PropertyDetail.vue'
import FavoritesView from '@/views/FavoritesView.vue'
import MyBookings from '@/views/MyBookingsView.vue'
import BookingPage from '@/views/BookingView.vue'
import BookingConfirmationView from '@/views/BookingConfirmationView.vue' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/properties',
      name: 'properties',
      component: PropertiesViews
    },
    {
      path: '/create-property',
      name: 'create-property',
      component: CreatePropertyView
    },
    {
      path: '/property/:id',
      name: 'PropertyDetail',
      component: PropertyDetail,
      props: true,
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: FavoritesView
    },
    {
      path: '/booking',
      name: 'BookingPage',
      component: BookingPage 
    },
    {
      path: '/booking-confirmation', 
      name: 'BookingConfirmation',
      component: BookingConfirmationView 
    },
    {
      path: '/my-bookings',
      name: 'my-bookings',
      component: MyBookings
    },
    {
      path: '/sign-in',
      name: 'SignIn',
      component: SignInView
    },
  ]
})

export default router
