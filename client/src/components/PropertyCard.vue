<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import FavoritesManager from './FavoriteManager.vue'

interface Props {
  property: Property
  currentImageIndex: number
  hasImageLoadError: boolean
  checkInDate: string | null
  checkOutDate: string | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'imageError', propertyId: string): void
  (e: 'prevImage', propertyId: string): void
  (e: 'nextImage', propertyId: string): void
}>()

const router = useRouter()

const currentImage = computed((): string => {
  if (!props.property.images || 
      props.property.images.length === 0 || 
      props.hasImageLoadError) {
    return '/path/to/placeholder-image.jpg'
  }
  return props.property.images[props.currentImageIndex]
})
</script>

<template>
  <div class="property-card">
    <div class="property-image-container">
      <img 
        :src="currentImage" 
        @error="emit('imageError', property._id)"
        alt="Property Image"
        class="property-image"
      />
      <div class="favorite-button-overlay">
        <FavoritesManager :propertyId="property._id" />
      </div>
      <button 
        class="carousel-button prev" 
        @click.prevent="emit('prevImage', property._id)"
      >‹</button>
      <button 
        class="carousel-button next" 
        @click.prevent="emit('nextImage', property._id)"
      >›</button>
    </div>
    <router-link 
      :to="{
        name: 'PropertyDetail',
        params: { id: property._id },
        query: { checkIn: checkInDate, checkOut: checkOutDate }
      }"
      class="property-link"
    >
      <div class="property-info">
        <div class="title-rating-container">
          <h3 class="property-title">{{ property.title }}</h3>
          <div class="rating">
            <i class="fas fa-star"></i>
            {{ property.rating.toFixed(1) }}
          </div>
        </div>
        <p class="property-details">{{ property.rooms }} rum · {{ property.beds }} sängar</p>
        <span class="price">{{ property.pricePerNight }} kr per natt</span>
      </div>
    </router-link>
  </div>
</template>

<style scoped>
.property-card {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.property-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.property-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.property-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
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

.property-link {
  text-decoration: none;
  color: inherit;
}

.property-info {
  padding: 15px;
}

.title-rating-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.property-title {
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

.property-details {
  margin: 0 0 10px;
  font-size: 14px;
  color: #666;
}

.price {
  display: block;
  font-weight: bold;
  font-size: 16px;
}
</style>