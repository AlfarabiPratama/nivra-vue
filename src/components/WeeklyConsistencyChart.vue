<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup>
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { computed } from "vue";
import { Line } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps({
  habits: {
    type: Array,
    default: () => [],
  },
});

const chartData = computed(() => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  // Mock data logic for now, ideally calculate from props.habits
  // In a real app, we'd iterate over the last 7 days and count completions
  const data = [65, 59, 80, 81, 56, 55, 90];

  return {
    labels: days,
    datasets: [
      {
        label: "Consistency",
        backgroundColor: "#8B5CF6",
        borderColor: "#8B5CF6",
        data: data,
        tension: 0.4, // Smooth curves
        pointRadius: 0, // Hide points for cleaner look
        borderWidth: 3,
        fill: true,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: "index",
      intersect: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        color: "#94a3b8",
      },
    },
    y: {
      display: false, // Hide Y axis
      min: 0,
      max: 100,
    },
  },
};
</script>
