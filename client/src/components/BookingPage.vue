<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUser } from 'vue-clerk'
import { fetchPropertyById } from '../services/propertyService'
import { useBooking } from '@/composables/booking/useBooking'
import { usePricing } from '@/composables/pricing/usePricing'

const route = useRoute()
const router = useRouter()
const { user, isLoaded } = useUser()

const propertyId = route.query.propertyId as string
const checkInDate = ref(route.query.checkIn as string)
const checkOutDate = ref(route.query.checkOut as string)
const property = ref<Property | null>(null)
const loading = ref(true)
const error = ref('')

const { 
  error: bookingError, 
  success, 
  isLoading: bookingLoading, 
  handleBooking 
} = useBooking(propertyId, user.value?.id ?? '')

const {
  numberOfNights,
  basePrice,
  totalPrice,
  formattedDateRange,
  cleaningFee,
  serviceFee
} = usePricing({
  property,
  checkInDate,
  checkOutDate
})

const fetchProperty = async () => {
  try {
    property.value = await fetchPropertyById(propertyId)
  } catch (err) {
    console.error('Failed to fetch property details:', err)
    error.value = 'Failed to load property details. Try again.'
  } finally {
    loading.value = false
  }
}

const handleBookNow = async () => {
  if (!user.value) {
    error.value = 'Please log in to book a property'
    return
  }

  const formData = {
    firstName: (document.querySelector('input[placeholder="Förnamn"]') as HTMLInputElement)?.value,
    lastName: (document.querySelector('input[placeholder="Efternamn"]') as HTMLInputElement)?.value,
    address: (document.querySelector('input[placeholder="Adress"]') as HTMLInputElement)?.value,
    postalCode: (document.querySelector('input[placeholder="Postnummer"]') as HTMLInputElement)?.value,
    city: (document.querySelector('input[placeholder="Ort"]') as HTMLInputElement)?.value,
    email: (document.querySelector('input[placeholder="Mailadress"]') as HTMLInputElement)?.value,
    phoneNumber: (document.querySelector('input[placeholder="Telefonnummer"]') as HTMLInputElement)?.value
  }

  const bookingResult = await handleBooking(
    checkInDate.value,
    checkOutDate.value,
    formData.firstName,
    formData.lastName,
    formData.address,
    formData.postalCode,
    formData.city,
    formData.email,
    formData.phoneNumber
  )

  if (success.value) {
    router.push({
      name: 'BookingConfirmation',
      query: { bookingId: bookingResult._id }
    })
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
      <h1>Skicka bokningsförfrågan</h1>
    </div>

    <div v-if="loading" class="loading">Loading property details...</div>
    <div v-if="error || bookingError" class="error">{{ error || bookingError }}</div>

    <div v-else-if="property" class="booking-details">
      <!-- Property -->
      <div class="property-card">
        <img :src="property.images[0]" :alt="property.title" class="property-image">
        <div class="property-info">
          <h2>{{ property.title }}</h2>
          <p>{{ property.rooms }} rum · {{ property.beds }} sängar · {{ property.maxGuests }} gäster</p>
          
          <!-- Date -->
          <div class="date-section">
            <p class="label">Datum</p>
            <p>{{ formattedDateRange }}</p>
          </div>

          <!-- Pricing -->
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

      <!-- Guest form -->
      <div class="guest-info">
        <h3>Dina kontaktuppgifter</h3>
        <div class="form-grid">
          <input type="text" placeholder="Förnamn" :value="user?.firstName">
          <input type="text" placeholder="Efternamn" :value="user?.lastName">
          <input type="text" placeholder="Adress" class="full-width">
          <input type="text" placeholder="Postnummer">
          <input type="text" placeholder="Ort">
          <input 
            type="email" 
            placeholder="Mailadress" 
            :value="user?.emailAddresses[0].emailAddress" 
            class="full-width"
          >
          <input type="tel" placeholder="Telefonnummer" class="full-width">
        </div>
      </div>

      <!-- Payment form -->
      <div class="payment-info">
        <h3>Betalning</h3>
        <div class="form-grid">
          <input type="text" placeholder="Kortnummer" class="full-width">
          <input type="text" placeholder="Datum">
          <input type="text" placeholder="CVV">
        </div>
      </div>
      
      <!-- Booking button -->
      <button 
        @click="handleBookNow" 
        :disabled="isButtonDisabled" 
        class="book-now-btn"
      >
        {{ bookingLoading ? 'Laddar...' : 'Reservera och betala' }}
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
  margin-top: 50px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
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
  gap: 1.2rem;
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
  max-width: 300px;
  display: block;
  margin: 1.5rem auto;
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