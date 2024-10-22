<script setup lang="ts">
import { ref, watch } from 'vue'
import GuestFilter from '@/components/GuestFilter.vue'
import Datepicker from '@vuepic/vue-datepicker'
import SearchFilter from '@/components/SearchFilter.vue'
import '@vuepic/vue-datepicker/dist/main.css'
import { useFilter } from '../composables/useFilter'
import type { FilterState } from '@/types/filter'

//emits event to parent when filters are updated
const emit = defineEmits<{
  (e: 'filterUpdated', state: FilterState): void
}>()

const {
  searchQuery,
  checkInDate,
  checkOutDate,
  guestCount,
  showDateDropdown,
  toggleDateDropdown,
  handleSearch,
  updateGuestCount
} = useFilter(emit)


</script>

<template>
  <div class="filters-wrapper">
    <!-- Search filter -->
    <div class="filter-item search-filter">
      <p class="filter-label">Vart</p>
      <SearchFilter @search="handleSearch" />
    </div>
    
    <!-- Date filter with toggle -->
    <div class="filter-item date-filters">
      <p class="filter-label">När</p>
      <div class="date-input-container">
        <input 
          type="text" 
          readonly
          @click="toggleDateDropdown"
          :value="checkInDate ? checkInDate : ''" 
          placeholder="Lägg till datum"
          class="date-input"
        />
      </div>
      <div v-if="showDateDropdown" class="date-dropdown">
        <label>Check in</label>
        <Datepicker v-model="checkInDate" placeholder="Select check-in date" />
        <label>Check out</label>
        <Datepicker v-model="checkOutDate" placeholder="Select check-out date" />
      </div>
    </div>
    
    <!-- Guest filter -->
    <div class="filter-item guest-filter">
      <p class="filter-label">Antal</p>
      <GuestFilter @updateGuestCount="updateGuestCount" />
    </div>
  </div>
</template>

<style scoped>
.filters-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: #ffffff;
  border-radius: 40px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  max-width: 850px;
  gap: 16px;
}

.filter-item {
  flex: 1;
  position: relative;
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.filter-label {
  font-size: 12px;
  font-weight: 600;
  color: #222222;
  margin-bottom: 4px;
}

.date-input-container {
  width: 100%;
}

.date-input {
  width: 100%;
  padding: 8px 0;
  font-size: 14px;
  border: none;
  outline: none;
  background: transparent;
  color: #222;
  cursor: pointer;
}

.date-input::placeholder {
  color: #717171;
}

.filter-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 20%;
  height: 60%;
  width: 1px;
  background-color: #e0e0e0;
}

.date-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px;
  margin-top: 12px;
  z-index: 1000;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  min-width: 300px;
}

@media (max-width: 768px) {
  .filters-wrapper {
    flex-direction: column;
    border-radius: 16px;
    padding: 16px;
  }

  .filter-item {
    width: 100%;
    padding: 8px 0;
  }

  .filter-item::after {
    display: none;
  }
}
</style>