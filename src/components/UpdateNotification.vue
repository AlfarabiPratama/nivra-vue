<template>
  <v-snackbar
    v-model="showUpdate"
    :timeout="-1"
    location="top"
    color="info"
    variant="flat"
    class="update-snackbar"
  >
    <div class="d-flex align-center">
      <v-icon icon="mdi-update" class="mr-3"></v-icon>
      <div class="flex-grow-1">
        <div class="font-weight-bold">Update Available</div>
        <div class="text-caption">A new version of Nivra is ready</div>
      </div>
    </div>

    <template v-slot:actions>
      <v-btn
        variant="text"
        size="small"
        @click="updateApp"
        class="font-weight-bold"
      >
        Update
      </v-btn>
      <v-btn
        variant="text"
        size="small"
        icon="mdi-close"
        @click="showUpdate = false"
      ></v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref, onMounted } from "vue";

const showUpdate = ref(false);
let registration = null;

const checkForUpdates = (reg) => {
  registration = reg;

  // Check if there's a waiting service worker
  if (reg.waiting) {
    showUpdate.value = true;
  }

  // Listen for new service worker
  reg.addEventListener("updatefound", () => {
    const newWorker = reg.installing;

    newWorker.addEventListener("statechange", () => {
      if (
        newWorker.state === "installed" &&
        navigator.serviceWorker.controller
      ) {
        // New service worker is ready
        showUpdate.value = true;
      }
    });
  });
};

const updateApp = () => {
  if (!registration || !registration.waiting) return;

  // Tell the waiting service worker to skip waiting
  registration.waiting.postMessage({ type: "SKIP_WAITING" });

  showUpdate.value = false;

  // Reload the page to activate the new service worker
  setTimeout(() => {
    window.location.reload();
  }, 100);
};

onMounted(() => {
  // Listen for controller change (new SW activated)
  navigator.serviceWorker?.addEventListener("controllerchange", () => {
    window.location.reload();
  });

  // Get current registration and check for updates
  navigator.serviceWorker?.ready.then((reg) => {
    checkForUpdates(reg);

    // Check for updates periodically (every 60 seconds)
    setInterval(() => {
      reg.update();
    }, 60000);
  });
});
</script>

<style scoped>
.update-snackbar {
  z-index: 9999;
}
</style>
