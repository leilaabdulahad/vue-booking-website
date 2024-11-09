import { ref, watch } from 'vue'
import type { FilterUpdateEvent } from '@/types/filter'

export const useFilter = (emit: FilterUpdateEvent) => {
  const searchQuery = ref('')
  const checkInDate = ref<string | null>(null)
  const checkOutDate = ref<string | null>(null)
  const guestCount = ref(1)
  const showDateDropdown = ref(false)

  //toggles the visibility of the date dropdown
  const toggleDateDropdown = () => {
    showDateDropdown.value = !showDateDropdown.value
  }

  //watcher to emit filter updates whenever any filter state changes
  watch([searchQuery, checkInDate, checkOutDate, guestCount], () => {
    emit('filterUpdated', {
      searchQuery: searchQuery.value,
      checkInDate: checkInDate.value,
      checkOutDate: checkOutDate.value,
      guestCount: guestCount.value
    })
  })

  const handleSearch = (query: string) => {
    searchQuery.value = query
  }

  const updateGuestCount = (count: number) => {
    guestCount.value = count
  }

  return {
    searchQuery,
    checkInDate,
    checkOutDate,
    guestCount,
    showDateDropdown,
    toggleDateDropdown,
    handleSearch,
    updateGuestCount
  }
}