<template>
  <div class="heatmap-container">
    <div class="heatmap-grid">
      <div
        v-for="(day, index) in days"
        :key="index"
        class="heatmap-cell"
        :style="{ backgroundColor: getColor(day.count) }"
        v-tooltip="`${day.date}: ${day.count} aktivitas`"
      ></div>
    </div>
    <!-- Legend -->
    <div class="d-flex align-center justify-end mt-2 gap-1">
      <span class="text-caption text-medium-emphasis mr-2">Less</span>
      <div
        class="heatmap-cell"
        style="background-color: rgba(var(--v-theme-primary), 0.1)"
      ></div>
      <div
        class="heatmap-cell"
        style="background-color: rgba(var(--v-theme-primary), 0.4)"
      ></div>
      <div
        class="heatmap-cell"
        style="background-color: rgba(var(--v-theme-primary), 0.7)"
      ></div>
      <div
        class="heatmap-cell"
        style="background-color: rgb(var(--v-theme-primary))"
      ></div>
      <span class="text-caption text-medium-emphasis ml-2">More</span>
    </div>
  </div>
</template>

<script setup>
import { eachDayOfInterval, format, subDays } from "date-fns";
import { computed } from "vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}), // Format: { '2023-10-27': 5, ... }
  },
});

// Generate last 180 days (approx 6 months) for better mobile fit
const days = computed(() => {
  const end = new Date();
  const start = subDays(end, 180);

  const dateRange = eachDayOfInterval({ start, end });

  return dateRange.map((date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return {
      date: dateStr,
      count: props.data[dateStr] || 0,
    };
  });
});

const getColor = (count) => {
  if (count === 0) return "rgba(var(--v-theme-on-surface), 0.05)";
  if (count < 2) return "rgba(var(--v-theme-primary), 0.3)";
  if (count < 4) return "rgba(var(--v-theme-primary), 0.6)";
  return "rgb(var(--v-theme-primary))";
};
</script>

<style scoped>
.heatmap-container {
  overflow-x: auto;
  padding: 4px 0;
}

.heatmap-grid {
  display: grid;
  grid-template-rows: repeat(7, 12px);
  grid-auto-flow: column;
  gap: 3px;
  min-width: min-content;
  padding-bottom: 4px;
}

.heatmap-cell {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.heatmap-cell:hover {
  transform: scale(1.3);
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 600px) {
  .heatmap-grid {
    grid-template-rows: repeat(7, 10px);
    gap: 2px;
  }

  .heatmap-cell {
    width: 10px;
    height: 10px;
  }
}
</style>
