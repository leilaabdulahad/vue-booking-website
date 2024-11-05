<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFilteringLogic } from '../composables/useFilteringLogic'
import Navbar from './Navbar.vue'
import PropertyCard from './PropertyCard.vue'
import OffersCarousel from './OffersCarousel.vue'
import { useProperties } from '../composables/useProperties'
import { useImageCarousel } from '../composables/useImageCarousel'

const {
  loading,
  error,
  properties,
  loadProperties
} = useProperties()

const {
  currentImageIndexes,
  imageLoadErrors,
  initializeImageIndexes,
  handleImageError,
  nextImage,
  prevImage
} = useImageCarousel(properties)

const {
  searchQuery,
  checkInDate,
  checkOutDate,
  guestCount,
  filteredProperties,
  handleFilters,
  initializeFromRoute
} = useFilteringLogic(properties)

onMounted(async () => {
  await loadProperties()
  initializeFromRoute()
})
</script>

<template>
  <div class="property-list-page">
    <Navbar
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