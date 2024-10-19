<script setup lang="ts">
import { useGuestCount } from '@/composables/useGuestCount';
import { ref } from 'vue'

const emit = defineEmits(['updateGuestCount'])

const {
  guestCount,
  isDropdownOpen,
  incrementGuests,
  decrementGuests,
  toggleDropdown,
  closeDropdown
} = useGuestCount()

const handleIncrement = () => {
  const newCount = incrementGuests()
  emit('updateGuestCount', newCount)
}

const handleDecrement = () => {
  const newCount = decrementGuests()
  emit('updateGuestCount', newCount)
}

if (typeof window !== 'undefined') {
  window.addEventListener('click', closeDropdown)
}
</script>

<template>
  <div class="guest-filter" @click="toggleDropdown">
    <div class="guest-display">
      <span>Gäster: {{ guestCount }}</span>
      <i class="fas fa-chevron-down" :class="{ 'rotate': isDropdownOpen }"></i>
    </div>
    <div v-if="isDropdownOpen" class="guest-dropdown">
      <div class="guest-control">
        <button @click.stop="handleDecrement" class="guest-button" :disabled="guestCount <= 1">-</button>
        <span class="guest-count">{{ guestCount }}</span>
        <button @click.stop="handleIncrement" class="guest-button">+</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.guest-filter {
  position: relative;
  display: inline-block;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 24px;
  padding: 8px 16px;
  cursor: pointer;
  user-select: none;
}

.guest-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 120px;
}

.guest-display span {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.guest-display i {
  margin-left: 8px;
  transition: transform 0.3s ease;
}

.guest-display i.rotate {
  transform: rotate(180deg);
}

.guest-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.guest-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.guest-button {
  background-color: #f0f0f0;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.guest-button:hover {
  background-color: #e0e0e0;
}

.guest-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.guest-count {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 16px;
}
</style>