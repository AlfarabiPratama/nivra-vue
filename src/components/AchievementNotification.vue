<template>
  <transition name="achievement-slide">
    <v-card
      v-if="show"
      class="achievement-notification elevation-12"
      rounded="xl"
    >
      <v-card-text class="pa-4">
        <div class="d-flex align-center">
          <div class="achievement-icon mr-3">
            <v-icon
              :icon="achievement?.icon"
              size="48"
              color="warning"
            ></v-icon>
          </div>

          <div class="flex-grow-1">
            <div class="text-overline text-accent font-weight-bold">
              🏆 Achievement Unlocked!
            </div>
            <div class="text-h6 font-weight-bold mb-1">
              {{ achievement?.name }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ achievement?.description }}
            </div>
            <v-chip
              v-if="achievement?.xpReward"
              size="small"
              color="accent"
              variant="tonal"
              class="mt-2 font-weight-bold"
            >
              +{{ achievement.xpReward }} XP
            </v-chip>
          </div>

          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            @click="close"
          ></v-btn>
        </div>
      </v-card-text>
    </v-card>
  </transition>
</template>

<script setup>
import { ref, watch } from "vue";
import { useUserStore } from "@/store/userStore";

const userStore = useUserStore();
const show = ref(false);
const achievement = ref(null);

watch(
  () => userStore.showAchievementNotification,
  (newVal) => {
    if (newVal) {
      achievement.value = userStore.currentAchievement;
      show.value = true;
    }
  }
);

const close = () => {
  show.value = false;
  userStore.showAchievementNotification = false;
};
</script>

<style scoped>
.achievement-notification {
  position: fixed;
  top: 80px;
  right: 24px;
  max-width: 400px;
  width: calc(100% - 48px);
  z-index: 9999;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-surface), 0.98),
    rgba(var(--v-theme-primary), 0.05)
  );
  backdrop-filter: blur(20px);
  border: 2px solid rgb(var(--v-theme-accent));
  box-shadow: 0 0 30px rgba(var(--v-theme-accent), 0.3);
}

.achievement-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffd700, #ffa500);
  border-radius: 50%;
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 40px rgba(255, 215, 0, 0.8);
  }
}

.achievement-slide-enter-active,
.achievement-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.achievement-slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.achievement-slide-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

@media (max-width: 600px) {
  .achievement-notification {
    top: auto;
    bottom: 80px;
    right: 16px;
    left: 16px;
    width: auto;
    max-width: none;
  }
}
</style>
