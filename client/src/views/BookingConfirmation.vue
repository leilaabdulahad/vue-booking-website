<template>
    <div class="booking-confirmation">
      <h1>Bokningsbekräftelse</h1>
      <div v-if="bookingId">
        <p>Boknings ID: <strong>{{ bookingId }}</strong></p>
      </div>
      <div v-else>
        <p>Ingen bokningsinformation tillgänglig</p>
      </div>
      <router-link to="/properties">Hem</router-link>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  //getting the booking ID from the query params
  const bookingId = route.query.bookingId as string 
  </script>
  
  <style scoped>
  .booking-confirmation {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
    margin: 100px;
  }
  </style>
  