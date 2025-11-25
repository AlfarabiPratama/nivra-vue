<template>
  <div class="heatmap-container">
    <h3>Activity Heatmap</h3>
    <div class="heatmap-grid">
      <div
        v-for="(day, index) in days"
        :key="index"
        class="heatmap-cell"
        :style="{ backgroundColor: getColor(day.count) }"
        :title="`${day.date}: ${day.count} activities`"
      ></div>
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

// Generate last 365 days or current year
const days = computed(() => {
  const end = new Date();
  const start = subDays(end, 364);

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
  if (count === 0) return "#ebedf0";
  if (count < 3) return "#c6e48b";
  if (count < 6) return "#7bc96f";
  if (count < 9) return "#239a3b";
  return "#196127";
};
</script>

<style scoped>
.heatmap-container {
  overflow-x: auto;
  padding: 10px 0;
}

.heatmap-container h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 1.1rem;
}

.heatmap-grid {
  display: grid;
  grid-template-rows: repeat(7, 10px);
  grid-auto-flow: column;
  gap: 2px;
  min-width: min-content;
}

.heatmap-cell {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.heatmap-cell:hover {
  transform: scale(1.3);
  z-index: 10;
}

/* Responsive */
@media (max-width: 480px) {
  .heatmap-container h3 {
    font-size: 0.95rem;
  }

  .heatmap-grid {
    grid-template-rows: repeat(7, 8px);
    gap: 1px;
  }

  .heatmap-cell {
    width: 8px;
    height: 8px;
  }
}

@media (min-width: 768px) {
  .heatmap-grid {
    grid-template-rows: repeat(7, 12px);
    gap: 3px;
  }

  .heatmap-cell {
    width: 12px;
    height: 12px;
  }
}
</style>
