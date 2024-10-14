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
const showGuestDropdown = ref(false)

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

const toggleGuestDropdown = () => {
  showGuestDropdown.value = !showGuestDropdown.value
}

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
  <div class="property-list">
    <div class="filters-container">
      <div class="filters-wrapper">
        <div class="filter-item search-filter">
          <i class="fas fa-search"></i>
          <input
            v-model="searchQuery"
            @input="applySearch"
            placeholder="Search destinations"
            type="text"
          />
        </div>
        <div class="filter-item date-filters">
          <div class="date-input">
            <label>Check in</label>
            <input
              type="date"
              v-model="checkInDate"
              placeholder="Add dates"
            />
          </div>
          <div class="date-input">
            <label>Check out</label>
            <input
              type="date"
              v-model="checkOutDate"
              placeholder="Add dates"
            />
          </div>
        </div>
        <div class="filter-item guest-filter">
          <GuestFilter @updateGuestCount="updateGuestCount" />
        </div>
      </div>
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
.property-item a{
  text-decoration: none;
  color: inherit;
}
.filters-container {
  background-color: #ffffff;
  border-radius: 40px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 20px 30px;
  margin-bottom: 30px;
}

.filters-wrapper {
  display: flex;
  align-items: center;
  gap: 20px;
}

.filter-item {
  padding: 10px 15px;
  border-right: 1px solid #dddddd;
  cursor: pointer;
}

.filter-item:last-child {
  border-right: none;
}

.search-filter {
  flex-grow: 1;
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid #ddd;
}

.search-filter i {
  margin-right: 10px;
  color: #717171;
}

.search-filter input {
  border: none;
  outline: none;
  font-size: 14px;
  width: 100%;
  padding: 8px;
}

.date-filters {
  display: flex;
  gap: 20px;
}

.date-input input {
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  padding: 8px;
}


.loading-indicator {
  text-align: center;
  padding: 20px;
  font-style: italic;
  color: #666;
  font-size: 18px;
}

.property-list {
  max-width: 800px;
  margin: 0 auto;
}

.property-item {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 1rem;
  list-style-type: none;
}

.property-image-container {
  position: relative;
  width: 100%;
  height: 200px; 
  margin-bottom: 1rem;
  overflow: hidden;
  border-radius: 10px;
}

.property-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favorite-button-overlay {
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

.property-details {
  font-size: 0.9rem;
  color: #666;
}

.price {
  font-weight: bold;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .filters-wrapper {
    flex-direction: column;
    gap: 15px;
  }

  .search-filter {
    width: 100%;
  }

  .guest-filter {
    width: 100%;
  }

  .property-list {
    max-width: 100%;
  }
}
</style>

