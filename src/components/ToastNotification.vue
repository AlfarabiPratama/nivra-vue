<template>
  <transition name="toast">
    <div v-if="show" class="toast-notification d-flex align-center px-4 py-3">
      <v-avatar color="warning" size="32" class="mr-3">
        <v-icon size="18" color="white">mdi-lightning-bolt</v-icon>
      </v-avatar>
      <div>
        <div class="text-subtitle-2 font-weight-bold text-white">
          +{{ amount }} XP
        </div>
        <div class="text-caption text-white opacity-80">
          {{ message }}
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: Boolean,
  amount: { type: Number, default: 0 },
  message: { type: String, default: "Hebat!" },
});

const show = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    show.value = val;
  }
);
</script>

<style scoped>
.toast-notification {
  position: fixed;
  bottom: 24px; /* Above bottom nav on mobile */
  right: 24px;
  background: #273544; /* Ocean Mist Dark */
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  min-width: 200px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}
</style>
