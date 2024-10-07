<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import debounce from 'lodash/debounce'
import BookProperty from './BookProperty.vue'
import SearchFilter from './SearchFilter.vue'
import { useUser } from 'vue-clerk'

const properties = ref<Property[]>([])
const loading = ref(false)
const showLoading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const { user, isLoaded } = useUser()

//uses a reactive object instead of a Set
const favoriteProperties = ref<Record<string, boolean>>({})

const fetchFavorites = async () => {
  if (!user.value) return
  try {
    const response = await axios.get(`http://localhost:5000/api/favorites/${user.value.id}`)
    favoriteProperties.value = response.data.reduce((acc: Record<string, boolean>, fav: any) => {
      acc[fav.propertyId] = true
      return acc
    }, {})
  } catch (error) {
    console.error('Error fetching favorites:', error)
  }
}

const fetchProperties = async () => {
  try {
    loading.value = true
    const response = await axios.get<Property[]>('http://localhost:5000/api/properties')
    properties.value = response.data
    error.value = null
    //fetches favorites after properties are loaded
    await fetchFavorites() 
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
  }
}

const toggleFavorite = async (propertyId: string) => {
  if (!user.value) return alert('Please sign in to manage favorites.')
  try {
    if (favoriteProperties.value[propertyId]) {
      await removeFromFavorites(propertyId)
    } else {
      await addToFavorites(propertyId)
    }
    //updates the local state after successful API call
    favoriteProperties.value[propertyId] = !favoriteProperties.value[propertyId]
  } catch (error) {
    console.error('Error toggling favorite:', error)
    alert('Failed to update favorite.')
  }
}

const addToFavorites = async (propertyId: string) => {
  if (!user.value) {
    return alert('Please sign in to manage favorites.');
  }
  await axios.post('http://localhost:5000/api/favorites', {
    clerkUserId: user.value.id,
    propertyId,
  });
}

const removeFromFavorites = async (propertyId: string) => {
  if (!user.value) {
    return alert('Please sign in to manage favorites.');
  }
  await axios.delete(`http://localhost:5000/api/favorites/${user.value.id}/${propertyId}`);
}


const filteredProperties = computed(() => {
  if (!searchQuery.value) return properties.value
  const query = searchQuery.value.toLowerCase()
  return properties.value.filter(property =>
    property.location.country.toLowerCase().includes(query) ||
    property.location.city.toLowerCase().includes(query)
  )
})

const debouncedSearch = debounce((query: string) => {
  searchQuery.value = query
}, 300)

const applySearch = (query: string) => {
  debouncedSearch(query)
}

//watches for user authentication state
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
    <SearchFilter @search="applySearch" />
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
        <button @click="toggleFavorite(property._id)">
          {{ favoriteProperties[property._id] ? 'Remove from Favorites' : 'Add to Favorites' }}
        </button>
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