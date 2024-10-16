<script setup lang="ts">
import GuestFilter from '@/components/GuestFilter.vue'
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import debounce from 'lodash/debounce'
import FavoritesManager from './FavoriteManager.vue'
import { useUser } from 'vue-clerk'
import { useRoute, useRouter } from 'vue-router'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const emit = defineEmits(['favoriteToggled'])

const properties = ref<Property[]>([])
const loading = ref(false)
const showLoading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const guestCount = ref(1)
const { user, isLoaded } = useUser()
const route = useRoute()
const router = useRouter()

const checkInDate = ref<string | null>(null)
const checkOutDate = ref<string | null>(null)
const showGuestDropdown = ref(false)
const showDateDropdown = ref(false) // Controls the datepicker visibility

// Toggle the visibility of the datepicker dropdown
const toggleDateDropdown = () => {
  showDateDropdown.value = !showDateDropdown.value
}

// Image carousel state
const currentImageIndexes = ref<{ [key: string]: number }>({})
const imageLoadErrors = ref<{ [key: string]: boolean }>({})

// Fetch properties from the backend
const fetchProperties = async () => {
  try {
    loading.value = true
    showLoading.value = true
    const response = await axios.get<Property[]>('http://localhost:5000/api/properties')
    properties.value = response.data
    properties.value.forEach(property => {
      currentImageIndexes.value[property._id] = 0
      imageLoadErrors.value[property._id] = false
    })
    error.value = null
  } catch (err) {
    console.error('Error fetching properties:', err)
    if (axios.isAxiosError(err)) {
      error.value = `Error fetching properties: ${err.message}. ${err.response?.data?.message || ''}`
    } else {
      error.value = 'An unexpected error occurred while fetching properties'
    }
    properties.value = []
  } finally {
    loading.value = false
    showLoading.value = false
  }
}

// Filter the properties based on search and guest count
const filteredProperties = computed(() => {
  return properties.value.filter(property => {
    const matchesSearch = !searchQuery.value || 
      property.location.country.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      property.location.city.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesGuests = property.maxGuests >= guestCount.value
    return matchesSearch && matchesGuests
  })
})

const debouncedSearch = debounce((query: string) => {
  searchQuery.value = query
}, 300)

const applySearch = (event: Event) => {
  const target = event.target as HTMLInputElement
  debouncedSearch(target.value)
}

const updateGuestCount = (count: number) => {
  guestCount.value = count
}

const toggleGuestDropdown = () => {
  showGuestDropdown.value = !showGuestDropdown.value
}

// Image carousel navigation
const nextImage = (propertyId: string) => {
  const property = properties.value.find(p => p._id === propertyId)
  if (property && property.images) {
    currentImageIndexes.value[propertyId] = (currentImageIndexes.value[propertyId] + 1) % property.images.length
  }
}

const prevImage = (propertyId: string) => {
  const property = properties.value.find(p => p._id === propertyId)
  if (property && property.images) {
    currentImageIndexes.value[propertyId] = (currentImageIndexes.value[propertyId] - 1 + property.images.length) % property.images.length
  }
}

const handleImageError = (propertyId: string) => {
  imageLoadErrors.value[propertyId] = true
}

const getCurrentImage = (property: Property): string => {
  if (!property.images || property.images.length === 0 || imageLoadErrors.value[property._id]) {
    return '/path/to/placeholder-image.jpg' 
  }
  return property.images[currentImageIndexes.value[property._id]]
}

// Watcher to sync URL with changes in check-in/check-out dates, guest count, etc.
watch([checkInDate, checkOutDate, searchQuery, guestCount], ([newCheckIn, newCheckOut, newSearch, newGuestCount]) => {
  router.replace({
    query: {
      ...route.query,
      checkIn: newCheckIn,
      checkOut: newCheckOut,
      search: newSearch,
      guests: newGuestCount
    }
  })
})

watch([user, isLoaded], async ([newUser, loaded]) => {
  if (newUser && loaded) {
    await fetchProperties()
  }
})

onMounted(async () => {
  await fetchProperties()
  checkInDate.value = route.query.checkIn as string || null
  checkOutDate.value = route.query.checkOut as string || null
  guestCount.value = Number(route.query.guests) || 1
})
</script>

<template>
  <div class="property-list-page">
    <div class="filters-container">
      <div class="filters-wrapper">
        <!-- Search filter -->
        <div class="filter-item search-filter">
          <i class="fas fa-search"></i>
          <input
            v-model="searchQuery"
            @input="applySearch"
            placeholder="Sök destination"
            type="text"
            class="property-input"
          />
        </div>

        <!-- Date filter with toggle -->
        <div class="filter-item date-filters">
          <div class="date-input">
            <div>
              <button @click="toggleDateDropdown" class="date-toggle-button">
                Date
              </button>
              <p>Lägg till datum</p>

            </div>
            <div v-if="showDateDropdown" class="date-dropdown">
              <label>Check in</label>
              <Datepicker v-model="checkInDate" placeholder="Select check-in date" />
              <label>Check out</label>
              <Datepicker v-model="checkOutDate" placeholder="Select check-out date" />
            </div>
          </div>
        </div>

        <!-- Guest filter -->
        <div class="filter-item guest-filter">
          <GuestFilter @updateGuestCount="updateGuestCount" />
        </div>
      </div>
    </div>

    <!-- Property listing -->
    <h1 class="property-title">Populära destinationer</h1>
    <div v-if="showLoading" class="loading-indicator">Laddar...</div>
    <div v-if="error">{{ error }}</div>
    <TransitionGroup name="property-list" tag="ul" class="property-list">
      <li v-for="property in filteredProperties" :key="property._id" class="property-item">
        <div class="property-image-container">
          <transition name="fade" mode="out-in">
            <img 
              :key="currentImageIndexes[property._id]"
              :src="getCurrentImage(property)"
              :alt="property.title"
              @error="handleImageError(property._id)"
              class="property-image"
            />
          </transition>

          <button 
            v-if="property.images && property.images.length > 1" 
            @click="prevImage(property._id)" 
            class="carousel-button prev"
          >
            &lt;
          </button>
          <button 
            v-if="property.images && property.images.length > 1" 
            @click="nextImage(property._id)" 
            class="carousel-button next"
          >
            &gt;
          </button>
          <div class="favorite-button-overlay">
            <FavoritesManager
              :propertyId="property._id"
              @favoriteToggled="(propertyId: string) => $emit('favoriteToggled', propertyId)"
            />
          </div>
        </div>
        <router-link :to="{
          name: 'PropertyDetail',
          params: { id: property._id },
          query: {
            checkIn: checkInDate,
            checkOut: checkOutDate
          }
        }">
          <div class="title-rating-container">
            <h3>{{ property.title }}</h3>
            <div class="rating">
              <i class="fas fa-star"></i>
              {{ property.rating }}
            </div>
          </div>
          <div class="property-details">
            <p>{{ property.rooms }} rum · {{ property.beds }} sängar</p>
          </div> 
          <span class="price">{{ property.pricePerNight }} kr</span> 
        </router-link>
      </li>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.date-toggle-button {
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  padding: 10px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
}

.date-toggle-button:hover {
  background-color: #e0e0e0;
}

.date-dropdown {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}



.property-title {
  text-align: center;
}

.property-list-page {
  max-width: 1200px;
  margin: 0 auto;
}

.filters-container {
  border-radius: 100px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 15px 20px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.filters-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 20px;
}

.filter-item {
  flex: 1;
}

.property-input{
  border: none;
  margin-left: 5px;
}

.property-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.property-item {
  position: relative;
  list-style-type: none;
  border-radius: 12px;
  padding: 10px;
  transition: transform 0.3s ease;
}

.property-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.1);
}

.property-image-container {
  position: relative;
  width: 100%;
  height: 250px;
  margin-bottom: 1rem;
  overflow: hidden;
  border-radius: 12px;
}

.property-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: transparent;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
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

.favorite-button-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.property-item a {
  text-decoration: none;
  color: inherit;
}

.title-rating-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.title-rating-container h3 {
  margin: 0;
}

.rating {
  display: flex;
  align-items: center;
}

.rating i {
  margin-right: 4px;
}

@media (max-width: 1024px) {
  .property-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .property-list {
    grid-template-columns: 1fr;
  }

  .filters-wrapper {
    flex-direction: column;
    gap: 10px;
  }
}
</style>