<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BookProperty from './BookProperty.vue'
import { usePropertyPricing } from '@/composables/usePropertyPricing'
import { useBookingDates } from '@/composables/useBookingDates'

const props = defineProps<{
  property: Property
  propertyId: string
}>()

const route = useRoute()
const router = useRouter()

const initialCheckInDate = ref<string | null>(route.query.checkIn as string || null)
const initialCheckOutDate = ref<string | null>(route.query.checkOut as string || null)

const {
  numberOfNights,
  basePrice,
  totalPrice,
  formatPrice
} = usePropertyPricing({
  checkInDate: initialCheckInDate,
  checkOutDate: initialCheckOutDate,
  pricePerNight: props.property.pricePerNight
})

const {
  bookingCheckInDate,
  bookingCheckOutDate,
  updateDates
} = useBookingDates(props.propertyId)

const isDateRangeSelected = computed(() => bookingCheckInDate.value && bookingCheckOutDate.value)

// booking page navigation
const redirectToBookingPage = () => {
  if (bookingCheckInDate.value && bookingCheckOutDate.value) {
    router.push({
      name: 'BookingPage',
      query: {
        propertyId: props.propertyId,
        checkIn: bookingCheckInDate.value,
        checkOut: bookingCheckOutDate.value
      }
    })
  } else {
    alert('Please select check-in and check-out dates before proceeding')
  }
}
</script>

<template>
  <div class="booking-sidebar">
    <div class="booking-card">
      <div class="booking-form">
        <BookProperty 
          :propertyId="propertyId" 
          :checkIn="bookingCheckInDate" 
          :checkOut="bookingCheckOutDate"
          @dateChange="updateDates"
        />

        <div v-if="isDateRangeSelected">
          <div class="price-details">
            <div class="price-row">
              <span>{{ numberOfNights }} nätter</span>
            </div>
            <div class="price-header">
              <span class="price">{{ formatPrice(props.property.pricePerNight) }}</span>
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
.booking-sidebar {
  margin-top: 20px;
}
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
