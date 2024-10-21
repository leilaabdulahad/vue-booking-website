<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUser } from 'vue-clerk'
import { fetchPropertyById } from '../services/propertyService'
import { bookProperty } from '../services/bookingService'

const route = useRoute()
const router = useRouter()
const { user, isLoaded } = useUser()

const propertyId = route.query.propertyId as string
const checkInDate = ref(route.query.checkIn as string)
const checkOutDate = ref(route.query.checkOut as string)
const property = ref<any>(null)
const loading = ref(true)
const bookingError = ref<string | null>(null)

const cleaningFee = 500
const serviceFee = 350

//updates the existing numberOfNights
const numberOfNights = computed(() => {
  if (!checkInDate.value || !checkOutDate.value) return 0
  const start = new Date(checkInDate.value)
  const end = new Date(checkOutDate.value)
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
})

const basePrice = computed(() => {
  if (!property.value) return 0
  return property.value.pricePerNight * numberOfNights.value
})

//updates the existing totalPrice 
const totalPrice = computed(() => {
  return basePrice.value + cleaningFee + serviceFee
})

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.toLocaleString('sv-SE', { month: 'long' })
  return `${day} ${month}`
}

const formattedDateRange = computed(() => {
  if (!checkInDate.value || !checkOutDate.value) return ''
  const formattedCheckIn = formatDate(checkInDate.value)
  const formattedCheckOut = formatDate(checkOutDate.value)
  return `${formattedCheckIn} - ${formattedCheckOut}`
})

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

const isButtonDisabled = computed(() => {
  return !checkInDate.value || !checkOutDate.value || loading.value
})

fetchProperty()
</script>

<template>
  <div class="booking-page">
    <div class="header">
      <span class="back-arrow">←</span>
      <h1>Skicka bokningsförfrågan</h1>
    </div>
    <div v-if="loading" class="loading">Loading property details...</div>
    <div v-else-if="bookingError" class="error">{{ bookingError }}</div>
    <div v-else-if="property" class="booking-details">
      <div class="property-card">
        <img :src="property.images[0]" :alt="property.title" class="property-image">
        <div class="property-info">
          <h2>{{ property.title }}</h2>
          <p>{{ property.rooms }} rum · {{ property.beds }} sängar · {{ property.guests }} gäster</p>
          <div class="date-section">
            <p class="label">Datum</p>
            <p>{{ formattedDateRange }}</p>
          </div>
          <div class="fees-section">
            <div class="fee-line">
              <p>{{ numberOfNights }} nätter x {{ property.pricePerNight }} kr</p>
              <p>{{ basePrice }} kr</p>
            </div>
            <div class="fee-line">
              <p>Städavgift</p>
              <p>{{ cleaningFee }} kr</p>
            </div>
            <div class="fee-line">
              <p>EurBNB serviceavgift</p>
              <p>{{ serviceFee }} kr</p>
            </div>
            <div class="total-line">
              <p><strong>Totalt</strong></p>
              <p><strong>{{ totalPrice }} kr</strong></p>
            </div>
            <p class="including-fees">inklusive avgifter</p>
          </div>
        </div>
      </div>

      <div class="guest-info">
        <h3>Dina kontaktuppgifter</h3>
        <div class="form-grid">
          <input type="text" placeholder="Förnamn" :value="user?.firstName">
          <input type="text" placeholder="Efternamn" :value="user?.lastName">
          <input type="text" placeholder="Adress" class="full-width">
          <input type="text" placeholder="Postnummer">
          <input type="text" placeholder="Ort">
          <input type="email" placeholder="Mailadress" :value="user?.emailAddresses[0].emailAddress" class="full-width">
          <input type="tel" placeholder="Telefonnummer" class="full-width">
        </div>
      </div>

      <div class="payment-info">
        <h3>Betalning</h3>
        <div class="form-grid">
          <input type="text" placeholder="Kortnummer" class="full-width">
          <input type="text" placeholder="Datum">
          <input type="text" placeholder="CVV">
        </div>
      </div>
      
      <button @click="handleBooking" :disabled="isButtonDisabled" class="book-now-btn">
        {{ loading ? 'Laddar...' : 'Reservera och betala' }}
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
  font-family: Arial, sans-serif;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.back-arrow {
  font-size: 24px;
  margin-right: 10px;
  cursor: pointer;
}

h1 {
  font-size: 1.2rem;
  font-weight: bold;
}

.property-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}

.property-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.property-info {
  padding: 15px;
  font-size: 0.9rem;
}

h2 {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.date-section {
  margin: 0.75rem 0;
}

.label {
  font-weight: bold;
}

.fees-section {
  border-top: 1px solid #e0e0e0;
  padding-top: 0.75rem;
}

.fee-line, .total-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.total-line {
  font-weight: bold;
  margin-top: 0.5rem;
}

.including-fees {
  font-size: 0.8rem;
  color: #666;
  text-align: right;
}

h3 {
  font-size: 1.1rem;
  font-weight: bold;
  margin: 1.5rem 0 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.full-width {
  grid-column: 1 / -1;
}

.book-now-btn {
  background-color: #1E3E62;
  color: white;
  border: none;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-top: 1.5rem;
}

.book-now-btn:hover {
  background-color: #15304D;
}

.book-now-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.loading, .error {
  text-align: center;
  margin-top: 2rem;
}

@media (min-width: 768px) {
  .property-card {
    flex-direction: row;
  }

  .property-image {
    width: 200px;
    height: auto;
  }

  .property-info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .fees-section {
    margin-top: auto;
    border-top: none;
    padding-top: 0;
  }
}
</style>