<template>
    <div class="book-property">
      <h3>Book this property</h3>
      <form @submit.prevent="bookProperty">
        <div>
          <label for="startDate">Check-in:</label>
          <input type="date" id="startDate" v-model="startDate" required>
        </div>
        <div>
          <label for="endDate">Check-out:</label>
          <input type="date" id="endDate" v-model="endDate" required>
        </div>
        <button type="submit" :disabled="isLoading">{{ isLoading ? 'Booking...' : 'Book Now' }}</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import axios from 'axios'
  
  const props = defineProps<{
    propertyId: string
  }>()
  
  const startDate = ref('')
  const endDate = ref('')
  const error = ref('')
  const success = ref('')
  const isLoading = ref(false)
  
  const bookProperty = async () => {
    isLoading.value = true
    error.value = ''
    success.value = ''
  
    try {
      const response = await axios.post('http://localhost:5000/api/bookings', {
        propertyId: props.propertyId,
        startDate: startDate.value,
        endDate: endDate.value,
      })
      success.value = 'Booking successful!'
      startDate.value = ''
      endDate.value = ''
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        error.value = `Error booking property: ${err.response.data.message || err.message}`
      } else {
        error.value = 'An unexpected error occurred. Please try again.'
      }
      console.error('Error booking property:', err)
    } finally {
      isLoading.value = false
    }
  }
  </script>
  
  <style scoped>
  .book-property {
    margin-top: 20px;
  }
  form div {
    margin-bottom: 10px;
  }
  .error {
    color: red;
  }
  .success {
    color: green;
  }
  </style>
  