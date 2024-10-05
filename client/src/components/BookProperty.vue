<template>
  <div class="book-property">
    <h3>Book this property</h3>
    <form @submit.prevent="bookProperty">
      <div>
        <label for="startDate">Check-in:</label>
        <input 
          type="date" 
          id="startDate" 
          v-model="startDate" 
          :min="minDate" 
          required 
        />
      </div>
      <div>
        <label for="endDate">Check-out:</label>
        <input 
          type="date" 
          id="endDate" 
          v-model="endDate" 
          :min="startDate" 
          required 
        />
      </div>
      <button type="submit" :disabled="isLoading">{{ isLoading ? 'Booking...' : 'Book Now' }}</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useUser } from 'vue-clerk'

const props = defineProps<{
  propertyId: string
}>()

const startDate = ref('')
const endDate = ref('')
const minDate = ref(new Date().toISOString().split('T')[0])
const unavailableDates = ref([])
const error = ref('')
const success = ref('')
const isLoading = ref(false)

const { user } = useUser()

const fetchUnavailableDates = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/api/bookings/unavailable/${props.propertyId}`)
    unavailableDates.value = response.data.unavailableDates.map((booking: any) => ({
      startDate: new Date(booking.startDate),
      endDate: new Date(booking.endDate),
    }))
  } catch (err) {
    console.error('Error fetching unavailable dates:', err)
  }
}

onMounted(() => {
  fetchUnavailableDates()
})

const bookProperty = async () => {
  isLoading.value = true
  error.value = ''
  success.value = ''

  //making sure user is defined before accessing user.id
  if (!user.value) {
    error.value = 'User not authenticated.'
    isLoading.value = false
    return
  }

  try {
    const response = await axios.post('http://localhost:5000/api/bookings', {
      propertyId: props.propertyId,
      startDate: startDate.value,
      endDate: endDate.value,
      clerkUserId: user.value.id,
    })
    success.value = 'Booking successful!'
    startDate.value = ''
    endDate.value = ''
    fetchUnavailableDates()
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      error.value = `Error booking property: ${err.response.data.message || err.message}`
    } else {
      error.value = 'An unexpected error occurred. Try again.'
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
