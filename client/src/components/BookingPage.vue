<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUser } from 'vue-clerk'
import { useRoute, useRouter } from 'vue-router'
import ValidationModal from './ValidationModal.vue'
import { useBooking } from '@/composables/booking/useBooking'
import { usePricing } from '@/composables/pricing/usePricing'
import { usePropertyDetails } from '@/composables/property/usePropertyDetails'
import { useGuestInfo } from '@/composables/guest/useGuestInfo'
import { useFormValidation } from '@/composables/ui/useFormValidation'

const route = useRoute()
const router = useRouter()
const { user } = useUser()

const propertyId = route.query.propertyId as string
const checkInDate = ref(route.query.checkIn as string)
const checkOutDate = ref(route.query.checkOut as string)

const { 
  property, 
  loading, 
  error: propertyError,
  fetchProperty 
} = usePropertyDetails(propertyId)

const { 
  firstName, 
  lastName, 
  email 
} = useGuestInfo()

const {
  showValidationModal,
  missingFields,
  error: validationError,
  validateForm,
  getInputValue
} = useFormValidation()

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
  serviceFee,
} = usePricing({
  property,
  checkInDate,
  checkOutDate,
})

// Computed error state that combines all possible errors
const error = computed(() => propertyError.value || bookingError.value || validationError.value)

// Booking
const handleBookNow = async () => {
  if (!user.value) {
    validationError.value = 'Please log in to book a property'
    return
  }

  // Required fields for booking
  const requiredFields = [
    { value: firstName.value, label: 'Förnamn' },
    { value: lastName.value, label: 'Efternamn' },
    { value: getInputValue('Adress'), label: 'Adress' },
    { value: getInputValue('Postnummer'), label: 'Postnummer' },
    { value: getInputValue('Ort'), label: 'Ort' },
    { value: email.value, label: 'Mailadress' },
    { value: getInputValue('Telefonnummer'), label: 'Telefonnummer' },
    { value: getInputValue('Kortnummer'), label: 'Kortnummer' },
    { value: getInputValue('Datum'), label: 'Datum' },
    { value: getInputValue('CVV'), label: 'CVV' },
  ]

  if (!validateForm(requiredFields)) {
    return
  }

  const address = getInputValue('Adress')
  const postalCode = getInputValue('Postnummer')
  const city = getInputValue('Ort')
  const phoneNumber = getInputValue('Telefonnummer')

  const bookingResult = await handleBooking(
    checkInDate.value,
    checkOutDate.value,
    firstName.value,
    lastName.value,
    address,
    postalCode,
    city,
    email.value,
    phoneNumber
  )

  if (bookingResult?.confirmationToken) {
    router.push({
      name: 'BookingConfirmation',
      query: { token: bookingResult.confirmationToken },
    })
  } else {
    validationError.value = 'No confirmation token received'
  }
}

// Computed property for button disabled state
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
      <div class="property-card">
        <img :src="property.images[0]" :alt="property.title" class="property-image" />
        <div class="property-info">
          <h2>{{ property.title }}</h2>
          <p>{{ property.rooms }} rum · {{ property.beds }} sängar · {{ property.maxGuests }} gäster</p>
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
          <input type="text" placeholder="Förnamn" v-model="firstName" required />
          <input type="text" placeholder="Efternamn" v-model="lastName" required />
          <input type="text" placeholder="Adress" class="full-width" required />
          <input type="text" placeholder="Postnummer" required />
          <input type="text" placeholder="Ort" required />
          <input type="email" placeholder="Mailadress" v-model="email" class="full-width" required />
          <input type="tel" placeholder="Telefonnummer" class="full-width" required />
        </div>
      </div>

      <div class="payment-info">
        <h3>Betalning</h3>
        <div class="form-grid">
          <input type="text" placeholder="Kortnummer" class="full-width" required />
          <input type="text" placeholder="Datum" required />
          <input type="text" placeholder="CVV" required />
        </div>
      </div>

      <button 
        @click="handleBookNow" 
        :disabled="isButtonDisabled" 
        class="book-now-btn"
      >
        {{ bookingLoading ? 'Laddar...' : 'Reservera och betala' }}
      </button>
      <ValidationModal
        v-model:isOpen="showValidationModal"
        :missing-fields="missingFields"
      />
      
    </div>
    <div v-else class="error">
      <p>Inget boende tillgängligt</p>
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
