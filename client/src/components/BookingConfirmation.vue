<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const bookingId = route.query.bookingId as string
</script>

<template>
  <div class="booking-confirmation">
    <div class="confirmation-card">
      <div v-if="bookingId" class="booking-info">
        <div class="checkmark">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FC4646" 
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="checkmark-icon"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h1>Bokningsbekräftelse</h1>
        <p>Boknings ID: <strong>{{ bookingId }}</strong></p>
        <p>Bokningsbekräftelsen har skickats till din mailadress.</p>
      </div>
      <div v-else>
        <p>Ingen bokningsinformation tillgänglig</p>
      </div>
      <div class="button-group">
        <router-link to="/" class="home-link">Hem</router-link>
        <router-link to="/my-bookings" class="my-bookings-link">Mina Bokningar</router-link>
      </div>
    </div>
  </div>
</template>


<style scoped>
.booking-confirmation {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  margin-top: 100px;
}

h1 {
  font-size: 2rem;
  margin-bottom: 20px;
}

.confirmation-card {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 0 auto;
  transition: box-shadow 0.3s ease;
  max-width: 800px;
}

.confirmation-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.booking-info {
  margin-bottom: 20px;
}

.checkmark {
  margin-bottom: 15px;
}

.checkmark-icon {
  fill: none;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.home-link, .my-bookings-link {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.3s ease;
  background-color: #1E3E62;
  color: white;
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.5rem;
  }

  .confirmation-card {
    padding: 15px;
  }
}
</style>
