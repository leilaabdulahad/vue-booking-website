import { createApp } from 'vue'
import { clerkPlugin } from 'vue-clerk'
import App from './App.vue'
import router from './router'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key')
}

const app = createApp(App)

app.use(router)

app.use(clerkPlugin, {
  publishableKey: PUBLISHABLE_KEY
})

app.mount('#app')
