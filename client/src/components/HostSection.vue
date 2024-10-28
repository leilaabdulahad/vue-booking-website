<script setup lang="ts">
defineProps<{
  username: string
  rooms: number
  beds: number
}>()
</script>

<template>
  <div class="host-section">
    <div class="host-header">
      <h2>Din värd: {{ username || 'Unknown user' }}</h2>
      <p>{{ rooms }} rum · {{ beds }} sängar</p>
    </div>
  </div>
</template>

<style scoped>

.host-header h2 {
  font-size: 16px;
  font-weight: 600;
  color: #222222;
}

.property-highlights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.highlight-item {
  display: flex;
  align-items: center;
}

</style>