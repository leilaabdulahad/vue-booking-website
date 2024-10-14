<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useUser } from 'vue-clerk'
import BookProperty from './BookProperty.vue' 

const { user, isLoaded } = useUser()

const property = ref<Property | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const isFavorite = ref(false)
const favoriteLoading = ref(false)
const favoriteError = ref<string | null>(null)  


const route = useRoute()
const router = useRouter()

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
const propertyId = computed(() => route.params.id as string)
const checkInDate = ref<string | null>(route.query.checkIn as string || null)
const checkOutDate = ref<string | null>(route.query.checkOut as string || null)

const fetchProperty = async () => {
  try {
    const response = await axios.get<Property>(`${API_BASE_URL}/api/properties/${propertyId.value}`)
    property.value = response.data
  } catch (err) {
    console.error('Error fetching property:', err)
    if (axios.isAxiosError(err)) {
      error.value = `Error fetching property: ${err.message}. ${err.response?.data?.message || ''}`
    } else {
      error.value = 'An unexpected error occurred while fetching the property'
    }
  } finally {
    loading.value = false
  }
}

const fetchFavoriteStatus = async () => {
  if (!user.value) return
  favoriteLoading.value = true
  favoriteError.value = null
  try {
    const response = await axios.get(`${API_BASE_URL}/api/favorites/${user.value.id}`)
    isFavorite.value = response.data.some((fav: { propertyId: string }) => fav.propertyId === propertyId.value)
  } catch (err) {
    console.error('Error fetching favorite status:', err)
    if (axios.isAxiosError(err)) {
      favoriteError.value = `Failed to fetch favorite status: ${err.response?.data?.message || err.message}`
    } else {
      favoriteError.value = 'An unexpected error occurred'
    }
  } finally {
    favoriteLoading.value = false
  }
}

const toggleFavorite = async () => {
  if (!user.value) {
    alert('Please sign in to manage favorites.')
    return
  }
  favoriteLoading.value = true
  favoriteError.value = null
  try {
    if (isFavorite.value) {
      await axios.delete(`${API_BASE_URL}/api/favorites/${user.value.id}/${propertyId.value}`)
    } else {
      await axios.post(`${API_BASE_URL}/api/favorites`, {
        clerkUserId: user.value.id,
        propertyId: propertyId.value,
      })
    }
    isFavorite.value = !isFavorite.value
  } catch (err) {
    console.error('Error toggling favorite:', err)
    if (axios.isAxiosError(err)) {
      favoriteError.value = `Failed to update favorite: ${err.response?.data?.message || err.message}`
    } else {
      favoriteError.value = 'An unexpected error occurred while updating favorite'
    }
  } finally {
    favoriteLoading.value = false
  }
}
const updateDates = (newCheckIn: string, newCheckOut: string) => {
  checkInDate.value = newCheckIn
  checkOutDate.value = newCheckOut
  router.replace({
    query: {
      ...route.query,
      checkIn: newCheckIn,
      checkOut: newCheckOut
    }
  })
}

watch(
  () => route.query,
  (query) => {
    checkInDate.value = query.checkIn as string || null
    checkOutDate.value = query.checkOut as string || null
  }
)

onMounted(async () => {
  await fetchProperty()
  if (isLoaded.value && user.value) {
    await fetchFavoriteStatus()
  }
})
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else-if="property">
    <h2>{{ property.title }}</h2>
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

    <div v-if="isLoaded && user">
      <button @click="toggleFavorite" :disabled="favoriteLoading">
        {{ isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}
      </button>
      <p v-if="favoriteError" class="error">{{ favoriteError }}</p>
    </div>
    <p v-else>Sign in to manage favorites</p>

    <BookProperty 
      :propertyId="property._id" 
      :checkIn="checkInDate" 
      :checkOut="checkOutDate"
      @dateChange="updateDates"
    />
  </div>
</template>

<style scoped>
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
.error {
  color: red;
}
</style>
