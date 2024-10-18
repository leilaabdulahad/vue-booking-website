<script setup lang="ts">
import { computed } from 'vue'
import { useUser } from 'vue-clerk'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { useUnavailableDates } from '../composables/useUnavailableDates'
import { useBooking } from '../composables/useBooking'
import { useDateRange } from '../composables/useDateRange'

const props = defineProps<{
  propertyId: string
  checkIn: string | null
  checkOut: string | null
}>()

const emit = defineEmits(['dateChange'])

const { user } = useUser()

const { unavailableDates, isLoading: isLoadingDates, isDateUnavailable, loadUnavailableDates } = useUnavailableDates(props.propertyId)

const { error, success, isLoading: isBookingLoading, handleBookProperty } = useBooking(props.propertyId, user.value?.id || '')

const { startDate, endDate, minDate, updateDates } = useDateRange(props.checkIn, props.checkOut)

const isLoading = computed(() => isLoadingDates.value || isBookingLoading.value)

const isButtonDisabled = computed(() => 
  isLoading.value || 
  isDateUnavailable(new Date(startDate.value)) || 
  isDateUnavailable(new Date(endDate.value))
)

const handleDateChange = () => {
  emit('dateChange', startDate.value, endDate.value)
}

const submitBooking = async () => {
  if (!user.value) {
    error.value = 'User not authenticated.'
    return
  }

  if (isDateUnavailable(new Date(startDate.value)) || isDateUnavailable(new Date(endDate.value))) {
    error.value = 'Selected dates are unavailable.'
    return
  }

  await handleBookProperty(startDate.value, endDate.value)

  if (success.value) {
    updateDates('', '')
    emit('dateChange', '', '')
    loadUnavailableDates()
  }
}
</script>

<template>
  <div class="book-property">
    <h3>Book this property</h3>
    <form @submit.prevent="submitBooking">
      <div>
        <label for="startDate">Check-in:</label>
        <Datepicker v-model="startDate" :min-date="minDate" @update:modelValue="handleDateChange" required />
      </div>
      <div>
        <label for="endDate">Check-out:</label>
        <Datepicker v-model="endDate" :min-date="startDate" @update:modelValue="handleDateChange" required />
      </div>
      <button type="submit" :disabled="isButtonDisabled">
        {{ isLoading ? 'Booking...' : 'Book Now' }}
      </button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>
  </div>
</template>