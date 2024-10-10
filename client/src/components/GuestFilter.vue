<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['updateGuestCount'])
const guestCount = ref(1)

const applyGuestFilter = (event: Event) => {
  const target = event.target as HTMLInputElement
  guestCount.value = parseInt(target.value) || 1
  emit('updateGuestCount', guestCount.value)
}
</script>

<template>
  <div class="guest-filter">
    <label for="guestCount">Number of Guests:</label>
    <input
      id="guestCount"
      v-model="guestCount"
      @input="applyGuestFilter"
      type="number"
      min="1"
    />
  </div>
</template>

<style scoped>
.guest-filter {
  margin-right: 10px;
}
</style>
