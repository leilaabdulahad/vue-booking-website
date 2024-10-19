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
        <div class="date-button-container">
          <button @click="toggleDateDropdown" class="date-toggle-button">
            Date
          </button>
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
        <GuestFilter @updateGuestCount="updateGuestCount" />
      </div>
    </div>
  </template>
  
  <style scoped>
  .filters-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }
  
  .filter-item {
    flex: 1;
    margin: 0 10px;
  }
  
  .date-filters {
    display: flex;
    flex-direction: column; 
    align-items: center; 
  }
  
  .date-button-container {
    width: 100%; 
    display: flex;
    justify-content: center; 
  }
  
  .filter-label {
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 8px;
    color: #333;
  }
  
  .date-toggle-button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
 
  
  .date-dropdown {
    position: absolute;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 15px;
    margin-top: 5px;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .date-dropdown label {
    display: block;
    margin-bottom: 5px;
    color: #555;
  }
  
  @media (max-width: 768px) {
    .filters-wrapper {
      flex-direction: column;
    }
  
    .filter-item {
      margin: 10px 0;
    }
  }
  </style>
  
  