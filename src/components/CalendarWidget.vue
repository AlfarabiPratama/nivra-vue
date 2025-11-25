<template>
  <v-card class="ocean-card pa-6 h-100" elevation="0">
    <div class="calendar-header mb-4">
      <div class="d-flex justify-space-between align-center">
        <v-btn
          icon="mdi-chevron-left"
          variant="text"
          size="small"
          @click="previousMonth"
          color="primary"
        ></v-btn>
        <div class="text-h6 font-weight-bold text-primary">
          {{ monthYearDisplay }}
        </div>
        <v-btn
          icon="mdi-chevron-right"
          variant="text"
          size="small"
          @click="nextMonth"
          color="primary"
        ></v-btn>
      </div>
    </div>

    <div class="calendar-grid">
      <!-- Day headers -->
      <div
        v-for="day in dayHeaders"
        :key="day"
        class="calendar-day-header text-caption font-weight-bold text-medium-emphasis text-center"
      >
        {{ day }}
      </div>

      <!-- Calendar days -->
      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        class="calendar-day text-center"
        :class="{
          'current-month': day.isCurrentMonth,
          'other-month': !day.isCurrentMonth,
          today: day.isToday,
          'has-tasks': day.hasTasks,
        }"
      >
        <div class="day-number text-body-2">
          {{ day.date }}
        </div>
        <div v-if="day.hasTasks" class="task-indicator"></div>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useTodoStore } from "../store/todoStore";

const todoStore = useTodoStore();

const currentDate = ref(new Date());
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth());

const dayHeaders = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const monthYearDisplay = computed(() => {
  const date = new Date(selectedYear.value, selectedMonth.value);
  return date.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
});

const calendarDays = computed(() => {
  const year = selectedYear.value;
  const month = selectedMonth.value;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // Get day of week for first day (0 = Sunday, adjust to Monday = 0)
  let startingDayOfWeek = firstDay.getDay();
  startingDayOfWeek = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

  const days = [];

  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: prevMonthLastDay - i,
      isCurrentMonth: false,
      isToday: false,
      hasTasks: false,
    });
  }

  // Current month days
  const today = new Date();
  const isCurrentYearMonth =
    year === today.getFullYear() && month === today.getMonth();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    const hasTasks = todoStore.tasks.some((task) => task.dueDate === dateStr);

    days.push({
      date: day,
      isCurrentMonth: true,
      isToday: isCurrentYearMonth && day === today.getDate(),
      hasTasks: hasTasks,
    });
  }

  // Next month days to fill the grid
  const remainingDays = 42 - days.length; // 6 rows x 7 days
  for (let day = 1; day <= remainingDays; day++) {
    days.push({
      date: day,
      isCurrentMonth: false,
      isToday: false,
      hasTasks: false,
    });
  }

  return days.slice(0, 42); // Ensure exactly 6 weeks
});

const previousMonth = () => {
  if (selectedMonth.value === 0) {
    selectedMonth.value = 11;
    selectedYear.value--;
  } else {
    selectedMonth.value--;
  }
};

const nextMonth = () => {
  if (selectedMonth.value === 11) {
    selectedMonth.value = 0;
    selectedYear.value++;
  } else {
    selectedMonth.value++;
  }
};

onMounted(() => {
  // Set to current month/year
  const now = new Date();
  selectedYear.value = now.getFullYear();
  selectedMonth.value = now.getMonth();
});
</script>

<style scoped>
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-day-header {
  padding: 8px 4px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 8px;
  transition: all 0.2s;
  position: relative;
  cursor: pointer;
}

.calendar-day.current-month {
  background: rgba(var(--v-theme-surface), 0.5);
}

.calendar-day.other-month .day-number {
  opacity: 0.3;
}

.calendar-day.today {
  background: rgb(var(--v-theme-primary));
  color: white;
  font-weight: bold;
}

.calendar-day.today .day-number {
  color: white;
}

.calendar-day:hover.current-month {
  background: rgba(var(--v-theme-primary), 0.1);
  transform: scale(1.05);
}

.task-indicator {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgb(var(--v-theme-accent));
  position: absolute;
  bottom: 4px;
}

.calendar-day.today .task-indicator {
  background: white;
}

.day-number {
  font-size: 0.875rem;
}
</style>
