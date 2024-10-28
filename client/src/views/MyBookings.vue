<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from 'vue-clerk'
import { fetchUserBookings } from '../services/bookingService'

const { userId } = useAuth()
const bookings = ref<Booking[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString()
}

const loadBookings = async () => {
  const currentUserId = userId.value
  if (!currentUserId) {
    error.value = 'No user ID found. Please log in.'
    loading.value = false;
    return;
  }
  try {
    loading.value = true
    error.value = null
    bookings.value = await fetchUserBookings(currentUserId)
  } catch (err) {
    error.value = 'Failed to load bookings. Please try again later.'
    console.error('Error loading bookings:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadBookings()
})

</script>

<template>
  <div class="my-bookings">
    <div class="header-section">
      <h1 class="page-title">Mina bokningar</h1>
      <div class="header-line"></div>
    </div>
    
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
      </div>
      <span class="loading-text">Loading your bookings...</span>
    </div>

    <div v-else-if="error" class="error-message">
      <div class="error-icon">!</div>
      <div class="error-content">
        <h4>Error Loading Bookings</h4>
        <p>{{ error }}</p>
      </div>
    </div>

    <div v-else-if="bookings.length === 0" class="empty-state">
      <div class="empty-icon">📅</div>
      <p>Du har inga bokningar än.</p>
    </div>

    <div v-else class="bookings-grid">
      <div
        v-for="booking in bookings"
        :key="booking._id"
        class="booking-card"
      >
        <div class="booking-content">
          <div class="booking-header">
            <div class="property-info">
              <h3 class="booking-title">
                {{ booking.propertyId.title }}
              </h3>
              <span
                class="status-badge"
                :class="{
                  'status-confirmed': booking.status === 'confirmed',
                  'status-pending': booking.status === 'pending',
                  'status-cancelled': booking.status === 'cancelled'
                }"
              >
                {{ booking.status }}
              </span>
            </div>
          </div>
          
          <div class="booking-details">
            <div class="details-grid">
              <div class="detail-item">
                <span class="detail-label">Check-in</span>
                <span class="detail-value">{{ formatDate(booking.startDate) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Check-out</span>
                <span class="detail-value">{{ formatDate(booking.endDate) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Nätter</span>
                <span class="detail-value highlight">{{ booking.numberOfNights }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Totalt</span>
                <span class="detail-value price">{{ booking.totalPrice }} kr</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-bookings {
  margin: 3rem auto;
  max-width: 1200px;
  padding: 0 2rem;
  min-height: 100vh;
}

.header-section {
  margin-bottom: 3rem;
  position: relative;
  text-align: center;
  margin-top: 50px;
}

.page-title {
  font-size: 2.75rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
}

.header-line {
  height: 4px;
  width: 60px;
  border-radius: 2px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.loading-spinner {
  position: relative;
  width: 50px;
  height: 50px;
  margin-bottom: 1rem;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s cubic-bezier(0.55, 0.25, 0.25, 0.7) infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-text {
  color: #64748b;
  font-size: 1.125rem;
  font-weight: 500;
}

.error-message {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  background-color: #fef2f2;
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid #fee2e2;
}

.error-icon {
  width: 2rem;
  height: 2rem;
  background-color: #ef4444;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.error-content h4 {
  color: #991b1b;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.error-content p {
  color: #b91c1c;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

.empty-state p {
  color: #64748b;
  font-size: 1.125rem;
}

.bookings-grid {
  display: grid;
  gap: 2rem;
}

.booking-card {
  background: white;
  border-radius: 1.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05),
              0 10px 15px -3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(148, 163, 184, 0.1);
  overflow: hidden;
  position: relative;
}

.booking-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.booking-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, #3b82f6, #60a5fa);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.booking-card:hover::before {
  opacity: 1;
}

.booking-content {
  padding: 2rem;
}

.booking-header {
  margin-bottom: 2rem;
}

.property-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.booking-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.3;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-label {
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  color: #1e293b;
  font-size: 1.125rem;
  font-weight: 600;
}


.detail-value.price {
  font-size: 1.25rem;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.025em;
  text-transform: capitalize;
}

.status-confirmed {
  background-color: #ecfdf5;
  color: #047857;
}

.status-pending {
  background-color: #fefce8;
  color: #854d0e;
}

.status-cancelled {
  background-color: #fef2f2;
  color: #991b1b;
}

@media (max-width: 768px) {
  .my-bookings {
    margin: 2rem auto;
    padding: 0 1rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .booking-content {
    padding: 1.5rem;
  }

  .details-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .booking-title {
    font-size: 1.25rem;
  }

  .property-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}

@media (min-width: 768px) {
  .bookings-grid {
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }
}
</style>