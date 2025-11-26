<template>
  <div class="chart-container">
    <!-- Tooltip -->
    <div
      v-if="tooltip.show"
      class="chart-tooltip"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      <div class="text-caption font-weight-bold">{{ tooltip.label }}</div>
      <div class="text-body-2">{{ tooltip.value }}</div>
    </div>

    <div :style="{ height: height + 'px' }" class="relative w-100">
      <svg
        :viewBox="`0 0 ${width} ${height}`"
        class="w-100 h-100"
        preserveAspectRatio="none"
        @mouseleave="hideTooltip"
      >
        <!-- Grid Lines -->
        <g class="grid-lines">
          <line
            v-for="i in 5"
            :key="i"
            x1="0"
            :y1="(height / 4) * (i - 1)"
            :x2="width"
            :y2="(height / 4) * (i - 1)"
            stroke="rgba(var(--v-theme-on-surface), 0.05)"
            stroke-width="1"
          />
        </g>

        <!-- Bar Chart -->
        <g v-if="type === 'bar'">
          <rect
            v-for="(point, index) in normalizedData"
            :key="index"
            :x="getBarX(index)"
            :y="height - point.height"
            :width="barWidth"
            :height="point.height"
            :fill="color"
            class="chart-bar"
            rx="4"
            @mouseenter="showTooltip($event, data[index])"
          />
        </g>

        <!-- Line Chart -->
        <g v-if="type === 'line'">
          <!-- Area Fill -->
          <path
            :d="areaPath"
            :fill="`rgba(var(--v-theme-${colorName}), 0.1)`"
            class="chart-area"
          />
          <!-- Line Stroke -->
          <path
            :d="linePath"
            fill="none"
            :stroke="color"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="chart-line"
          />
          <!-- Points -->
          <circle
            v-for="(point, index) in normalizedData"
            :key="index"
            :cx="getPointX(index)"
            :cy="height - point.height"
            r="4"
            :fill="color"
            class="chart-point"
            stroke="white"
            stroke-width="2"
            @mouseenter="showTooltip($event, data[index])"
          />
        </g>
      </svg>
    </div>

    <!-- X-Axis Labels -->
    <div class="d-flex justify-space-between mt-2 px-2">
      <div
        v-for="(label, index) in labels"
        :key="index"
        class="text-caption text-medium-emphasis"
        style="font-size: 10px"
      >
        {{ label }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => [],
  },
  labels: {
    type: Array,
    required: true,
    default: () => [],
  },
  type: {
    type: String,
    default: "bar", // 'bar' or 'line'
  },
  height: {
    type: Number,
    default: 150,
  },
  color: {
    type: String,
    default: "currentColor",
  },
  colorName: {
    type: String,
    default: "primary",
  },
});

const width = 300; // Internal SVG coordinate width
const padding = 10;

const maxValue = computed(() => {
  return Math.max(...props.data, 1); // Avoid division by zero
});

const normalizedData = computed(() => {
  return props.data.map((value) => ({
    value,
    height: (value / maxValue.value) * (props.height - 20), // Leave space for top padding
  }));
});

// Bar Chart Helpers
const barWidth = computed(() => {
  return (width - padding * 2) / props.data.length - 8; // Gap of 8
});

const getBarX = (index) => {
  return padding + index * ((width - padding * 2) / props.data.length) + 4;
};

// Line Chart Helpers
const getPointX = (index) => {
  return padding + index * ((width - padding * 2) / (props.data.length - 1));
};

const linePath = computed(() => {
  if (props.data.length === 0) return "";

  return props.data
    .map((value, index) => {
      const x = getPointX(index);
      const y = props.height - (value / maxValue.value) * (props.height - 20);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
});

const areaPath = computed(() => {
  if (props.data.length === 0) return "";

  const path = linePath.value;
  const firstX = getPointX(0);
  const lastX = getPointX(props.data.length - 1);

  return `${path} L ${lastX} ${props.height} L ${firstX} ${props.height} Z`;
});

// Tooltip Logic
const tooltip = ref({
  show: false,
  x: 0,
  y: 0,
  label: "",
  value: 0,
});

const showTooltip = (event, value) => {
  const rect = event.target.getBoundingClientRect();
  const containerRect = event.target
    .closest(".chart-container")
    .getBoundingClientRect();

  tooltip.value = {
    show: true,
    x: rect.left - containerRect.left + rect.width / 2,
    y: rect.top - containerRect.top - 40,
    label: "Value",
    value: value,
  };
};

const hideTooltip = () => {
  tooltip.value.show = false;
};
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
}

.chart-bar {
  transition: height 0.5s ease, y 0.5s ease;
  cursor: pointer;
}

.chart-bar:hover {
  opacity: 0.8;
}

.chart-line {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: drawLine 1.5s ease forwards;
}

.chart-area {
  opacity: 0;
  animation: fadeIn 1s ease forwards 0.5s;
}

.chart-point {
  transition: r 0.2s ease;
  cursor: pointer;
}

.chart-point:hover {
  r: 6;
}

.chart-tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  pointer-events: none;
  transform: translateX(-50%);
  z-index: 10;
  text-align: center;
  min-width: 60px;
}

@keyframes drawLine {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style>
