<template>
  <v-card class="challenge-card" rounded="lg" elevation="2">
    <v-card-text class="pa-4">
      <div class="d-flex align-center mb-3">
        <v-icon
          :icon="challenge?.icon"
          color="primary"
          size="32"
          class="mr-3"
        ></v-icon>
        <div class="flex-grow-1">
          <div class="text-overline text-primary font-weight-bold">
            {{ challenge?.type }} Challenge
          </div>
          <div class="text-subtitle-1 font-weight-bold">
            {{ challenge?.name }}
          </div>
        </div>
        <v-chip
          size="small"
          color="accent"
          variant="tonal"
          class="font-weight-bold"
        >
          +{{ challenge?.xpReward }} XP
        </v-chip>
      </div>

      <p class="text-caption text-medium-emphasis mb-3">
        {{ challenge?.description }}
      </p>

      <div class="d-flex align-center gap-2">
        <v-progress-linear
          :model-value="progressPercentage"
          color="primary"
          height="8"
          rounded
          class="flex-grow-1"
        ></v-progress-linear>
        <span class="text-caption font-weight-bold">
          {{ progress }}/{{ challenge?.requirement.value }}
        </span>
      </div>

      <v-chip
        v-if="isCompleted"
        size="small"
        color="success"
        variant="flat"
        prepend-icon="mdi-check-circle"
        class="mt-3"
      >
        Completed!
      </v-chip>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  challenge: {
    type: Object,
    required: true,
  },
  progress: {
    type: Number,
    default: 0,
  },
});

const progressPercentage = computed(() => {
  if (!props.challenge?.requirement?.value) return 0;
  return Math.min(
    (props.progress / props.challenge.requirement.value) * 100,
    100
  );
});

const isCompleted = computed(() => {
  return props.progress >= (props.challenge?.requirement?.value || 0);
});
</script>

<style scoped>
.challenge-card {
  border: 2px solid rgba(var(--v-theme-primary), 0.2);
  transition: all 0.3s ease;
}

.challenge-card:hover {
  border-color: rgba(var(--v-theme-primary), 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
</style>
