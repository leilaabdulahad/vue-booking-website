<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import UserAuth from './components/UserAuth.vue'
</script>

<template>
  <div class="app">
    <Navbar />
    <router-view />
    <UserAuth />
  </div>
</template>

<style scoped>
.app{
  font-family: sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}
</style>