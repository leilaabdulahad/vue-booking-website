<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useUser } from 'vue-clerk'
import FavoriteManager from '@/components/FavoriteManager.vue'
import {favoritesService} from '../services/favoritesService'

const favorites = ref<Property[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const currentImageIndexes = ref<{ [key: string]: number }>({})
const imageLoadErrors = ref<{ [key: string]: boolean }>({})

const { user, isLoaded } = useUser()

const fetchFavorites = async () => {
  if (!user.value || !isLoaded.value) return

  try {
    loading.value = true;
    const favoriteIds = await favoritesService.fetchFavorites(user.value.id);
    const propertyResponses = await Promise.all(favoriteIds.map((id: { propertyId: string }) => favoritesService.fetchPropertyById(id.propertyId)));

    favorites.value = propertyResponses;

    favorites.value.forEach(property => {
      currentImageIndexes.value[property._id] = 0;
      imageLoadErrors.value[property._id] = false;
    });

    error.value = null;
  } catch (err) {
    console.error('Error fetching favorites:', err);
    if (axios.isAxiosError(err)) {
      error.value = `Error fetching favorites: ${err.message}. ${err.response?.data?.message || ''}`;
    } else {
      error.value = 'An unexpected error occurred while fetching favorites';
    }
  } finally {
    loading.value = false;
  }
}

const handleFavoriteToggled = (propertyId: string) => {
  favorites.value = favorites.value.filter(property => property._id !== propertyId)
}

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
  const property = favorites.value.find(p => p._id === propertyId)
  if (property) {
    const totalImages = property.images.length
    currentImageIndexes.value[propertyId] = (currentImageIndexes.value[propertyId] + 1) % totalImages
  }
}

const prevImage = (propertyId: string) => {
  const property = favorites.value.find(p => p._id === propertyId)
  if (property) {
    const totalImages = property.images.length
    currentImageIndexes.value[propertyId] = (currentImageIndexes.value[propertyId] - 1 + totalImages) % totalImages
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

    <div v-if="loading" class="loading-indicator">Laddar...</div>
    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-if="!loading && favorites.length === 0" class="no-favorites">
      Inga favoriter
    </div>

    <TransitionGroup name="favorite-list" tag="div" class="favorite-grid">
      <div 
        v-for="(property, index) in favorites" 
        :key="property._id" 
        class="favorite-card"
      >
        <div class="favorite-image-container">
          <img 
            :src="getCurrentImage(property)" 
            @error="handleImageError(property._id)"
            alt="Favorite Property Image"
            class="favorite-image"
          />
          <div class="favorite-button-overlay">
            <FavoriteManager 
              :propertyId="property._id"
              @favoriteToggled="handleFavoriteToggled"
            />
          </div>
          <button class="carousel-button prev" @click.prevent="prevImage(property._id)">‹</button>
          <button class="carousel-button next" @click.prevent="nextImage(property._id)">›</button>
        </div>
        <router-link 
          :to="{
            name: 'PropertyDetail',
            params: { id: property._id },
            query: { checkIn: '', checkOut: '' }
          }"
          class="favorite-link"
        >
          <div class="favorite-info">
            <div class="title-rating-container">
              <h3 class="favorite-title">{{ property.title }}</h3>
              <div class="rating">
                <i class="fas fa-star"></i>
                {{ property.rating.toFixed(1) }}
              </div>
            </div>
            <p class="favorite-details">{{ property.rooms }} rum · {{ property.beds }} sängar</p>
            <span class="price">{{ property.pricePerNight }} kr per natt</span>
          </div>
        </router-link>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.favorite-list-page {
  max-width: 1200px;
  padding: 20px;
  margin: 100px;
}

.favorite-title {
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

.favorite-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.favorite-card {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.favorite-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.favorite-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.favorite-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.favorite-card:hover {
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

.favorite-link {
  text-decoration: none;
  color: inherit;
}

.favorite-info {
  padding: 15px;
}

.title-rating-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.favorite-title {
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

.favorite-details {
  margin: 0 0 10px;
  font-size: 14px;
  color: #666;
}

.price {
  display: block;
  font-weight: bold;
  font-size: 16px;
}


@media (max-width: 768px) {
  .favorite-grid {
    grid-template-columns: 1fr;
  }
}
</style>
