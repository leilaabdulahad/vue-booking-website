<script setup lang="ts">
interface Props {
  isOpen: boolean;
  missingFields: string[]
}

interface Emits {
  (e: 'update:isOpen', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const closeModal = () => {
  emit('update:isOpen', false)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header-wrapper">
            <button @click="closeModal" class="close-button" aria-label="Close">
              ×
            </button>
            <div class="modal-header">
              <h3>Ofullständig information</h3>
            </div>
          </div>
          <div class="modal-body">
            <p>Följande fält måste fyllas i:</p>
            <ul>
              <li v-for="(field, index) in missingFields" :key="index">
                {{ field }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 450px;
  width: 90%;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  transform-origin: center;
}

.modal-header-wrapper {
  position: relative;
  padding: 0.5rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: #1a1a1a;
}

.close-button {
  position: absolute;
  right: 0;
  top: 0;
  background: none;
  border: none;
  font-size: 1.75rem;
  color: #666;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  transition: color 0.2s ease;
}

.close-button:hover {
  color: #1a1a1a;
}

.modal-body {
  margin-bottom: 2rem;
  color: #4a4a4a;
}

.modal-body p {
  margin-bottom: 1rem;
  font-size: 1rem;
}

.modal-body ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.modal-body li {
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
  position: relative;
}

.modal-body li::before {
  color: #1E3E62;
  position: absolute;
  left: 0;
  font-weight: bold;
}

.modal-button {
  background-color: #1E3E62;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.modal-button:hover {
  background-color: #15304D;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(30, 62, 98, 0.2);
}

.modal-button:active {
  transform: translateY(0);
  box-shadow: none;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: scale(1);
}

@media (max-width: 640px) {
  .modal-content {
    padding: 1.5rem;
    margin: 1rem;
  }

  .modal-header h3 {
    font-size: 1.25rem;
  }

  .modal-button {
    width: 100%;
  }
}
</style>