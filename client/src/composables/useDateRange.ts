import { ref, watch } from 'vue'

export const useDateRange = (inititalStartDate: string | null, inititalEndDate: string | null) => {
  const startDate = ref(inititalStartDate || '')
  const endDate = ref(inititalEndDate || '')
  const minDate = ref(new Date().toISOString().split('T')[0])

  //function to update the start and end dates
  const updateDates = (newStartDate: string, newEndDate: string) => {
    startDate.value = newStartDate
    endDate.value = newEndDate
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