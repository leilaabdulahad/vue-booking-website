<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFilteringLogic } from '../composables/useFilteringLogic'
import FilterControls from './FiltersControl.vue'
import { fetchProperties } from '../services/propertyService'
import PropertyCard from './PropertyCard.vue'
import OffersCarousel from './OffersCarousel.vue'
import { useProperties } from '../composables/useProperties'

const currentImageIndexes = ref<{ [key: string]: number }>({})
const imageLoadErrors = ref<{ [key: string]: boolean }>({})

const {
  loading,
  error,
  properties,
  loadProperties
} = useProperties()

// using the filteringLogic composable
const {
  searchQuery,
  checkInDate,
  checkOutDate,
  guestCount,
  filteredProperties,
  handleFilters,
  initializeFromRoute
} = useFilteringLogic(properties)


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

onMounted(async () => {
  await loadProperties()
  initializeFromRoute()
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