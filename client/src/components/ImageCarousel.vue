<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  images: string[]
  variant?: 'card' | 'detail'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'card'
})

const currentImageIndex = ref(0)

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % props.images.length
}

const prevImage = () => {
  currentImageIndex.value = (currentImageIndex.value - 1 + props.images.length) % props.images.length
}
</script>

<template>
  <div
    v-if="images?.length"
    class="image-carousel"
    :class="variant"
  >
    <div class="carousel-wrapper">
      <div class="carousel-container">
        <img
          :src="images[currentImageIndex]"
          :alt="`Property image ${currentImageIndex + 1}`"
          class="carousel-image"
          loading="lazy"
        />
        <div class="carousel-controls">
          <button
            v-if="images.length > 1"
            class="carousel-button prev"
            @click.prevent="prevImage"
            aria-label="Previous image"
          >
            <span class="arrow-icon">‹</span>
          </button>
          <button
            v-if="images.length > 1"
            class="carousel-button next"
            @click.prevent="nextImage"
            aria-label="Next image"
          >
            <span class="arrow-icon">›</span>
          </button>
        </div>
        
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-carousel {
  width: 100%;
  position: relative;
}

.carousel-wrapper {
  position: relative;
  width: 100%;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f5f5f5;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

/* Card variant */
.card .carousel-wrapper {
  height: 200px;
}

.card .carousel-container {
  border-radius: 8px;
}

/* Detail variant */
.detail {
  max-width: 1120px;
  margin: 0 auto;
}

.detail .carousel-wrapper {
  position: relative;
  padding-top: 56.25%; 
}

.detail .carousel-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
}

.carousel-controls {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  pointer-events: auto;
  z-index: 2;
}

.carousel-button:hover {
  background-color: rgba(255, 255, 255, 0.95);
  transform: translateY(-50%) scale(1.05);
}

.carousel-button:active {
  transform: translateY(-50%) scale(0.95);
}

.card .carousel-button {
  width: 32px;
  height: 32px;
}

.detail .carousel-button {
  width: 40px;
  height: 40px;
}

.carousel-button.prev {
  left: 16px;
}

.carousel-button.next {
  right: 16px;
}

.arrow-icon {
  font-size: 24px;
  line-height: 1;
  color: #222222;
  user-select: none;
}

.detail .arrow-icon {
  font-size: 28px;
}

.image-counter {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  z-index: 2;
}

.detail .image-counter {
  padding: 6px 12px;
  font-size: 14px;
}

@media (max-width: 744px) {
  .carousel-button {
    width: 28px;
    height: 28px;
  }

  .carousel-button.prev {
    left: 8px;
  }

  .carousel-button.next {
    right: 8px;
  }

  .arrow-icon {
    font-size: 20px;
  }

  .image-counter {
    bottom: 8px;
    right: 8px;
  }
}
</style>