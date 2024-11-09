import { ref, watch } from 'vue'

export const useDateRange = (initialStartDate: string | Date | null, initialEndDate: string | Date | null) => {
  const formatDate = (date: string | Date | null) => {
    return date instanceof Date ? date.toISOString().split('T')[0] : date || ''
  }

  const startDate = ref(formatDate(initialStartDate))
  const endDate = ref(formatDate(initialEndDate))
  const minDate = ref(new Date().toISOString().split('T')[0])

  const updateDates = (newStartDate: string | Date, newEndDate: string | Date) => {
    startDate.value = formatDate(newStartDate)
    endDate.value = formatDate(newEndDate)
  }

  watch([startDate, endDate], ([newStartDate, newEndDate]) => {
    console.log('Date range updated:', newStartDate, newEndDate)
  })

  return {
    startDate,
    endDate,
    minDate,
    updateDates
  }
}