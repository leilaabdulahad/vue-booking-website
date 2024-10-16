<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useUser } from 'vue-clerk'
import FavoriteManager from '@/components/FavoriteManager.vue'

const favorites = ref<Property[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const { user, isLoaded } = useUser()

//fetches favorites after the user is loaded
const fetchFavorites = async () => {
  if (!user.value || !isLoaded.value) return

  try {
    loading.value = true
    const response = await axios.get(`${API_BASE_URL}/api/favorites/${user.value.id}`)
    const favoriteIds = response.data.map((favorite: { propertyId: string }) => favorite.propertyId)
    const propertyResponses = await Promise.all(favoriteIds.map((id: string) => axios.get(`${API_BASE_URL}/api/properties/${id}`)))
    favorites.value = propertyResponses.map(response => response.data)
    error.value = null
  } catch (err) {
    console.error('Error fetching favorites:', err)
    if (axios.isAxiosError(err)) {
      error.value = `Error fetching favorites: ${err.message}. ${err.response?.data?.message || ''}`
    } else {
      error.value = 'An unexpected error occurred while fetching favorites'
    }
  } finally {
    loading.value = false
  }
}

//handles favorite toggled event
const handleFavoriteToggled = (propertyId: string) => {
  favorites.value = favorites.value.filter(property => property._id !== propertyId)
}

watch([user, isLoaded], ([newUser, loaded]) => {
  if (newUser && loaded) {
    fetchFavorites()
  }
})

onMounted(() => {
  if (isLoaded.value && user.value) {
    fetchFavorites()
  }
})
</script>

<template>
  <div class="favorite-list-page">
    <h1 class="favorite-title">Favoriter</h1>

    <div v-if="loading" class="loading-indicator">Laddar...</div>
    <div v-if="error">{{ error }}</div>
    <div v-if="!loading && favorites.length === 0" class="no-favorites">
      Inga favoriter
    </div>

    <TransitionGroup name="favorite-list" tag="ul" class="favorite-list">
      <li v-for="(property, index) in favorites" :key="index" class="favorite-item">
        <div class="favorite-image-container">
            <img 
              v-if="property.images && property.images.length > 0"
              :src="property.images[0]"
              :alt="`Property image for ${property.title}`"
              class="favorite-image"
            />
          <div class="favorite-manager-wrapper">
            <FavoriteManager 
              :propertyId="property._id"
              @favoriteToggled="handleFavoriteToggled"
            />
          </div>
        </div>

          <router-link :to="{ name: 'PropertyDetail', params: { id: property._id } }">
        <div class="title-rating-price-container">
          <div class="title-rating-row">
            <h3>{{ property.title }}</h3>
            <p class="property-rating">{{ property.rating }}★</p>
          </div>
          <div class="favorite-details">
            <p>{{ property.rooms }} rum · {{ property.beds }} sängar</p>
          </div>
          <p>{{ property.pricePerNight }} kr</p>
        </div>
          </router-link>
      </li>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.favorite-list-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.favorite-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1.5rem;
}
.favorite-list {
  display: grid;
  list-style-type: none;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  padding: 0;
}

.favorite-item {
  position: relative;
  padding: 15px;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: #fff;
}

.favorite-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15), 0 12px 24px rgba(0, 0, 0, 0.1);
}

.favorite-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  margin-bottom: 1rem;
  overflow: hidden;
  border-radius: 12px;
}

.favorite-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.favorite-manager-wrapper {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}

.title-rating-price-container {
  padding: 10px 0;
}

.title-rating-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.property-rating {
  font-size: 1.2rem;
}

.loading-indicator {
  text-align: center;
  margin: 20px 0;
  font-size: 1.2rem;
}

.no-favorites {
  display: flex;
  justify-content: center;
}
a{
  text-decoration: none;
  color: black;
}

@media (max-width: 1024px) {
  .favorite-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .favorite-list {
    grid-template-columns: 1fr;
  }
}
</style>