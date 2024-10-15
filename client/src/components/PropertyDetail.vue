<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useUser } from 'vue-clerk'
import BookProperty from './BookProperty.vue'
import FavoriteManager from '@/components/FavoriteManager.vue'

const route = useRoute()
const router = useRouter()
const { user, isLoaded } = useUser()

const property = ref<Property | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const checkInDate = ref<string | null>(route.query.checkIn as string || null)
const checkOutDate = ref<string | null>(route.query.checkOut as string || null)
const currentImageIndex = ref(0)


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
const propertyId = computed(() => route.params.id as string)

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

//updating dates when booked
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

//methods for image carousel
const nextImage = () => {
  if (property.value && property.value.images) {
    currentImageIndex.value = (currentImageIndex.value + 1) % property.value.images.length
  }
}

const prevImage = () => {
  if (property.value && property.value.images) {
    currentImageIndex.value = (currentImageIndex.value - 1 + property.value.images.length) % property.value.images.length
  }
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
})

</script>

<template>
  <div class="detail-container">
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="property">
      <h2>{{ property.title }}</h2>
      <div class="image-carousel" v-if="property.images && property.images.length > 0">
        <button class="carousel-arrow left" @click="prevImage">&lt;</button>
        <img :src="property.images[currentImageIndex]" :alt="`Property image ${currentImageIndex + 1}`" />
        <button class="carousel-arrow right" @click="nextImage">&gt;</button>
        <div class="carousel-indicator">
          {{ currentImageIndex + 1 }} / {{ property.images.length }}
        </div>
        
        <div class="favorite-manager-overlay">
          <FavoriteManager 
            :propertyId="property._id" 
            @favoriteToggled="fetchProperty"  
          />
        </div>

      </div>
      <div class="property-details">
        <p><strong>Din värd är:</strong> {{ property.username || 'Unknown user' }}</p>
        <p>{{ property.rooms }} rum · {{ property.beds }} sängar</p>
      </div>
      <p>{{ property.description }}</p>
      <p> {{ property.pricePerNight }} kr</p>
      <p><strong>Bekvämligheter:</strong> {{ property.amenities.join(' ') }}</p>
      
      <BookProperty 
        :propertyId="property._id" 
        :checkIn="checkInDate" 
        :checkOut="checkOutDate"
        @dateChange="updateDates"
      />
    </div>
  </div>
</template>


<style scoped>
.detail-container {
  margin: 100px;
}

.image-carousel {
  position: relative;
  width: 100%;
  max-width: 914px;
  margin: 0 auto 1rem;
  aspect-ratio: 914 / 334;
  overflow: hidden;
}

.image-carousel img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: transparent;
  border: none;
  font-size: 24px;
  padding: 10px;
  cursor: pointer;
}

.carousel-arrow:hover {
  cursor: pointer;
}

.carousel-arrow.left {
  left: 10px;
}

.carousel-arrow.right {
  right: 10px;
}

.carousel-indicator {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
}

.favorite-manager-overlay {
  position: absolute;
  top: 10px;
  right: 10px; 
  z-index: 10; 
}

@media (max-width: 914px) {
  .image-carousel {
    width: 100%;
    aspect-ratio: 914 / 334;
  }
}
</style>
