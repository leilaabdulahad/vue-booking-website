<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useUser } from 'vue-clerk'

const props = defineProps<{
  propertyId: string
  checkIn: string | null
  checkOut: string | null
}>()

const emit = defineEmits(['dateChange'])

const localStartDate = ref(props.checkIn || '')
const localEndDate = ref(props.checkOut || '')
const minDate = ref(new Date().toISOString().split('T')[0])
const unavailableDates = ref([])
const error = ref('')
const success = ref('')
const isLoading = ref(false)
const { user } = useUser()

const fetchUnavailableDates = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(`http://localhost:5000/api/bookings/unavailable/${props.propertyId}`)
    unavailableDates.value = response.data.unavailableDates.map((booking: any) => ({
      startDate: new Date(booking.startDate),
      endDate: new Date(booking.endDate),
    }))
  } catch (err) {
    console.error('Error fetching unavailable dates:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchUnavailableDates()
})

const isDateUnavailable = (date: Date) => {
  return unavailableDates.value.some((booking: any) => {
    const start = booking.startDate
    const end = booking.endDate
    return date >= start && date <= end
  })
}

const bookProperty = async () => {
  isLoading.value = true
  error.value = ''
  success.value = ''
  if (!user.value) {
    error.value = 'User not authenticated.'
    isLoading.value = false
    return
  }
  if (isDateUnavailable(new Date(localStartDate.value)) || isDateUnavailable(new Date(localEndDate.value))) {
    error.value = 'Selected dates are unavailable.'
    isLoading.value = false
    return
  }
  try {
    const response = await axios.post('http://localhost:5000/api/bookings', {
      propertyId: props.propertyId,
      startDate: localStartDate.value,
      endDate: localEndDate.value,
      clerkUserId: user.value.id,
    })
    success.value = 'Booking successful!'
    localStartDate.value = ''
    localEndDate.value = ''
    fetchUnavailableDates()
    emit('dateChange', '', '') // Reset dates in parent component
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

watch([localStartDate, localEndDate], ([newStartDate, newEndDate]) => {
  emit('dateChange', newStartDate, newEndDate)
})

watch(() => props.checkIn, (newCheckIn) => {
  if (newCheckIn !== localStartDate.value) {
    localStartDate.value = newCheckIn || ''
  }
})

watch(() => props.checkOut, (newCheckOut) => {
  if (newCheckOut !== localEndDate.value) {
    localEndDate.value = newCheckOut || ''
  }
})
</script>

<template>
  <div class="book-property">
    <h3>Book this property</h3>
    <form @submit.prevent="bookProperty">
      <div>
        <label for="startDate">Check-in:</label>
        <input
          type="date"
          id="startDate"
          v-model="localStartDate"
          :min="minDate"
          required
        />
      </div>
      <div>
        <label for="endDate">Check-out:</label>
        <input
          type="date"
          id="endDate"
          v-model="localEndDate"
          :min="localStartDate"
          required
        />
      </div>
      <button type="submit" :disabled="isLoading || isDateUnavailable(new Date(localStartDate)) || isDateUnavailable(new Date(localEndDate))">
        {{ isLoading ? 'Booking...' : 'Book Now' }}
      </button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>
  </div>
</template>

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