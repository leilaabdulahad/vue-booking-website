<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import debounce from 'lodash/debounce'
import { useRoute, useRouter } from 'vue-router'
import FilterControls from './FiltersControl.vue'
import { fetchProperties } from '../services/propertyService'
import PropertyCard from './PropertyCard.vue'
import OffersCarousel from './OffersCarousel.vue'
//state
const loading = ref(false)
const error = ref<string | null>(null)
const properties = ref<Property[]>([])
const searchQuery = ref('')
const debouncedSearchQuery = ref('')
const guestCount = ref(1)
const checkInDate = ref<string | null>(null)
const checkOutDate = ref<string | null>(null)
const currentImageIndexes = ref<{ [key: string]: number }>({})
const imageLoadErrors = ref<{ [key: string]: boolean }>({})

const route = useRoute()
const router = useRouter()

//fecthing properties using propertyService
const loadProperties = async () => {
  loading.value = true
  error.value = null
  try {
    const data = await fetchProperties()
    properties.value = data
    properties.value.forEach(property => {
      currentImageIndexes.value[property._id] = 0
      imageLoadErrors.value[property._id] = false
    })
  } catch (err) {
    if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = 'An unknown error occurred while loading properties.'
    }
    properties.value = []
  } finally {
    loading.value = false
  }
}


//image handling
const getCurrentImage = (property: Property): string => {
  if (!property.images || property.images.length === 0 || imageLoadErrors.value[property._id]) {
    return '/path/to/placeholder-image.jpg' 
  }
  return property.images[currentImageIndexes.value[property._id]]
}

const handleImageError = (propertyId: string) => {
  imageLoadErrors.value[propertyId] = true
}

const nextImage = (propertyId: string) => {
  const property = properties.value.find(p => p._id === propertyId)
  if (property) {
    const totalImages = property.images.length
    currentImageIndexes.value[propertyId] = (currentImageIndexes.value[propertyId] + 1) % totalImages
  }
}

const prevImage = (propertyId: string) => {
  const property = properties.value.find(p => p._id === propertyId)
  if (property) {
    const totalImages = property.images.length
    currentImageIndexes.value[propertyId] = (currentImageIndexes.value[propertyId] - 1 + totalImages) % totalImages
  }
}

//filtering
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

//handle filters update
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

//URL syncing
watch([checkInDate, checkOutDate, debouncedSearchQuery, guestCount], () => {
  nextTick(() => {
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
})

//initialization
onMounted(async () => {
  await loadProperties()
  searchQuery.value = route.query.search as string || ''
  checkInDate.value = route.query.checkIn as string || null
  checkOutDate.value = route.query.checkOut as string || null
  guestCount.value = Number(route.query.guests) || 1
})
</script>

<template>
  <div class="property-list-page">
    <FilterControls 
      :initialSearchQuery="searchQuery"
      :initialCheckInDate="checkInDate"
      :initialCheckOutDate="checkOutDate"
      :initialGuestCount="guestCount"
      @filterUpdated="handleFilters" 
    />

    <OffersCarousel
      :properties="properties"
      :currentImageIndexes="currentImageIndexes"
      :imageLoadErrors="imageLoadErrors"
      :checkInDate="checkInDate"
      :checkOutDate="checkOutDate"
      @imageError="handleImageError"
      @prevImage="prevImage"
      @nextImage="nextImage"
    />
    
    <h1 class="property-title">Populära destinationer</h1>
    
    <div v-if="loading" class="loading-indicator">Laddar...</div>
    <div v-if="error" class="error-message">{{ error }}</div>
    
    <TransitionGroup 
      name="property-list" 
      tag="div" 
      class="property-grid"
    >
      <PropertyCard
        v-for="property in filteredProperties"
        :key="property._id"
        :property="property"
        :currentImageIndex="currentImageIndexes[property._id]"
        :hasImageLoadError="imageLoadErrors[property._id]"
        :checkInDate="checkInDate"
        :checkOutDate="checkOutDate"
        @imageError="handleImageError"
        @prevImage="prevImage"
        @nextImage="nextImage"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.property-list-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.property-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
  color: #333;
}

.loading-indicator, .error-message {
  text-align: center;
  padding: 20px;
  font-size: 1.2rem;
  color: #666;
}

.error-message {
  color: #d32f2f;
}

.property-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

@media (max-width: 768px) {
  .property-grid {
    grid-template-columns: 1fr;
  }
}
</style>