<template>
  <transition name="slide-up">
    <v-snackbar
      v-model="visible"
      :timeout="-1"
      location="bottom"
      color="error"
      variant="flat"
      class="offline-snackbar"
    >
      <div class="d-flex align-center">
        <v-icon icon="mdi-wifi-off" class="mr-3 pulse-icon"></v-icon>
        <div>
          <div class="font-weight-bold">You're offline</div>
          <div class="text-caption">Some features may be limited</div>
        </div>
      </div>
    </v-snackbar>
  </transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const visible = ref(false);

const updateOnlineStatus = () => {
  visible.value = !navigator.onLine;
};

const handleOnline = () => {
  visible.value = false;
};

const handleOffline = () => {
  visible.value = true;
};

onMounted(() => {
  // Check initial status
  updateOnlineStatus();

  // Listen for online/offline events
  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);
});

onBeforeUnmount(() => {
  window.removeEventListener("online", handleOnline);
  window.removeEventListener("offline", handleOffline);
});
</script>

<style scoped>
.offline-snackbar {
  z-index: 9998;
}

.pulse-icon {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
