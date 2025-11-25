<template>
  <div class="mood-chart-container">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const props = defineProps({
  entries: {
    type: Array,
    required: true,
  },
});

// Map moods to numeric values for chart
const moodValues = {
  "sangat bahagia": 5,
  bahagia: 4,
  netral: 3,
  sedih: 2,
  "sangat sedih": 1,
};

// Process entries and create timeline data
const chartData = computed(() => {
  // Sort entries by date
  const sortedEntries = [...props.entries]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-14); // Last 14 days

  const labels = sortedEntries.map((entry) =>
    format(new Date(entry.date), "d MMM", { locale: id })
  );

  const data = sortedEntries.map((entry) => moodValues[entry.mood] || 3);

  return {
    labels,
    datasets: [
      {
        label: "Mood",
        data,
        borderColor: "#7C5CE2", // Ocean Mist primary
        backgroundColor: "rgba(124, 92, 226, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: "#7C5CE2",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverBackgroundColor: "#7C5CE2",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 3,
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
      backgroundColor: "rgba(30, 30, 46, 0.95)",
      titleColor: "#fff",
      bodyColor: "#fff",
      borderColor: "#7C5CE2",
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      callbacks: {
        label: function (context) {
          const moodLabels = {
            5: "😄 Sangat Bahagia",
            4: "🙂 Bahagia",
            3: "😐 Netral",
            2: "😔 Sedih",
            1: "😢 Sangat Sedih",
          };
          return moodLabels[context.parsed.y] || "Netral";
        },
      },
    },
  },
  scales: {
    y: {
      min: 0,
      max: 6,
      ticks: {
        stepSize: 1,
        color: "#9ca3af",
        font: {
          size: 11,
        },
        callback: function (value) {
          const moodEmojis = {
            5: "😄",
            4: "🙂",
            3: "😐",
            2: "😔",
            1: "😢",
          };
          return moodEmojis[value] || "";
        },
      },
      grid: {
        color: "rgba(124, 92, 226, 0.1)",
        drawBorder: false,
      },
    },
    x: {
      ticks: {
        color: "#9ca3af",
        font: {
          size: 11,
        },
        maxRotation: 45,
        minRotation: 45,
      },
      grid: {
        display: false,
        drawBorder: false,
      },
    },
  },
  interaction: {
    intersect: false,
    mode: "index",
  },
};
</script>

<style scoped>
.mood-chart-container {
  width: 100%;
  height: 250px;
  position: relative;
}
</style>
