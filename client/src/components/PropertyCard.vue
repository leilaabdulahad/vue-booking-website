<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import FavoritesManager from './FavoriteManager.vue'
import ImageCarousel from './ImageCarousel.vue'

interface Props {
  property: Property
  checkInDate: string | null
  checkOutDate: string | null
}

const props = defineProps<Props>()
const router = useRouter()
</script>

<template>
  <div class="property-card">
    <div class="carousel-wrapper">
      <ImageCarousel 
        :images="property.images" 
        variant="card"
        />
      <div class="favorite-button-overlay">
        <FavoritesManager :propertyId="property._id" />
      </div>
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

.carousel-wrapper {
  position: relative;
  width: 100%;
}

.favorite-button-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
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