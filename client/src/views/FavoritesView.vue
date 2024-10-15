<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useUser } from 'vue-clerk'

const favorites = ref<Property[]>([])
const loading = ref(false)
const showLoading = ref(false)
const error = ref<string | null>(null)

const { user, isLoaded } = useUser()

//fetches favorites after the user is loaded
const fetchFavorites = async () => {
  if (!user.value || !isLoaded.value) return

  try {
    loading.value = true
    const response = await axios.get(`http://localhost:5000/api/favorites/${user.value.id}`)
    const favoriteIds = response.data.map((favorite: { propertyId: string }) => favorite.propertyId)
    const propertyResponses = await Promise.all(favoriteIds.map((id: string) => axios.get(`http://localhost:5000/api/properties/${id}`)))
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

    <div v-if="showLoading" class="loading-indicator">Laddar...</div>
    <div v-if="error">{{ error }}</div>
    <div v-if="!loading && favorites.length === 0">Inga favoritbostäder hittades</div>

    <TransitionGroup name="favorite-list" tag="ul" class="favorite-list">
      <li v-for="(property, index) in favorites" :key="index" class="favorite-item">
        <router-link :to="{ name: 'PropertyDetail', params: { id: property._id } }">
          <div class="favorite-image-container" v-if="property.images && property.images.length > 0">
            <img 
              v-for="(image, index) in property.images" 
              :key="index" 
              :src="image" 
              :alt="`Property image ${index + 1}`"
              class="favorite-image"
            />
          </div>

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
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  list-style-type: none;
  padding: 0;
}

.favorite-item {
  position: relative;
  padding: 15px;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: #fff;
}

.favorite-item a {
  text-decoration: none;
  color: inherit;
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

.favorite-description {
  color: #555;
  margin: 10px 0;
}

.loading-indicator {
  text-align: center;
  margin: 20px 0;
  font-size: 1.2rem;
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

