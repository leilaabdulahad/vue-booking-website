<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  images: string[]
}>()

const currentImageIndex = ref(0)

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % props.images.length
}

const prevImage = () => {
  currentImageIndex.value = (currentImageIndex.value - 1 + props.images.length) % props.images.length
}
</script>

<template>
  <div v-if="images?.length" class="image-carousel">
    <div class="carousel-container">
      <img 
        :src="images[currentImageIndex]" 
        :alt="`Property image ${currentImageIndex + 1}`"
        class="carousel-image" 
      />
      <button 
        class="carousel-arrow left" 
        @click="prevImage"
        v-if="images.length > 1"
      >
        <span class="arrow-icon">‹</span>
      </button>
      <button 
        class="carousel-arrow right" 
        @click="nextImage"
        v-if="images.length > 1"
      >
        <span class="arrow-icon">›</span>
      </button>
      <div class="carousel-indicator">
        {{ currentImageIndex + 1 }} / {{ images.length }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-carousel {
  margin-bottom: 48px;
}

.carousel-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 12px;
  overflow: hidden;
}


.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.18);
  transition: opacity 0.2s ease;
  z-index: 2;
}

.carousel-arrow:hover {
  opacity: 0.9;
}

.carousel-arrow.left {
  left: 24px;
}

.carousel-arrow.right {
  right: 24px;
}

.arrow-icon {
  font-size: 24px;
  line-height: 1;
  color: #222222;
}

.carousel-indicator {
  position: absolute;
  bottom: 24px;
  right: 24px;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
}

@media (max-width: 744px) {
  .carousel-arrow {
    width: 28px;
    height: 28px;
  }

  .carousel-arrow.left {
    left: 16px;
  }

  .carousel-arrow.right {
    right: 16px;
  }
}
</style>