<script setup lang="ts">
import GuestFilter from '@/components/GuestFilter.vue'
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import debounce from 'lodash/debounce'
import FavoritesManager from './FavoriteManager.vue'
import { useUser } from 'vue-clerk'
import { useRoute, useRouter } from 'vue-router'

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


const fetchProperties = async () => {
  try {
    loading.value = true
    showLoading.value = true
    const response = await axios.get<Property[]>('http://localhost:5000/api/properties')
    properties.value = response.data
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

const applyGuestFilter = (event: Event) => {
  const target = event.target as HTMLInputElement
  guestCount.value = parseInt(target.value) || 1
}
watch([checkInDate, checkOutDate], ([newCheckIn, newCheckOut]) => {
  router.replace({
    query: {
      ...route.query,
      checkIn: newCheckIn,
      checkOut: newCheckOut
    }
  })
})

// Watches for user authentication state
watch([user, isLoaded], async ([newUser, loaded]) => {
  if (newUser && loaded) {
    await fetchProperties()
  }
})

onMounted(async () => {
  await fetchProperties()
  checkInDate.value = route.query.checkIn as string || null
  checkOutDate.value = route.query.checkOut as string || null
})
</script>

<template>
  <div class="property-list">
    <div class="filters">
      <div class="date-filters">
        <input
          type="date"
          v-model="checkInDate"
          placeholder="Check-in Date"
        />
        <input
          type="date"
          v-model="checkOutDate"
          placeholder="Check-out Date"
        />
      </div>
      <div class="search-filter">
        <input
          v-model="searchQuery"
          @input="applySearch"
          placeholder="Search for a country or city..."
          type="text"
        />
      </div>
      <GuestFilter @updateGuestCount="updateGuestCount" />
    </div>
    <div v-if="showLoading" class="loading-indicator">Loading...</div>
    <div v-if="error">{{ error }}</div>
    <TransitionGroup name="property-list" tag="ul">
      <li v-for="property in filteredProperties" :key="property._id" class="property-item">
        <div class="property-image-container">
          <img
            v-if="property.images && property.images.length > 0"
            :src="property.images[0]"
            :alt="property.title"
            class="property-image"
          />
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
          <div class="title-rating-price-container">
            <h3>{{ property.title }}</h3>
            <div class="rating-container">
              <span class="rating"><i class="fas fa-star"></i>{{ property.rating }}</span>
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
.property-list {
  max-width: 800px;
  margin: 0 auto;
}
.property-image-container {
  position: relative;
  width: 100%;
  height: 200px; 
  margin-bottom: 1rem;
  overflow: hidden;
}

.property-image{
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}
.favorite-button-overlay{
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}

.title-rating-price-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.title-rating-price-container h3 {
  margin: 0;
  font-size: 1.2rem;
  flex-grow: 1;
}
.rating-container {
  display: flex;
  align-items: center;
}
.rating {
  margin-right: 1rem;
  font-weight: bold;
}
.price {
  font-weight: bold;
  font-size: 1.1rem;
}
.property-details {
  font-size: 0.9rem;
  color: #666;
}
.filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.date-filters {
  display: flex;
  gap: 10px;
}
.date-filters input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.property-item {
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 1rem;
  list-style-type: none;
}
.loading-indicator {
  text-align: center;
  padding: 20px;
  font-style: italic;
  color: #666;
}
.property-item a{
  text-decoration: none;
  color: inherit;
}
</style>
