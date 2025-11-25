<template>
  <transition name="slide-up">
    <v-card
      v-if="showPrompt && !dismissed"
      class="install-prompt elevation-8"
      rounded="xl"
    >
      <v-card-text class="pa-4">
        <div class="d-flex align-center">
          <v-avatar size="48" class="mr-3">
            <v-img src="/nivra-vue/logo.png" alt="Nivra Logo"></v-img>
          </v-avatar>

          <div class="flex-grow-1">
            <div class="text-subtitle-1 font-weight-bold">Install Nivra</div>
            <div class="text-caption text-medium-emphasis">
              Install app untuk pengalaman yang lebih baik
            </div>
          </div>

          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            @click="dismiss"
            aria-label="Close install prompt"
          ></v-btn>
        </div>

        <div class="d-flex gap-2 mt-3">
          <v-btn
            color="primary"
            variant="flat"
            size="small"
            @click="install"
            prepend-icon="mdi-download"
            class="flex-grow-1"
          >
            Install
          </v-btn>
          <v-btn
            color="surface"
            variant="flat"
            size="small"
            @click="dismiss"
            class="flex-grow-1"
          >
            Not now
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const showPrompt = ref(false);
const dismissed = ref(false);
const deferredPrompt = ref(null);

const handleBeforeInstallPrompt = (e) => {
  // Prevent the default browser install prompt
  e.preventDefault();

  // Store the event for later use
  deferredPrompt.value = e;

  // Check if already dismissed in this session
  const dismissedInSession = sessionStorage.getItem("install-prompt-dismissed");
  if (!dismissedInSession) {
    // Show custom install prompt after a short delay
    setTimeout(() => {
      showPrompt.value = true;
    }, 3000); // Show after 3 seconds
  }
};

const install = async () => {
  if (!deferredPrompt.value) return;

  // Show the browser's install prompt
  deferredPrompt.value.prompt();

  // Wait for the user's response
  const { outcome } = await deferredPrompt.value.userChoice;

  console.log(`User response to install prompt: ${outcome}`);

  // Clear the deferred prompt
  deferredPrompt.value = null;
  showPrompt.value = false;
};

const dismiss = () => {
  showPrompt.value = false;
  dismissed.value = true;

  // Remember dismissal for this session
  sessionStorage.setItem("install-prompt-dismissed", "true");
};

onMounted(() => {
  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

  // Listen for successful installation
  window.addEventListener("appinstalled", () => {
    console.log("PWA was installed");
    showPrompt.value = false;
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
});
</script>

<style scoped>
.install-prompt {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 400px;
  width: calc(100% - 32px);
  z-index: 9999;
  background: rgba(var(--v-theme-surface), 0.98);
  backdrop-filter: blur(20px);
}

@media (min-width: 960px) {
  .install-prompt {
    bottom: 24px;
    left: auto;
    right: 24px;
    transform: none;
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%) translateX(-50%);
  opacity: 0;
}

@media (min-width: 960px) {
  .slide-up-enter-from,
  .slide-up-leave-to {
    transform: translateY(100%);
  }
}
</style>
