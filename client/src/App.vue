<template>
  <div class="app">
    <Navbar />
    <router-view></router-view>
    <UserAuth />
  </div>
</template>

<script setup lang="ts">
import { useUser } from 'vue-clerk'
import Navbar from './components/Navbar.vue'
import UserAuth from './components/UserAuth.vue'
</script>

<style scoped>
.app{
  font-family: sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}
</style>