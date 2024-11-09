<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useUser } from 'vue-clerk'
import PropertyCard from '@/components/PropertyCard.vue'
import { fetchFavorites as getFavorites, fetchPropertyById } from '@/services/favoritesService'

const favorites = ref<Property[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const { user, isLoaded } = useUser()

const fetchFavorites = async () => {
  if (!user.value || !isLoaded.value) return

  try {
    loading.value = true
    const favoriteIds = await getFavorites(user.value.id)
    const propertyResponses = await Promise.all(
      favoriteIds.map((id: { propertyId: string }) => fetchPropertyById(id.propertyId))
    )

    favorites.value = propertyResponses
    error.value = null
  } catch (err) {
    console.error('Error fetching favorites:', err)
    if (axios.isAxiosError(err)) {
      error.value = `Error fetching favorites: ${err.message}. ${err.response?.data?.message || ''}`
    } else {
      error.value = 'An unexpected error occurred while fetching favorites'
    }
  } finally {
    loading.value = false;
  }
}

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
    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-if="!loading && favorites.length === 0" class="no-favorites">
      Inga favoriter
    </div>

    <TransitionGroup name="favorite-list" tag="div" class="favorite-grid">
      <PropertyCard 
        v-for="property in favorites" 
        :key="property._id" 
        :property="property"
        checkInDate="" 
        checkOutDate=""
        @favoriteToggled="handleFavoriteToggled" 
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.favorite-list-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.favorite-title {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin: 60px 0 40px;
  color: #333;
}

.loading-indicator, .error-message, .no-favorites {
  text-align: center;
  font-size: 1.2rem;
  color: #777;
  margin: 20px 0;
}

.favorite-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(280px, 1fr)); 
  gap: 30px;
  padding-bottom: 40px;
}

.favorite-card {
  width: 100%;
  background-color: #fff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.favorite-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
}

@media (max-width: 1024px) {
  .favorite-grid {
    grid-template-columns: repeat(2, minmax(200px, 1fr));
  }
}

@media (max-width: 600px) {
  .favorite-grid {
    grid-template-columns: 1fr;
  }

  .favorite-title {
    font-size: 2rem;
    margin-top: 40px;
  }
}

.favorite-list-enter-active, .favorite-list-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.favorite-list-enter, .favorite-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
