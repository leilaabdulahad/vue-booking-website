<script setup lang="ts">
defineProps<{
  title: string
  rating: number
}>()
</script>

<template>
  <div class="header-container">
    <h1 class="property-title">{{ title }}</h1>
    <p class="property-rating">{{ rating }}</p>
  </div>
</template>


<style scoped>

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.property-title {
  font-size: 26px;
  font-weight: 600;
  color: #222222;
  margin: 0; 
}

.property-rating {
  font-size: 18px;
  font-weight: 600;
  margin: 0; 
}

</style>