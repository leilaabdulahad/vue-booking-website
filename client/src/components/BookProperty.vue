<script setup lang="ts">
import { computed, watch } from 'vue'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { useUnavailableDates } from '@/composables/booking/useUnavailableDates'
import { useDateRange } from '@/composables/ui/useDateRange'

const props = defineProps<{
  propertyId: string
  checkIn: string | Date | null
  checkOut: string | Date | null
}>()

const emit = defineEmits(['dateChange'])

const { unavailableDates, isLoading: isLoadingDates, isDateUnavailable, loadUnavailableDates } = useUnavailableDates(props.propertyId)
const { startDate, endDate, minDate, updateDates } = useDateRange(props.checkIn, props.checkOut)

const getDatesBetween = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = []
  let currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return dates
}

const disabledDates = computed(() => {
  return unavailableDates.value.flatMap((booking: Booking) =>
    getDatesBetween(new Date(booking.startDate), new Date(booking.endDate))
  )
})

const isDateObject = (value: unknown): value is Date => {
  return Object.prototype.toString.call(value) === '[object Date]' && !isNaN((value as Date).getTime())
}

const handleDateChange = () => {
  if (startDate.value && endDate.value) {
    const startDateStr = isDateObject(startDate.value) ? startDate.value.toISOString() : startDate.value;
    const endDateStr = isDateObject(endDate.value) ? endDate.value.toISOString() : endDate.value;
    emit('dateChange', startDateStr, endDateStr);
  }
}


watch([startDate, endDate], ([newStartDate, newEndDate], [oldStartDate, oldEndDate]) => {
  if (newStartDate && newEndDate && (newStartDate !== oldStartDate || newEndDate !== oldEndDate)) {
    handleDateChange()
  }
})
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
        auto-apply
        required
      />
    </div>
  </div>
</template>

<style scoped>
.book-title{
  text-align: center;
}
</style>