<script setup lang="ts">
import GuestFilter from '@/components/GuestFilter.vue'
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import debounce from 'lodash/debounce'
import BookProperty from './BookProperty.vue'
import FavoritesManager from './FavoriteManager.vue'
import { useUser } from 'vue-clerk'
import { update } from 'lodash'

const emit = defineEmits(['favoriteToggled']) 

const properties = ref<Property[]>([])
const loading = ref(false)
const showLoading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const guestCount = ref(1)
const { user, isLoaded } = useUser()

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

// Watches for user authentication state
watch([user, isLoaded], async ([newUser, loaded]) => {
  if (newUser && loaded) {
    await fetchProperties()
  }
})

onMounted(async () => {
  if (isLoaded.value && user.value) {
    await fetchProperties()
  }
})
</script>

<template>
  <div class="property-list">
    <div class="filters">
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
        <router-link :to="{ name: 'PropertyDetail', params: { id: property._id } }">
          <h3>{{ property.title }}</h3>
          <div class="image-gallery" v-if="property.images && property.images.length > 0">
            <img v-for="(image, index) in property.images" :key="index" :src="image" :alt="`Property image ${index + 1}`" />
          </div>
          <p>{{ property.description }}</p>
          <p><strong>City:</strong> {{ property.location.city }}</p>
          <p><strong>Country:</strong> {{ property.location.country }}</p>
          <p><strong>Max Guests:</strong> {{ property.maxGuests }}</p>
          <p><strong>Price Per Night:</strong> ${{ property.pricePerNight }}</p>
          <p><strong>Rooms:</strong> {{ property.rooms }}</p>
          <p><strong>Beds:</strong> {{ property.beds }}</p>
          <p><strong>Amenities:</strong> {{ property.amenities.join(', ') }}</p>
          <p><strong>Posted by:</strong> {{ property.username || 'Unknown user' }}</p>
          <p><small>Posted on: {{ new Date(property.createdAt).toLocaleString() }}</small></p>
        </router-link>
        <FavoritesManager 
          :propertyId="property._id" 
          @favoriteToggled="(propertyId: string) => $emit('favoriteToggled', propertyId)"
        />
        <BookProperty :propertyId="property._id" />
      </li>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.property-list {
  max-width: 800px;
  margin: 0 auto;
}
.filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.search-filter, .guest-filter {
  flex: 1;
  margin-right: 10px;
}
.search-filter input, .guest-filter input {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.guest-filter label {
  display: block;
  margin-bottom: 5px;
}
.property-item {
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 1rem;
  list-style-type: none;
}
h3 {
  margin-top: 0;
}
.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 1rem;
}
.image-gallery img {
  width: 150px;
  height: 150px;
  object-fit: cover;
}
.loading-indicator {
  text-align: center;
  padding: 20px;
  font-style: italic;
  color: #666;
}

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
</style>