<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { useUserSync } from '@/composables/user/useUserSync'

useUserSync()

</script>

<template>
  <div class="app">
    <Navbar />
    <router-view />
    <Footer />
  </div>
</template>

<style scoped>
.app {
  font-family: sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

footer {
  margin-top: auto;
}
</style>
