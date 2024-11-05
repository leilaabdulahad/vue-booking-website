<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { SignedIn, SignedOut, UserButton, SignInButton } from 'vue-clerk'
import FilterControls from './FiltersControl.vue'
import type { FilterState } from '@/types/filter'
import { onMounted, onUnmounted } from 'vue'
const route = useRoute()
const isMenuActive = ref(false)
const isFiltersVisible = ref(false)

//computes whether we're on the home page
const isHomePage = computed(() => route.path === '/')

const toggleMenu = () => {
  isMenuActive.value = !isMenuActive.value
}

const toggleFilters = (event: Event) => {
  event.stopPropagation()
  isFiltersVisible.value = !isFiltersVisible.value
}

// closing filters when clicking outside
const closeFilters = (event: Event) => {
  if (isFiltersVisible.value) {
    isFiltersVisible.value = false
  }
}

// listens to outside clicks
onMounted(() => {
  document.addEventListener('click', closeFilters)
})

onUnmounted(() => {
  document.removeEventListener('click', closeFilters)
})

const emit = defineEmits<{
  (e: 'filterUpdated', state: FilterState): void
}>()

const props = defineProps<{
  initialSearchQuery?: string | null
  initialCheckInDate?: string | null
  initialCheckOutDate?: string | null
  initialGuestCount?: number
}>()

const handleFilterUpdate = (filterState: FilterState) => {
  emit('filterUpdated', filterState)
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="navbar-brand">
        EurBnB
      </router-link>

      <!-- Show filters inline on desktop -->
      <div v-if="isHomePage" class="navbar-filters-desktop">
        <FilterControls
          :initialSearchQuery="initialSearchQuery"
          :initialCheckInDate="initialCheckInDate"
          :initialCheckOutDate="initialCheckOutDate"
          :initialGuestCount="initialGuestCount"
          @filterUpdated="handleFilterUpdate"
        />
      </div>
      
      <div class="navbar-buttons">
        <!-- Mobile filter toggle -->
        <div v-if="isHomePage" class="filter-container" @click.stop>
          <button
            class="filter-toggle"
            @click="toggleFilters"
            :class="{ 'is-active': isFiltersVisible }"
            aria-label="toggle filters"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
              <line x1="1" y1="14" x2="7" y2="14" />
              <line x1="9" y1="8" x2="15" y2="8" />
              <line x1="17" y1="16" x2="23" y2="16" />
            </svg>
          </button>

          <!-- Mobile filter dropdown -->
          <div v-show="isFiltersVisible" class="filter-dropdown" @click.stop>
            <FilterControls
              :initialSearchQuery="initialSearchQuery"
              :initialCheckInDate="initialCheckInDate"
              :initialCheckOutDate="initialCheckOutDate"
              :initialGuestCount="initialGuestCount"
              @filterUpdated="handleFilterUpdate"
            />
          </div>
        </div>

        <button
          class="navbar-burger"
          @click="toggleMenu"
          :class="{ 'is-active': isMenuActive }"
          aria-label="menu"
          :aria-expanded="isMenuActive"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div class="navbar-menu" :class="{ 'is-active': isMenuActive }">
        <router-link to="/" class="navbar-item">Hem</router-link>
        <router-link to="/favorites" class="navbar-item">Favoriter</router-link>
        <router-link to="/my-bookings" class="navbar-item">Mina Bokningar</router-link>
        <router-link to="/properties" class="navbar-item">Alla boende</router-link>
        <router-link to="/create-property" class="navbar-item">Publicera boende</router-link>
        <div class="navbar-item auth-buttons">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <router-link to="/sign-in" class="navbar-item">
              Logga in
            </router-link>
          </SignedOut>
        </div>
      </div>
    </div>
  </nav>
</template>
  
<style scoped>
.navbar {
  background-color: #ffffff;
  padding: 1rem 2rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: 700;
  color: #FC4646;
  text-decoration: none;
  transition: color 0.3s ease;
}

.navbar-brand:hover {
  color: #9f9f9f;
}

.navbar-buttons {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-container {
  position: relative;
}

.filter-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #333;
  transition: color 0.3s ease;
  display: none; 
}

.filter-toggle:hover {
  color: #FC4646;
}

.filter-toggle.is-active {
  color: #FC4646;
}

.filter-dropdown {
  position: fixed;
  top: 4rem;
  left: 0;
  right: 0;
  background-color: #ffffff;
  padding: 1rem;
  z-index: 1001;
}

.navbar-menu {
  display: none;
  flex-direction: column;
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 10px;
  margin-right: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-menu.is-active {
  display: flex;
}

.navbar-item {
  color: #333;
  text-decoration: none;
  margin: 0.5rem 0;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s ease;
}

.navbar-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #3c3c3c;
  transition: width 0.3s ease;
}

.navbar-burger {
  display: block;
  background-color: white;
  cursor: pointer;
  padding: 0.5rem;
  border: none;
}

.navbar-burger span {
  display: block;
  width: 25px;
  height: 3px;
  background-color: #333;
  margin: 5px 0;
  transition: all 0.3s ease;
}

.navbar-burger.is-active span:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.navbar-burger.is-active span:nth-child(2) {
  opacity: 0;
}

.navbar-burger.is-active span:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

.auth-buttons {
  margin-left: 0;
  margin-top: 0.5rem;
}

/* Desktop styles */
@media (min-width: 769px) {
  .filter-toggle {
    display: none;
  }
  
  .navbar-filters-desktop {
    display: block;
  }
}

/* Mobile styles */
@media (max-width: 768px) {
  .filter-toggle {
    display: block;
  }
  
  .navbar-filters-desktop {
    display: none;
  }
}
</style>