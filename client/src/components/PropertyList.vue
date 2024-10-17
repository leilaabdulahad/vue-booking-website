<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import axios from 'axios'
import debounce from 'lodash/debounce'
import { useRoute, useRouter } from 'vue-router'
import FilterControls from './FiltersControl.vue'
import FavoritesManager from './FavoriteManager.vue'
import { fetchProperties } from '../services/propertyService'
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
    
    <h1 class="property-title">Populära destinationer</h1>
    
    <div v-if="loading" class="loading-indicator">Laddar...</div>
    <div v-if="error" class="error-message">{{ error }}</div>
    
    <TransitionGroup 
      name="property-list" 
      tag="div" 
      class="property-grid"
    >
      <div 
        v-for="property in filteredProperties" 
        :key="property._id" 
        class="property-card"
      >
        <div class="property-image-container">
          <img 
            :src="getCurrentImage(property)" 
            @error="handleImageError(property._id)"
            alt="Property Image"
            class="property-image"
          />
          <div class="favorite-button-overlay">
            <FavoritesManager :propertyId="property._id" />
          </div>
          <button class="carousel-button prev" @click.prevent="prevImage(property._id)">‹</button>
          <button class="carousel-button next" @click.prevent="nextImage(property._id)">›</button>
        </div>
        <router-link 
          :to="{
            name: 'PropertyDetail',
            params: { id: property._id },
            query: { checkIn: checkInDate, checkOut: checkOutDate }
          }"
          class="property-link"
        >
          <div class="property-info">
            <div class="title-rating-container">
              <h3 class="property-title">{{ property.title }}</h3>
              <div class="rating">
                <i class="fas fa-star"></i>
                {{ property.rating.toFixed(1) }}
              </div>
            </div>
            <p class="property-details">{{ property.rooms }} rum · {{ property.beds }} sängar</p>
            <span class="price">{{ property.pricePerNight }} kr per natt</span>
          </div>
        </router-link>
      </div>
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

.property-card {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.property-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.property-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.property-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.property-card:hover {
  transform: scale(1.05);
}

.favorite-button-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}

.carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.7);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 20px;
  color: #333;
}

.carousel-button:hover {
  background-color: rgba(255, 255, 255, 0.9);
}

.carousel-button.prev {
  left: 10px;
}

.carousel-button.next {
  right: 10px;
}

.property-link {
  text-decoration: none;
  color: inherit;
}

.property-info {
  padding: 15px;
}

.title-rating-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.property-title {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.rating {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.rating i {
  margin-right: 4px;
}

.property-details {
  margin: 0 0 10px;
  font-size: 14px;
  color: #666;
}

.price {
  display: block;
  font-weight: bold;
  font-size: 16px;
}

/* Transitions */
.property-list-enter-active,
.property-list-leave-active {
  transition: all 0.5s ease;
}

.property-list-enter-from,
.property-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.property-list-move {
  transition: transform 0.5s ease;
}

@media (max-width: 768px) {
  .property-grid {
    grid-template-columns: 1fr;
  }
}
</style>