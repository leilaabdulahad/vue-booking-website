<script setup lang="ts">
defineProps<{
  amenities: string[]
}>()
</script>

<template>
  <div class="amenities-section">
    <h2>Boendet erbjuder</h2>
    <div class="amenities-grid">
      <div v-for="amenity in amenities" 
           :key="amenity" 
           class="amenity-item">
        <!-- <span class="amenity-icon">✓</span> -->
        {{ amenity }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.amenities-section {
  padding: 32px 0;
}

.amenities-section h2 {
  margin-bottom: 24px;
  font-size: 22px;
  font-weight: 600;
  color: #222222;
}

.amenities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.amenity-item {
  display: flex;
  gap: 12px;
  align-items: center;
  color: #222222;
}
</style>