<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BookProperty from './BookProperty.vue'
import { updatePropertyDates } from '../services/propertyService'

const props = defineProps<{
  property: Property
  propertyId: string
}>()

const route = useRoute()
const router = useRouter()

const checkInDate = ref<string | null>(route.query.checkIn as string || null)
const checkOutDate = ref<string | null>(route.query.checkOut as string || null)

//calculations
const numberOfNights = computed(() => {
  if (!checkInDate.value || !checkOutDate.value) return 0
  
  const start = new Date(checkInDate.value)
  const end = new Date(checkOutDate.value)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

const basePrice = computed(() => props.property.pricePerNight)
const stayDiscount = computed(() => numberOfNights.value > 7 ? 0.1 : 0)
const totalPrice = computed(() => {
  if (numberOfNights.value === 0) return 0
  return (numberOfNights.value * basePrice.value * (1 - stayDiscount.value)) + 350 + 500
})

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0
  }).format(amount).replace('SEK', 'kr')
}

const updateDates = async (newCheckIn: string, newCheckOut: string) => {
  checkInDate.value = newCheckIn
  checkOutDate.value = newCheckOut
  try {
    await updatePropertyDates(props.propertyId, newCheckIn, newCheckOut)
    router.replace({
      query: {
        ...route.query,
        checkIn: newCheckIn,
        checkOut: newCheckOut
      }
    })
  } catch (err) {
    console.error('Error updating property dates:', err)
  }
}

const redirectToBookingPage = () => {
  if (checkInDate.value && checkOutDate.value) {
    router.push({
      name: 'BookingPage',
      query: {
        propertyId: props.propertyId,
        checkIn: checkInDate.value,
        checkOut: checkOutDate.value
      }
    })
  } else {
    alert('Please select check-in and check-out dates before proceeding')
  }
}

const isDateRangeSelected = computed(() => checkInDate.value && checkOutDate.value)
</script>

<template>
  <div class="booking-sidebar">
    <div class="booking-card">
      <div class="booking-form">
        <BookProperty 
          :propertyId="propertyId" 
          :checkIn="checkInDate" 
          :checkOut="checkOutDate"
          @dateChange="updateDates"
        />

        <div v-if="isDateRangeSelected">
          <div class="price-details">
            <div class="price-row">
              <span>{{ numberOfNights }} nätter</span>
            </div>
            <div class="price-header">
              <span class="price">{{ formatPrice(property.pricePerNight) }}</span>
              <span class="price-period"> kr/natt</span>
            </div>

            <div class="price-total">
              <strong>Totalt</strong>
              <strong>{{ formatPrice(totalPrice) }}</strong>
            </div>
            <div class="fees-included-note">inklusive avigifter</div>
          </div>

          <button 
            @click="redirectToBookingPage" 
            class="reserve-btn"
            :disabled="!isDateRangeSelected">
            Reservera
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.price-row.small {
  font-size: 12px;
  margin-bottom: 8px;
}

.price-total {
  font-size: 18px;
}

.booking-card {
  position: sticky;
  top: 80px;
  border: 1px solid #DDDDDD;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.12);
  background: white;
}

.price-header {
  margin-bottom: 24px;
}
 .price {
  /* font-size: 22px;
  font-weight: 600; */
  font-size: 16px;
  color: #717171;
} 

.price-period {
  font-size: 16px;
  color: #717171;
}

.reserve-btn {
  width: 100%;
  background: #1E3E62;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 16px;
  cursor: pointer;
}

.reserve-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.price-details {
  margin-top: 24px;
  border-top: 1px solid #DDDDDD;
  padding-top: 24px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  color: #717171;
}

.price-total {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #DDDDDD;
  font-size: 16px;
  color: #222222;
}

@media (max-width: 1000px) {
  .booking-card {
    position: static;
    margin-top: 32px;
  }
}
</style>