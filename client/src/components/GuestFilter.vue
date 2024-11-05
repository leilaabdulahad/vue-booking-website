<script setup lang="ts">
import { useGuestCount } from '@/composables/useGuestCount'

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
      <span class="guest-label">Lägg till gäster</span>
    </div>

    <div v-if="isDropdownOpen" class="guest-dropdown">
      <div class="guest-control">
        <button 
          @click.stop="handleDecrement" 
          class="guest-button"
          :disabled="guestCount <= 1"
          aria-label="Minska antal gäster"
        >
          -
        </button>
        <span class="guest-count">{{ guestCount }}</span>
        <button 
          @click.stop="handleIncrement" 
          class="guest-button"
          aria-label="Öka antal gäster"
        >
          +
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.guest-filter {
  position: relative;
  display: inline-flex;
  align-items: center;
  background-color: #fff;
  border-radius: 100px;
  padding: 12px 20px;
  cursor: pointer;
  user-select: none;
  min-width: 100px;
  transition: all 0.2s ease;
}

/* change marginleft, do not use - */
.guest-display {
  display: flex;
  align-items: center;
  width: 100%;
  margin-left: -20px;
}

.guest-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.guest-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.guest-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px;
}

.guest-button {
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #333;
}

.guest-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f5f5f5;
}

.guest-count {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  min-width: 40px;
  text-align: center;
}
</style>