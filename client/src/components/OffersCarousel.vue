<script setup lang="ts">
import { ref, computed } from 'vue'
import PropertyCard from './PropertyCard.vue'
import { onMounted, onUnmounted } from 'vue';

interface Props {
  properties: Property[]
  currentImageIndexes: { [key: string]: number }
  imageLoadErrors: { [key: string]: boolean }
  checkInDate: string | null
  checkOutDate: string | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'imageError', propertyId: string): void
  (e: 'prevImage', propertyId: string): void
  (e: 'nextImage', propertyId: string): void
}>()

const currentSlide = ref(0)

const offerProperties = computed(() => {
  return props.properties.filter(property => property.isOffer)
})

const itemsPerSlide = computed(() => {
  return window.innerWidth < 768 ? 1 : 
         window.innerWidth < 1024 ? 2 : 3
})

const visibleOffers = computed(() => {
  const start = currentSlide.value * itemsPerSlide.value
  return offerProperties.value.slice(start, start + itemsPerSlide.value)
})

const totalSlides = computed(() => {
  return Math.ceil(offerProperties.value.length / itemsPerSlide.value)
})

const slideTransform = computed(() => {
  return `translateX(-${currentSlide.value * 100}%)`
})

const nextSlide = () => {
  if (currentSlide.value < totalSlides.value - 1) {
    currentSlide.value++
  } else {
    currentSlide.value = 0
  }
}

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
  } else {
    currentSlide.value = totalSlides.value - 1
  }
}

let autoplayInterval: number | null = null

const startAutoplay = () => {
  autoplayInterval = window.setInterval(() => {
    nextSlide()
  }, 5000)
}

const stopAutoplay = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
    autoplayInterval = null
  }
}

onMounted(() => {
  startAutoplay()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  stopAutoplay()
  window.removeEventListener('resize', handleResize)
})

const handleResize = () => {
  const maxSlide = totalSlides.value - 1
  if (currentSlide.value > maxSlide) {
    currentSlide.value = maxSlide
  }
}
</script>

<template>
  <section v-if="offerProperties.length > 0" class="offers-section">
    <h2 class="offers-title">Erbjudande</h2>
    
    <div 
      class="offers-carousel"
      @mouseenter="stopAutoplay"
      @mouseleave="startAutoplay"
    >
      <button 
        class="carousel-nav prev"
        @click="prevSlide"
        :disabled="currentSlide === 0"
      >
        ‹
      </button>

      <div class="carousel-container">
        <div 
          class="carousel-track"
          :style="{ transform: slideTransform }"
        >
          <div 
            v-for="property in offerProperties"
            :key="property._id"
            class="carousel-slide"
          >
            <PropertyCard
              :property="property"
              :currentImageIndex="currentImageIndexes[property._id]"
              :hasImageLoadError="imageLoadErrors[property._id]"
              :checkInDate="checkInDate"
              :checkOutDate="checkOutDate"
              @imageError="emit('imageError', $event)"
              @prevImage="emit('prevImage', $event)"
              @nextImage="emit('nextImage', $event)"
            />
          </div>
        </div>
      </div>

      <button 
        class="carousel-nav next"
        @click="nextSlide"
        :disabled="currentSlide === totalSlides - 1"
      >
        ›
      </button>

      <div class="carousel-indicators">
        <button
          v-for="index in totalSlides"
          :key="index"
          class="indicator"
          :class="{ active: currentSlide === index - 1 }"
          @click="currentSlide = index - 1"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.offers-section {
  margin: 40px 0;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 12px;
}

.offers-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 1.8rem;
  color: #333;
}

.offers-carousel {
  position: relative;
  padding: 0 40px;
}

/* adjust the - */
.carousel-container {
  overflow: hidden;
  margin: 0 -10px;  
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
  width: 100%;
}

.carousel-slide {
  flex: 0 0 calc(100% / v-bind(itemsPerSlide));
  padding: 0 10px;
  box-sizing: border-box;
}

.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 24px;
  color: #333;
  z-index: 10;
  transition: all 0.3s ease;
}

.carousel-nav:hover:not(:disabled) {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.carousel-nav:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.carousel-nav.prev {
  left: 0;
}

.carousel-nav.next {
  right: 0;
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ddd;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
}

.indicator.active {
  background-color: #333;
  transform: scale(1.2);
}

@media (max-width: 1024px) {
  .carousel-slide {
    flex: 0 0 50%;
  }
}

@media (max-width: 768px) {
  .carousel-slide {
    flex: 0 0 100%;
  }
  
  .offers-carousel {
    padding: 0 20px;
  }
}
</style>