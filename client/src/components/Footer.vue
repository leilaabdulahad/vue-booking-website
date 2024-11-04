<script setup lang="ts">
import { ref } from 'vue'
const currentYear = ref(new Date().getFullYear())
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-text">
        <span>© {{ currentYear }} EurBNB AB</span>
        <span>·</span>
        <span>Integritet</span>
        <span>·</span>
        <span>Villkor</span>
        <span>·</span>
        <span>Om oss</span>
        <span>·</span>
        <span>Företagsuppgifter</span>
      </div>
      <div class="footer-icons">
        <a href="#" aria-label="Twitter" class="footer-icon"><i class="fab fa-twitter"></i></a>
        <a href="#" aria-label="Instagram" class="footer-icon"><i class="fab fa-instagram"></i></a>
        <a href="#" aria-label="Facebook" class="footer-icon"><i class="fab fa-facebook-f"></i></a>
      </div>
    </div>
  </footer>
</template>



<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  text-align: center;
  justify-content: center;
  border-top: 1px solid #eaeaea;
  background-color: #fff;
  color: #555;
  font-size: 14px;
  padding: 20px 0;
  z-index: 100; 
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 10px;
}

.footer-text {
  color: #777;
  display: flex;
  gap: 10px;
  font-size: 0.9rem;
}

.footer-icons {
  display: flex;
  gap: 15px;
}

.footer-icon {
  color: #555;
  font-size: 1.2rem;
  transition: color 0.2s ease;
}

.footer-icon:hover {
  color: #000;
}
</style>
