<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUser } from 'vue-clerk'
import { fetchPropertyById } from '../services/propertyService'
import { bookProperty } from '../services/bookingService'
import BookProperty from '../components/BookProperty.vue'

const route = useRoute()
const router = useRouter()
const { user, isLoaded } = useUser()

const propertyId = route.query.propertyId as string
const checkInDate = ref(route.query.checkIn as string)
const checkOutDate = ref(route.query.checkOut as string)
const property = ref<any>(null)
const loading = ref(true)
const bookingError = ref<string | null>(null)

const fetchProperty = async () => {
  try {
    property.value = await fetchPropertyById(propertyId)
  } catch (error) {
    console.error('Failed to fetch property details:', error)
    bookingError.value = 'Failed to load property details. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProperty)

const numberOfNights = computed(() => {
  if (!checkInDate.value || !checkOutDate.value) return 0
  const start = new Date(checkInDate.value)
  const end = new Date(checkOutDate.value)
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
})

const totalPrice = computed(() => {
  if (!property.value) return 0
  return property.value.pricePerNight * numberOfNights.value
})

const handleBooking = async () => {
  if (!user.value) {
    bookingError.value = 'Please log in to book a property'
    return
  }
  loading.value = true
  try {
    const bookingResult = await bookProperty(
      propertyId,
      checkInDate.value,
      checkOutDate.value,
      user.value.id
    )
    router.push({
      name: 'BookingConfirmation',
      query: { bookingId: bookingResult._id }
    })
  } catch (error) {
    console.error('Failed to create booking:', error)
    bookingError.value = 'Failed to create booking. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleDateChange = (startDate: string, endDate: string) => {
  checkInDate.value = startDate
  checkOutDate.value = endDate
}

const isButtonDisabled = computed(() => {
  return !checkInDate.value || !checkOutDate.value || loading.value
})
</script>

<template>
  <div class="booking-page">
    <h1>Confirm Your Booking</h1>
    <div v-if="loading" class="loading">Loading property details...</div>
    <div v-else-if="bookingError" class="error">{{ bookingError }}</div>
    <div v-else-if="property" class="booking-details">
      <h2>{{ property.title }}</h2>
      <img :src="property.images[0]" :alt="property.title" class="property-image">
      <BookProperty
        :property-id="propertyId"
        :check-in="checkInDate"
        :check-out="checkOutDate"
        @date-change="handleDateChange"
      />
      <div class="booking-info">
        <p><strong>Check-in:</strong> {{ checkInDate }}</p>
        <p><strong>Check-out:</strong> {{ checkOutDate }}</p>
        <p><strong>Antal nätt:</strong> {{ numberOfNights }}</p>
        <p>{{ property.pricePerNight }} kr</p>
        <p><strong>Totalt:</strong> {{ totalPrice }} kr</p>
      </div>
      <div class="guest-info">
        <h3>Gäst information</h3>
        <p><strong>Namn:</strong> {{ user?.firstName }} {{ user?.lastName }}</p>
        <p><strong>Email:</strong> {{ user?.emailAddresses[0].emailAddress }}</p>
      </div>
      <button @click="handleBooking" :disabled="isButtonDisabled" class="book-now-btn">
        {{ loading ? 'Processing...' : 'Book Now' }}
      </button>
    </div>
    <div v-else class="error">
      No property details available. Try again
    </div>
  </div>
</template>

<style scoped>
.booking-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.loading, .error {
  text-align: center;
  margin-top: 20px;
}

.property-image {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
}

.booking-info, .guest-info {
  background-color: #f8f8f8;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.book-now-btn {
  background-color: #0077cc;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

.book-now-btn:hover {
  background-color: #005fa3;
}

.book-now-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>