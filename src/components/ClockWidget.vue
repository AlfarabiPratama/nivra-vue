<template>
  <v-card class="ocean-card pa-6 h-100" elevation="0">
    <div class="d-flex flex-column align-center justify-center h-100">
      <!-- Digital Clock -->
      <div class="clock-display mb-2">
        <div class="time-display text-h2 font-weight-black text-primary">
          {{ currentTime }}
        </div>
        <div
          class="date-display text-body-1 text-center text-medium-emphasis font-weight-medium"
        >
          {{ currentDate }}
        </div>
      </div>

      <!-- Clock Icon/Decoration -->
      <div class="clock-icon mt-4">
        <v-icon
          icon="mdi-clock-outline"
          size="48"
          color="primary"
          class="pulse-slow"
        ></v-icon>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const currentTime = ref("");
const currentDate = ref("");
let intervalId = null;

const updateTime = () => {
  const now = new Date();

  // Format time as HH:MM:SS
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  currentTime.value = `${hours}:${minutes}:${seconds}`;

  // Format date
  currentDate.value = now.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

onMounted(() => {
  updateTime();
  // Update every second
  intervalId = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped>
.clock-display {
  text-align: center;
}

.time-display {
  letter-spacing: 0.05em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}
</style>
