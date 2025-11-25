<template>
  <div class="view-container h-100 d-flex flex-column">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <h2 class="text-h4 font-weight-bold">Mode Fokus</h2>
      <v-chip color="primary" variant="flat" class="font-weight-bold">
        <v-icon start icon="mdi-fire"></v-icon>
        {{ focusStore.totalSessions }} Sesi Selesai
      </v-chip>
    </div>

    <!-- Main Timer Card -->
    <v-card
      class="ocean-card flex-grow-1 d-flex flex-column align-center justify-center relative overflow-hidden pa-6 mb-6"
      :class="{ 'pulse-bg': focusStore.isActive }"
    >
      <!-- Background Animation -->
      <div class="absolute-bg-circle"></div>

      <!-- Mode Selector -->
      <div class="d-flex gap-2 mb-8 z-10">
        <v-btn
          v-for="mode in modes"
          :key="mode.value"
          :variant="focusStore.mode === mode.value ? 'flat' : 'text'"
          :color="
            focusStore.mode === mode.value ? 'primary' : 'medium-emphasis'
          "
          rounded="pill"
          @click="focusStore.setMode(mode.value)"
        >
          {{ mode.label }}
        </v-btn>
      </div>

      <!-- Timer Circle -->
      <div class="timer-container mb-8 z-10">
        <v-progress-circular
          :model-value="focusStore.progress"
          :size="280"
          :width="12"
          color="primary"
          bg-color="rgba(var(--v-theme-primary), 0.1)"
          class="drop-shadow-lg"
        >
          <div class="text-center">
            <div class="text-display-2 font-weight-black tracking-tight">
              {{ focusStore.formattedTime }}
            </div>
            <div
              class="text-body-1 font-weight-medium text-medium-emphasis mt-2"
            >
              {{ currentTaskTitle || "Pilih tugas untuk fokus" }}
            </div>
          </div>
        </v-progress-circular>
      </div>

      <!-- Controls -->
      <div class="d-flex gap-4 z-10">
        <v-btn
          icon="mdi-refresh"
          variant="tonal"
          color="medium-emphasis"
          size="large"
          @click="focusStore.resetTimer"
        ></v-btn>

        <v-btn
          :icon="focusStore.isActive ? 'mdi-pause' : 'mdi-play'"
          color="primary"
          size="x-large"
          elevation="4"
          class="play-btn"
          @click="focusStore.toggleTimer"
        ></v-btn>

        <v-btn
          icon="mdi-skip-next"
          variant="tonal"
          color="medium-emphasis"
          size="large"
          @click="skipSession"
        ></v-btn>
      </div>
    </v-card>

    <!-- Bottom Controls: Task & Sound -->
    <v-row>
      <!-- Task Selector -->
      <v-col cols="12" md="6">
        <v-card class="ocean-card pa-4 h-100">
          <div class="d-flex align-center mb-2">
            <v-icon
              icon="mdi-checkbox-marked-circle-outline"
              class="mr-2"
              color="primary"
            ></v-icon>
            <span class="font-weight-bold">Fokus Pada</span>
          </div>
          <v-select
            v-model="focusStore.selectedTaskId"
            :items="todoStore.tasks.filter((t) => !t.completed)"
            item-title="title"
            item-value="id"
            label="Pilih Tugas"
            variant="outlined"
            density="comfortable"
            hide-details
            placeholder="Tanpa tugas spesifik"
            clearable
          ></v-select>
        </v-card>
      </v-col>

      <!-- Sound Controls -->
      <v-col cols="12" md="6">
        <v-card class="ocean-card pa-4 h-100">
          <div class="d-flex align-center mb-2">
            <v-icon
              icon="mdi-headphones"
              class="mr-2"
              color="secondary"
            ></v-icon>
            <span class="font-weight-bold">Suara Latar</span>
          </div>
          <div class="d-flex gap-2">
            <v-btn
              v-for="sound in sounds"
              :key="sound.id"
              :variant="currentSound === sound.id ? 'flat' : 'outlined'"
              :color="
                currentSound === sound.id ? 'secondary' : 'medium-emphasis'
              "
              class="flex-grow-1"
              @click="toggleSound(sound.id)"
            >
              <v-icon :icon="sound.icon" class="mr-1"></v-icon>
              {{ sound.label }}
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Audio Elements (Hidden) -->
    <audio
      ref="audioRain"
      loop
      src="https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg"
    ></audio>
    <audio
      ref="audioCafe"
      loop
      src="https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg"
    ></audio>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useFocusStore } from "@/store/focusStore";
import { useTodoStore } from "@/store/todoStore";

const focusStore = useFocusStore();
const todoStore = useTodoStore();

const audioRain = ref(null);
const audioCafe = ref(null);
const currentSound = ref(null);

const modes = [
  { label: "Fokus", value: "focus" },
  { label: "Istirahat Pendek", value: "short-break" },
  { label: "Istirahat Panjang", value: "long-break" },
];

const sounds = [
  { id: "rain", label: "Hujan", icon: "mdi-weather-pouring" },
  { id: "cafe", label: "Kafe", icon: "mdi-coffee" },
];

const currentTaskTitle = computed(() => {
  if (!focusStore.selectedTaskId) return null;
  const task = todoStore.tasks.find((t) => t.id === focusStore.selectedTaskId);
  return task ? task.title : null;
});

const toggleSound = (soundId) => {
  // Stop all first
  audioRain.value.pause();
  audioCafe.value.pause();

  if (currentSound.value === soundId) {
    // If clicking active sound, just turn it off
    currentSound.value = null;
  } else {
    // Play new sound
    currentSound.value = soundId;
    if (soundId === "rain") audioRain.value.play();
    if (soundId === "cafe") audioCafe.value.play();
  }
};

const skipSession = () => {
  focusStore.resetTimer();
  // Logic to skip to next mode could go here
};

// Watch for timer stop to stop sounds if desired?
// For now, let sounds play until user stops them or leaves page.
// But maybe stop on unmount.

import { onUnmounted } from "vue";
onUnmounted(() => {
  if (audioRain.value) audioRain.value.pause();
  if (audioCafe.value) audioCafe.value.pause();
});
</script>

<style scoped>
.ocean-card {
  background: rgb(var(--v-theme-surface));
  border-radius: 24px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.pulse-bg {
  animation: pulse-border 2s infinite;
}

@keyframes pulse-border {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-primary), 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(var(--v-theme-primary), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-primary), 0);
  }
}

.absolute-bg-circle {
  position: absolute;
  width: 600px;
  height: 600px;
  background: radial-gradient(
    circle,
    rgba(var(--v-theme-primary), 0.03) 0%,
    transparent 70%
  );
  border-radius: 50%;
  z-index: 0;
}

.z-10 {
  position: relative;
  z-index: 10;
}

.play-btn {
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.play-btn:active {
  transform: scale(0.9);
}
</style>
