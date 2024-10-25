<script setup lang="ts">
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { useDatePickerState } from '../composables/useDatePickerState'
import { useDisabledDates } from '../composables/useDisabledDates'

const props = defineProps<{
  propertyId: string
  checkIn: string | Date | null
  checkOut: string | Date | null
}>()

const { startDate, endDate, minDate } = useDatePickerState({
  propertyId: props.propertyId,
  initialCheckIn: props.checkIn,
  initialCheckOut: props.checkOut
})

const { disabledDates, isLoadingDates } = useDisabledDates(props.propertyId)
</script>

<template>
  <div class="book-property">
    <h3 class="book-title">Välj datum</h3>
    <div>
      <label for="startDate">Check-in:</label>
      <Datepicker
        v-model="startDate"
        :min-date="minDate"
        :disabled-dates="disabledDates"
        :loading="isLoadingDates"
        auto-apply
        required
      />
    </div>
    <div>
      <label for="endDate">Check-out:</label>
      <Datepicker
        v-model="endDate"
        :min-date="startDate || minDate"
        :disabled-dates="disabledDates"
        :loading="isLoadingDates"
        auto-apply
        required
      />
    </div>
  </div>
</template>