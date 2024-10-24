import { ref, computed, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import debounce from 'lodash/debounce'


export const useFilteringLogic = (properties: Ref<Property[]>) => {
  const route = useRoute()
  const router = useRouter()

  const searchQuery = ref('')
  const debouncedSearchQuery = ref('')
  const guestCount = ref(1)
  const checkInDate = ref<string | null>(null)
  const checkOutDate = ref<string | null>(null)

  const updateDebouncedSearchQuery = debounce((value: string) => {
    debouncedSearchQuery.value = value
  }, 300)

  watch(searchQuery, (newValue) => {
    updateDebouncedSearchQuery(newValue)
  })

  const filteredProperties = computed(() => {
    return properties.value.filter(property => {
      const matchesSearch = !debouncedSearchQuery.value || 
        property.location.country.toLowerCase().includes(debouncedSearchQuery.value.toLowerCase()) ||
        property.location.city.toLowerCase().includes(debouncedSearchQuery.value.toLowerCase())
      const matchesGuests = property.maxGuests >= guestCount.value
      return matchesSearch && matchesGuests
    })
  })

  const handleFilters = (filters: {
    searchQuery: string,
    checkInDate: string | null,
    checkOutDate: string | null,
    guestCount: number
  }) => {
    searchQuery.value = filters.searchQuery
    checkInDate.value = filters.checkInDate
    checkOutDate.value = filters.checkOutDate
    guestCount.value = filters.guestCount
  }

  // URL syncing
  watch([checkInDate, checkOutDate, debouncedSearchQuery, guestCount], () => {
    router.replace({
      query: {
        ...route.query,
        checkIn: checkInDate.value,
        checkOut: checkOutDate.value,
        search: debouncedSearchQuery.value,
        guests: guestCount.value?.toString()
      }
    })
  })

  const initializeFromRoute = () => {
    searchQuery.value = route.query.search as string || ''
    checkInDate.value = route.query.checkIn as string || null
    checkOutDate.value = route.query.checkOut as string || null
    guestCount.value = Number(route.query.guests) || 1
  }

  return {
    searchQuery,
    debouncedSearchQuery,
    checkInDate,
    checkOutDate,
    guestCount,
    filteredProperties,
    handleFilters,
    initializeFromRoute
  }
}