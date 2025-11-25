<script setup>
import { computed } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const props = defineProps({
  transactions: {
    type: Array,
    required: true,
  },
});

// Aggregate expenses by category
const categoryData = computed(() => {
  const expenses = props.transactions.filter((t) => t.type === "expense");
  const categoryMap = {};

  expenses.forEach((transaction) => {
    const category = transaction.category || "Lainnya";
    if (!categoryMap[category]) {
      categoryMap[category] = 0;
    }
    categoryMap[category] += transaction.amount;
  });

  return categoryMap;
});

const chartData = computed(() => {
  const categories = Object.keys(categoryData.value);
  const amounts = Object.values(categoryData.value);

  return {
    labels: categories,
    datasets: [
      {
        label: "Pengeluaran (Rp)",
        data: amounts,
        backgroundColor: [
          "rgba(141, 163, 179, 0.8)", // Ocean Mist Primary
          "rgba(95, 175, 139, 0.8)", // Secondary
          "rgba(255, 183, 77, 0.8)", // Accent
          "rgba(229, 115, 115, 0.8)", // Error
          "rgba(100, 181, 246, 0.8)", // Info
        ],
        borderColor: [
          "rgba(141, 163, 179, 1)",
          "rgba(95, 175, 139, 1)",
          "rgba(255, 183, 77, 1)",
          "rgba(229, 115, 115, 1)",
          "rgba(100, 181, 246, 1)",
        ],
        borderWidth: 2,
        borderRadius: 8,
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
      backgroundColor: "rgba(39, 53, 68, 0.9)",
      titleColor: "#ffffff",
      bodyColor: "#ffffff",
      padding: 12,
      borderRadius: 8,
      callbacks: {
        label: function (context) {
          return "Rp " + context.parsed.y.toLocaleString("id-ID");
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return "Rp " + value.toLocaleString("id-ID");
        },
        color: "#8DA3B3",
      },
      grid: {
        color: "rgba(141, 163, 179, 0.1)",
      },
    },
    x: {
      ticks: {
        color: "#8DA3B3",
      },
      grid: {
        display: false,
      },
    },
  },
};
</script>

<template>
  <div class="chart-container">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>
