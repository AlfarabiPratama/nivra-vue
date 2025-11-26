<script setup>
import { useHabitStore } from "@/store/habitStore";
import { useUserStore } from "@/store/userStore";
import { onMounted, ref, computed } from "vue";

const habitStore = useHabitStore();
const userStore = useUserStore();

const showAddDialog = ref(false);
const showDeleteDialog = ref(false);
const showDayDetailDialog = ref(false);
const habitToDelete = ref(null);
const selectedDate = ref(null);
const selectedDayData = ref(null);

// View mode: 'list' or 'calendar'
const viewMode = ref("list");

// Calendar state
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());

const newHabit = ref({
  title: "",
  description: "",
  xp: 10,
  frequency: "Daily",
  icon: "mdi-circle",
  category: "Productivity",
});

// XP Popup State
const xpPopups = ref([]);
let popupIdCounter = 0;

// Search, Filter, and Sort state
const searchQuery = ref("");
const filterFrequency = ref("All"); // 'All', 'Daily', 'Weekly'
const sortBy = ref("newest"); // 'category', 'xp', 'newest', 'mostMissed'

const frequencies = ["Daily", "Weekly"];
const categories = [
  {
    title: "Kesehatan",
    value: "Health",
    color: "success",
    icon: "mdi-heart-pulse",
  },
  {
    title: "Produktivitas",
    value: "Productivity",
    color: "primary",
    icon: "mdi-rocket-launch",
  },
  {
    title: "Spiritual",
    value: "Spiritual",
    color: "info",
    icon: "mdi-meditation",
  },
  {
    title: "Finansial",
    value: "Financial",
    color: "warning",
    icon: "mdi-cash-multiple",
  },
  {
    title: "Edukasi",
    value: "Education",
    color: "secondary",
    icon: "mdi-school",
  },
];

const icons = [
  "mdi-meditation",
  "mdi-run",
  "mdi-book-open-variant",
  "mdi-water",
  "mdi-bed",
  "mdi-code-tags",
  "mdi-dumbbell",
  "mdi-food-apple",
  "mdi-yoga",
  "mdi-guitar-acoustic",
  "mdi-palette",
  "mdi-gamepad-variant",
];

onMounted(() => {
  // Data is auto-loaded by persistence plugin
});

const isCompletedToday = (habit) => {
  if (!habit.completedDates || habit.completedDates.length === 0) {
    return false;
  }
  const today = new Date().setHours(0, 0, 0, 0);
  return habit.completedDates.some(
    (date) => new Date(date).setHours(0, 0, 0, 0) === today
  );
};

const isCompletedOnDate = (habit, date) => {
  if (!habit.completedDates || habit.completedDates.length === 0) {
    return false;
  }
  const targetDate = new Date(date).setHours(0, 0, 0, 0);
  return habit.completedDates.some(
    (d) => new Date(d).setHours(0, 0, 0, 0) === targetDate
  );
};

const calculateStreak = (dates) => {
  if (!dates || dates.length === 0) return 0;

  const sortedDates = [...dates]
    .map((d) => new Date(d).setHours(0, 0, 0, 0))
    .sort((a, b) => b - a);

  const uniqueDates = [...new Set(sortedDates)];
  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = today - 86400000;

  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
    return 0;
  }

  let streak = 0;
  let currentCheck = uniqueDates[0];

  for (const date of uniqueDates) {
    if (date === currentCheck) {
      streak++;
      currentCheck -= 86400000;
    } else {
      break;
    }
  }
  return streak;
};

const calculateCompletionRate = (habit) => {
  if (!habit.createdAt) return 0;
  const created = new Date(habit.createdAt);
  const today = new Date();
  const diffTime = Math.abs(today - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  const completions = habit.completedDates ? habit.completedDates.length : 0;
  return Math.min(Math.round((completions / diffDays) * 100), 100);
};

const getCategoryColor = (categoryValue) => {
  const category = categories.find((c) => c.value === categoryValue);
  return category ? category.color : "primary";
};

const getStreakBadge = (streak) => {
  if (streak >= 30)
    return { image: "/icons/3d/trophy.png", color: "amber", label: "30 Hari!" };
  if (streak >= 14)
    return {
      image: "/icons/3d/medal.png",
      color: "deep-purple-accent-2",
      label: "2 Minggu!",
    };
  if (streak >= 7)
    return {
      image: "/icons/3d/fire.png",
      color: "deep-orange",
      label: "Seminggu!",
    };
  if (streak >= 3)
    return { image: "/icons/3d/star.png", color: "cyan", label: "3 Hari!" };
  return null;
};

// Filtered and Sorted Habits
const filteredAndSortedHabits = computed(() => {
  let habits = [...habitStore.habits];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    habits = habits.filter(
      (habit) =>
        habit.title.toLowerCase().includes(query) ||
        habit.description?.toLowerCase().includes(query)
    );
  }

  // Apply frequency filter
  if (filterFrequency.value !== "All") {
    habits = habits.filter(
      (habit) => habit.frequency === filterFrequency.value
    );
  }

  // Apply sorting
  switch (sortBy.value) {
    case "category":
      habits.sort((a, b) => (a.category || "").localeCompare(b.category || ""));
      break;
    case "xp":
      habits.sort((a, b) => b.xp - a.xp);
      break;
    case "newest":
      habits.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case "mostMissed":
      habits.sort(
        (a, b) => calculateCompletionRate(a) - calculateCompletionRate(b)
      );
      break;
  }

  return habits;
});

// Calendar computeds
const monthName = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value);
  return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
});

const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDay = firstDay.getDay(); // 0 = Sunday

  const days = [];

  // Add empty cells for days before the first day
  for (let i = 0; i < startDay; i++) {
    days.push({ date: null, status: "none" });
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const status = getDayStatus(date);
    days.push({ date, status, day });
  }

  return days;
});

const getDayStatus = (date) => {
  const dateTimestamp = new Date(date).setHours(0, 0, 0, 0);

  // Filter habits that existed on this date
  const activeHabits = habitStore.habits.filter((habit) => {
    const createdAt = new Date(habit.createdAt).setHours(0, 0, 0, 0);
    return createdAt <= dateTimestamp;
  });

  if (activeHabits.length === 0) return "none";

  const completedCount = activeHabits.filter((habit) =>
    isCompletedOnDate(habit, date)
  ).length;

  const completionRate = completedCount / activeHabits.length;

  if (completionRate === 1) return "complete";
  if (completionRate > 0) return "partial";
  return "missed";
};

const getDayStatusColor = (status) => {
  switch (status) {
    case "complete":
      return "success";
    case "partial":
      return "warning";
    case "missed":
      return "error";
    default:
      return "surface-variant";
  }
};

const handleAddHabit = async () => {
  if (newHabit.value.title) {
    if (newHabit.value.icon === "mdi-circle") {
      newHabit.value.icon = getIcon(newHabit.value);
    }

    await habitStore.addHabit(newHabit.value);

    newHabit.value = {
      title: "",
      description: "",
      xp: 10,
      frequency: "Daily",
      icon: "mdi-circle",
      category: "Productivity",
    };
    showAddDialog.value = false;
  }
};

const handleCompleteHabit = async (habit, event) => {
  if (!isCompletedToday(habit)) {
    const rect = event.target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    addXpPopup(x, y, habit.xp);
    await habitStore.completeHabit(habit.id);
  }
};

const confirmDelete = (habit) => {
  habitToDelete.value = habit;
  showDeleteDialog.value = true;
};

const handleDeleteHabit = async () => {
  if (habitToDelete.value) {
    await habitStore.deleteHabit(habitToDelete.value.id);
    showDeleteDialog.value = false;
    habitToDelete.value = null;
  }
};

const addXpPopup = (x, y, amount) => {
  const id = popupIdCounter++;
  xpPopups.value.push({ id, x, y, amount });

  setTimeout(() => {
    xpPopups.value = xpPopups.value.filter((p) => p.id !== id);
  }, 1000);
};

const getIcon = (habit) => {
  if (habit.icon && habit.icon !== "mdi-circle") return habit.icon;

  const title = habit.title.toLowerCase();
  if (title.includes("water")) return "mdi-water";
  if (title.includes("run") || title.includes("walk")) return "mdi-run";
  if (title.includes("read")) return "mdi-book-open-variant";
  if (title.includes("meditat")) return "mdi-meditation";
  if (title.includes("sleep")) return "mdi-bed";
  if (title.includes("code")) return "mdi-code-tags";
  return "mdi-checkbox-marked-circle";
};

const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

const goToToday = () => {
  const today = new Date();
  currentMonth.value = today.getMonth();
  currentYear.value = today.getFullYear();
};

const openDayDetail = (day) => {
  if (!day.date) return;

  selectedDate.value = day.date;
  const dateTimestamp = new Date(day.date).setHours(0, 0, 0, 0);

  // Get habits that were active on this date
  const activeHabits = habitStore.habits
    .filter((habit) => {
      const createdAt = new Date(habit.createdAt).setHours(0, 0, 0, 0);
      return createdAt <= dateTimestamp;
    })
    .map((habit) => ({
      ...habit,
      completedOnDate: isCompletedOnDate(habit, day.date),
    }));

  selectedDayData.value = {
    date: day.date,
    habits: activeHabits,
    status: day.status,
  };

  showDayDetailDialog.value = true;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const isToday = (date) => {
  if (!date) return false;
  const today = new Date().setHours(0, 0, 0, 0);
  const checkDate = new Date(date).setHours(0, 0, 0, 0);
  return today === checkDate;
};
</script>

<template>
  <v-container fluid class="pa-6 bg-background h-100 position-relative">
    <!-- XP Popups -->
    <div
      v-for="popup in xpPopups"
      :key="popup.id"
      class="xp-popup"
      :style="{ left: popup.x + 'px', top: popup.y + 'px' }"
    >
      <img src="/icons/3d/coin.png" class="xp-coin-icon" alt="XP coin" />
      <span class="xp-amount">+{{ popup.amount }} XP</span>
    </div>

    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-8">
      <div>
        <h1 class="text-h4 font-weight-bold mb-1">Kebiasaan Saya</h1>
        <p class="text-body-1 text-medium-emphasis">
          Bangun rutinitas, raih impianmu.
        </p>
      </div>
      <div class="d-flex align-center gap-3">
        <!-- View Toggle -->
        <v-btn-toggle
          v-model="viewMode"
          density="compact"
          mandatory
          rounded="xl"
          color="primary"
          class="mr-4"
        >
          <v-btn
            value="list"
            icon="mdi-format-list-bulleted"
            size="small"
          ></v-btn>
          <v-btn
            value="calendar"
            icon="mdi-calendar-month"
            size="small"
          ></v-btn>
        </v-btn-toggle>

        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          height="48"
          rounded="xl"
          elevation="4"
          class="font-weight-bold px-6"
          @click="showAddDialog = true"
        >
          Kebiasaan Baru
        </v-btn>
      </div>
    </div>

    <v-row>
      <!-- LIST VIEW -->
      <v-col v-if="viewMode === 'list'" cols="12" lg="8">
        <!-- Search, Filter, Sort Controls -->
        <v-card class="ocean-card pa-4 mb-4" elevation="0">
          <v-row align="center" dense>
            <!-- Search -->
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="searchQuery"
                prepend-inner-icon="mdi-magnify"
                placeholder="Cari kebiasaan..."
                variant="outlined"
                density="compact"
                hide-details
                clearable
              ></v-text-field>
            </v-col>

            <!-- Sort -->
            <v-col cols="12" sm="6">
              <v-select
                v-model="sortBy"
                :items="[
                  { value: 'newest', title: 'Terbaru' },
                  { value: 'category', title: 'Kategori' },
                  { value: 'xp', title: 'XP Terbesar' },
                  { value: 'mostMissed', title: 'Paling Sering Terlewat' },
                ]"
                prepend-inner-icon="mdi-sort"
                label="Urutkan"
                variant="outlined"
                density="compact"
                hide-details
              ></v-select>
            </v-col>

            <!-- Frequency Filter Chips -->
            <v-col cols="12" class="mt-2">
              <div class="d-flex gap-2">
                <v-chip
                  :variant="filterFrequency === 'All' ? 'flat' : 'outlined'"
                  :color="filterFrequency === 'All' ? 'primary' : 'default'"
                  size="small"
                  @click="filterFrequency = 'All'"
                  class="font-weight-bold"
                >
                  Semua
                </v-chip>
                <v-chip
                  :variant="filterFrequency === 'Daily' ? 'flat' : 'outlined'"
                  :color="filterFrequency === 'Daily' ? 'primary' : 'default'"
                  size="small"
                  @click="filterFrequency = 'Daily'"
                  class="font-weight-bold"
                >
                  Harian
                </v-chip>
                <v-chip
                  :variant="filterFrequency === 'Weekly' ? 'flat' : 'outlined'"
                  :color="filterFrequency === 'Weekly' ? 'primary' : 'default'"
                  size="small"
                  @click="filterFrequency = 'Weekly'"
                  class="font-weight-bold"
                >
                  Mingguan
                </v-chip>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <v-row>
          <v-col
            v-for="habit in filteredAndSortedHabits"
            :key="habit.id"
            cols="12"
            sm="6"
            md="6"
          >
            <v-card
              class="ocean-card pa-4 h-100 d-flex flex-row align-center habit-card"
              elevation="0"
              :class="{ 'completed-card': isCompletedToday(habit) }"
            >
              <!-- Delete Button -->
              <div class="position-absolute top-0 right-0 ma-2 z-10">
                <v-btn
                  icon="mdi-delete-outline"
                  variant="text"
                  density="compact"
                  color="medium-emphasis"
                  size="small"
                  class="delete-btn"
                  @click.stop="confirmDelete(habit)"
                ></v-btn>
              </div>

              <!-- Progress Ring & Icon -->
              <div class="mr-4 relative">
                <v-progress-circular
                  :model-value="calculateCompletionRate(habit)"
                  :size="64"
                  :width="6"
                  :color="getCategoryColor(habit.category)"
                  bg-color="surface-variant"
                  class="habit-progress-ring"
                >
                  <v-avatar
                    :color="
                      isCompletedToday(habit)
                        ? getCategoryColor(habit.category)
                        : 'surface-variant'
                    "
                    size="48"
                    class="transition-colors"
                  >
                    <v-icon
                      :color="
                        isCompletedToday(habit)
                          ? 'white'
                          : getCategoryColor(habit.category)
                      "
                      size="28"
                      :class="{ 'pulse-icon': !isCompletedToday(habit) }"
                    >
                      {{
                        isCompletedToday(habit)
                          ? "mdi-check-bold"
                          : getIcon(habit)
                      }}
                    </v-icon>
                  </v-avatar>
                </v-progress-circular>

                <!-- Streak Badge -->
                <div
                  v-if="getStreakBadge(calculateStreak(habit.completedDates))"
                  class="streak-badge"
                >
                  <v-tooltip location="top">
                    <template v-slot:activator="{ props }">
                      <div
                        v-bind="props"
                        class="streak-badge-circle elevation-2"
                        :style="{
                          backgroundColor: `rgb(var(--v-theme-${
                            getStreakBadge(
                              calculateStreak(habit.completedDates)
                            ).color
                          }))`,
                        }"
                      >
                        <img
                          :src="
                            getStreakBadge(
                              calculateStreak(habit.completedDates)
                            ).image
                          "
                          class="streak-icon-3d"
                          alt="streak badge"
                        />
                      </div>
                    </template>
                    <span>{{
                      getStreakBadge(calculateStreak(habit.completedDates))
                        .label
                    }}</span>
                  </v-tooltip>
                </div>
              </div>

              <!-- Info -->
              <div class="flex-grow-1 mr-4 overflow-hidden">
                <div class="d-flex align-center mb-1">
                  <v-chip
                    size="x-small"
                    :color="getCategoryColor(habit.category)"
                    variant="tonal"
                    class="font-weight-bold mr-2 text-uppercase tracking-wide"
                    style="font-size: 10px; height: 20px"
                  >
                    {{ habit.category || "General" }}
                  </v-chip>
                  <div
                    class="text-caption text-medium-emphasis d-flex align-center"
                  >
                    <v-icon size="12" class="mr-1" color="warning"
                      >mdi-fire</v-icon
                    >
                    <span class="font-weight-bold"
                      >{{ calculateStreak(habit.completedDates) }} Hari</span
                    >
                  </div>
                </div>

                <h3
                  class="text-h6 font-weight-bold text-truncate mb-0 leading-tight"
                >
                  {{ habit.title }}
                </h3>
                <p class="text-caption text-medium-emphasis text-truncate">
                  {{ habit.description || "Konsistensi adalah kunci!" }}
                </p>
              </div>

              <!-- Action Button -->
              <div>
                <v-btn
                  icon
                  :color="
                    isCompletedToday(habit) ? 'success' : 'surface-variant'
                  "
                  variant="flat"
                  size="large"
                  class="action-btn"
                  :class="{ 'completed-btn': isCompletedToday(habit) }"
                  @click="(e) => handleCompleteHabit(habit, e)"
                  :disabled="isCompletedToday(habit)"
                >
                  <v-icon
                    size="28"
                    :color="
                      isCompletedToday(habit) ? 'white' : 'medium-emphasis'
                    "
                  >
                    {{
                      isCompletedToday(habit) ? "mdi-check-all" : "mdi-check"
                    }}
                  </v-icon>
                </v-btn>
              </div>
            </v-card>
          </v-col>

          <!-- Empty State -->
          <v-col v-if="filteredAndSortedHabits.length === 0" cols="12">
            <v-card
              class="ocean-card pa-12 text-center bg-surface-soft border-dashed"
              elevation="0"
            >
              <div class="mb-6 relative d-inline-block">
                <div
                  class="absolute-circle pulse-animation"
                  style="
                    background: rgba(var(--v-theme-primary), 0.1);
                    width: 120px;
                    height: 120px;
                    top: -20px;
                    left: -20px;
                  "
                ></div>
                <v-icon size="80" color="primary" class="relative z-10">
                  {{
                    habitStore.habits.length === 0
                      ? "mdi-rocket-launch-outline"
                      : "mdi-magnify"
                  }}
                </v-icon>
              </div>
              <h3 class="text-h5 font-weight-bold mb-2 text-on-surface">
                {{
                  habitStore.habits.length === 0
                    ? "Mulai Perjalanan Anda"
                    : "Tidak Ada Hasil"
                }}
              </h3>
              <p class="text-body-1 text-medium-emphasis mb-8 max-w-md mx-auto">
                {{
                  habitStore.habits.length === 0
                    ? '"Kita adalah apa yang kita lakukan berulang kali. Keunggulan, oleh karena itu, bukanlah tindakan, tetapi kebiasaan."'
                    : "Tidak ada kebiasaan yang cocok dengan pencarian atau filter Anda. Coba ubah kriteria pencarian."
                }}
              </p>
              <v-btn
                v-if="habitStore.habits.length === 0"
                color="primary"
                prepend-icon="mdi-plus"
                rounded="xl"
                size="large"
                elevation="4"
                @click="showAddDialog = true"
                class="px-8"
              >
                Buat Kebiasaan Pertama
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <!-- CALENDAR VIEW -->
      <v-col v-else cols="12" lg="8">
        <v-card class="ocean-card pa-6" elevation="0">
          <!-- Calendar Header -->
          <div class="d-flex justify-space-between align-center mb-6">
            <h2 class="text-h5 font-weight-bold">{{ monthName }}</h2>
            <div class="d-flex gap-2">
              <v-btn
                icon="mdi-chevron-left"
                variant="text"
                @click="previousMonth"
              ></v-btn>
              <v-btn
                variant="outlined"
                rounded="pill"
                @click="goToToday"
                size="small"
                >Hari Ini</v-btn
              >
              <v-btn
                icon="mdi-chevron-right"
                variant="text"
                @click="nextMonth"
              ></v-btn>
            </div>
          </div>

          <!-- Weekday Headers -->
          <div class="calendar-grid mb-2">
            <div
              v-for="day in ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']"
              :key="day"
              class="text-center text-caption font-weight-bold text-medium-emphasis py-2"
            >
              {{ day }}
            </div>
          </div>

          <!-- Calendar Days -->
          <div class="calendar-grid">
            <div
              v-for="(day, index) in calendarDays"
              :key="index"
              class="calendar-day"
              :class="{
                'is-today': isToday(day.date),
                'is-empty': !day.date,
                [`status-${day.status}`]: day.date,
              }"
              @click="day.date && openDayDetail(day)"
            >
              <div v-if="day.date" class="day-content">
                <span class="day-number">{{ day.day }}</span>
                <div
                  class="status-indicator"
                  :class="`bg-${getDayStatusColor(day.status)}`"
                ></div>
              </div>
            </div>
          </div>

          <!-- Legend -->
          <div class="d-flex justify-center gap-6 mt-6">
            <div class="d-flex align-center gap-2">
              <div class="legend-box bg-success"></div>
              <span class="text-caption">Sempurna</span>
            </div>
            <div class="d-flex align-center gap-2">
              <div class="legend-box bg-warning"></div>
              <span class="text-caption">Sebagian</span>
            </div>
            <div class="d-flex align-center gap-2">
              <div class="legend-box bg-error"></div>
              <span class="text-caption">Terlewat</span>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Right Column: Stats Overview -->
      <v-col cols="12" lg="4">
        <v-card
          class="ocean-card pa-6 mb-4 bg-surface-soft sticky-top"
          style="top: 24px"
          elevation="0"
        >
          <!-- Level Progress -->
          <div class="mb-6">
            <div class="d-flex justify-space-between align-center mb-2">
              <div class="text-subtitle-1 font-weight-bold">
                Level {{ userStore.level }}
              </div>
              <div class="text-caption font-weight-bold text-primary">
                {{ userStore.xp }} / {{ userStore.xpToNextLevel }} XP
              </div>
            </div>
            <v-progress-linear
              :model-value="(userStore.xp / userStore.xpToNextLevel) * 100"
              color="primary"
              height="12"
              rounded
              bg-color="surface-variant"
              striped
            ></v-progress-linear>
            <div class="text-caption text-medium-emphasis mt-1 text-right">
              {{ userStore.xpToNextLevel - userStore.xp }} XP lagi ke Level
              {{ userStore.level + 1 }}
            </div>
          </div>

          <h3 class="text-h6 font-weight-bold mb-6 d-flex align-center">
            <v-icon
              icon="mdi-chart-donut"
              class="mr-2"
              color="primary"
            ></v-icon>
            Ringkasan Hari Ini
          </h3>

          <div class="d-flex flex-column gap-6">
            <!-- Total Habits -->
            <div
              class="d-flex align-center justify-space-between p-3 rounded-xl bg-surface border-thin"
            >
              <div class="d-flex align-center">
                <v-avatar color="primary" variant="tonal" class="mr-3">
                  <v-icon>mdi-format-list-checks</v-icon>
                </v-avatar>
                <div>
                  <div
                    class="text-caption text-medium-emphasis font-weight-bold"
                  >
                    TOTAL KEBIASAAN
                  </div>
                  <div class="text-h6 font-weight-black">
                    {{ habitStore.habits.length }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Completed Today -->
            <div
              class="d-flex align-center justify-space-between p-3 rounded-xl bg-surface border-thin"
            >
              <div class="d-flex align-center">
                <v-avatar color="success" variant="tonal" class="mr-3">
                  <v-icon>mdi-check-circle-outline</v-icon>
                </v-avatar>
                <div>
                  <div
                    class="text-caption text-medium-emphasis font-weight-bold"
                  >
                    SELESAI HARI INI
                  </div>
                  <div class="text-h6 font-weight-black">
                    {{ habitStore.habits.filter(isCompletedToday).length }}
                  </div>
                </div>
              </div>
              <v-progress-circular
                :model-value="
                  (habitStore.habits.filter(isCompletedToday).length /
                    (habitStore.habits.length || 1)) *
                  100
                "
                color="success"
                size="40"
                width="4"
              >
                <span class="text-caption font-weight-bold"
                  >{{
                    Math.round(
                      (habitStore.habits.filter(isCompletedToday).length /
                        (habitStore.habits.length || 1)) *
                        100
                    )
                  }}%</span
                >
              </v-progress-circular>
            </div>

            <!-- Quote Card -->
            <div
              class="quote-box pa-4 rounded-xl bg-primary-lighten-5 mt-2 border-dashed-primary"
            >
              <v-icon
                icon="mdi-format-quote-open"
                color="primary"
                class="mb-2 opacity-50"
              ></v-icon>
              <p
                class="text-body-2 font-italic font-weight-medium text-primary-darken-1"
              >
                "Motivasi adalah apa yang membuatmu memulai. Kebiasaan adalah
                apa yang membuatmu terus berjalan."
              </p>
              <div
                class="text-caption text-right mt-2 font-weight-bold text-primary opacity-70"
              >
                - Jim Ryun
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add Habit Dialog -->
    <v-dialog
      v-model="showAddDialog"
      max-width="500"
      scrollable
      transition="dialog-bottom-transition"
    >
      <v-card class="ocean-card pa-0 overflow-hidden" max-height="80vh">
        <div class="pa-6 bg-primary text-white flex-grow-0">
          <h2 class="text-h5 font-weight-bold mb-1">Kebiasaan Baru</h2>
          <p class="text-body-2 opacity-90">
            Mulai langkah kecil untuk perubahan besar.
          </p>
        </div>

        <v-card-text class="pa-6 pt-8 overflow-y-auto">
          <v-text-field
            v-model="newHabit.title"
            label="Nama Kebiasaan"
            placeholder="Contoh: Minum Air, Lari Pagi"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            prepend-inner-icon="mdi-pencil"
          ></v-text-field>

          <v-select
            v-model="newHabit.category"
            :items="categories"
            item-title="title"
            item-value="value"
            label="Kategori"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            prepend-inner-icon="mdi-shape"
          >
            <template v-slot:selection="{ item }">
              <v-chip
                size="small"
                :color="item.raw.color"
                class="font-weight-bold"
                label
              >
                <v-icon start size="small" :icon="item.raw.icon"></v-icon>
                {{ item.title }}
              </v-chip>
            </template>
          </v-select>

          <v-textarea
            v-model="newHabit.description"
            label="Deskripsi (Opsional)"
            placeholder="Alasan kuat mengapa Anda ingin membangun kebiasaan ini..."
            variant="outlined"
            rows="2"
            class="mb-4"
            prepend-inner-icon="mdi-text"
          ></v-textarea>

          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model.number="newHabit.xp"
                label="Nilai XP"
                type="number"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-star"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="newHabit.frequency"
                :items="frequencies"
                label="Frekuensi"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-calendar-sync"
              ></v-select>
            </v-col>
          </v-row>

          <div
            class="text-subtitle-2 font-weight-bold mb-3 text-medium-emphasis"
          >
            Pilih Ikon
          </div>
          <v-sheet
            class="pa-2 bg-surface-variant rounded-lg border-thin overflow-y-auto"
            max-height="150"
          >
            <v-row dense>
              <v-col v-for="icon in icons" :key="icon" cols="auto">
                <v-btn
                  icon
                  variant="text"
                  :color="
                    newHabit.icon === icon ? 'primary' : 'medium-emphasis'
                  "
                  :class="{ 'bg-white elevation-1': newHabit.icon === icon }"
                  @click="newHabit.icon = icon"
                  size="small"
                >
                  <v-icon>{{ icon }}</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-sheet>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4 bg-surface-soft flex-grow-0">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            color="medium-emphasis"
            @click="showAddDialog = false"
            class="px-4"
            >Batal</v-btn
          >
          <v-btn
            color="primary"
            variant="flat"
            rounded="pill"
            class="px-6 font-weight-bold"
            elevation="2"
            @click="handleAddHabit"
          >
            Buat Kebiasaan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card class="ocean-card pa-4">
        <v-card-title class="text-h6 font-weight-bold"
          >Hapus Kebiasaan?</v-card-title
        >
        <v-card-text class="text-body-2 text-medium-emphasis">
          Apakah Anda yakin ingin menghapus kebiasaan
          <strong>{{ habitToDelete?.title }}</strong
          >? Tindakan ini tidak dapat dibatalkan.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            color="medium-emphasis"
            @click="showDeleteDialog = false"
            >Batal</v-btn
          >
          <v-btn color="error" variant="flat" @click="handleDeleteHabit"
            >Hapus</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Day Detail Dialog -->
    <v-dialog v-model="showDayDetailDialog" max-width="600">
      <v-card class="ocean-card pa-0" v-if="selectedDayData">
        <div class="pa-6 bg-gradient text-white">
          <h2 class="text-h5 font-weight-bold mb-1">
            {{ formatDate(selectedDayData.date) }}
          </h2>
          <p class="text-body-2 opacity-90">
            {{ selectedDayData.habits.filter((h) => h.completedOnDate).length }}
            dari {{ selectedDayData.habits.length }} kebiasaan selesai
          </p>
        </div>

        <v-card-text class="pa-6">
          <v-list
            v-if="selectedDayData.habits.length > 0"
            class="bg-transparent"
          >
            <v-list-item
              v-for="habit in selectedDayData.habits"
              :key="habit.id"
              class="px-0 mb-2 rounded-xl"
              :class="{ 'bg-success-lighten-5': habit.completedOnDate }"
            >
              <template v-slot:prepend>
                <v-avatar
                  :color="getCategoryColor(habit.category)"
                  size="40"
                  class="mr-3"
                >
                  <v-icon
                    :color="
                      habit.completedOnDate
                        ? 'white'
                        : getCategoryColor(habit.category)
                    "
                    size="20"
                  >
                    {{
                      habit.completedOnDate ? "mdi-check-bold" : getIcon(habit)
                    }}
                  </v-icon>
                </v-avatar>
              </template>

              <v-list-item-title class="font-weight-bold">{{
                habit.title
              }}</v-list-item-title>
              <v-list-item-subtitle>{{ habit.category }}</v-list-item-subtitle>

              <template v-slot:append>
                <v-chip
                  :color="habit.completedOnDate ? 'success' : 'error'"
                  size="small"
                  variant="tonal"
                  class="font-weight-bold"
                >
                  {{ habit.completedOnDate ? "Selesai" : "Terlewat" }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>

          <div v-else class="text-center py-8 text-medium-emphasis">
            <v-icon size="64" color="medium-emphasis"
              >mdi-calendar-blank</v-icon
            >
            <p class="mt-4">Tidak ada kebiasaan aktif pada tanggal ini.</p>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showDayDetailDialog = false"
            >Tutup</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.ocean-card {
  background: rgb(var(--v-theme-surface));
  border-radius: 24px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.habit-card {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.habit-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.habit-card.completed-card {
  background: linear-gradient(
    145deg,
    rgb(var(--v-theme-surface)),
    rgba(var(--v-theme-success), 0.05)
  );
  border-color: rgba(var(--v-theme-success), 0.2);
}

.action-btn {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.action-btn:hover {
  transform: scale(1.1);
}

.action-btn:active {
  transform: scale(0.95);
}

.completed-btn {
  animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.pulse-icon {
  animation: pulse-soft 2s infinite;
}

.streak-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  z-index: 10;
  animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.streak-badge-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.streak-icon-3d {
  width: 24px;
  height: 24px;
  object-fit: contain;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.xp-popup {
  position: fixed;
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgb(var(--v-theme-warning));
  font-weight: 900;
  font-size: 1.2rem;
  pointer-events: none;
  z-index: 9999;
  animation: float-up 1s ease-out forwards;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.xp-coin-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  animation: coin-spin 1s ease-out;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.xp-amount {
  display: inline-block;
}

.delete-btn {
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.habit-card:hover .delete-btn {
  opacity: 1;
}

/* Calendar Styles */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.calendar-day {
  aspect-ratio: 1;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgb(var(--v-theme-surface-variant));
  position: relative;
}

.calendar-day.is-empty {
  background: transparent;
  cursor: default;
}

.calendar-day:not(.is-empty):hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.calendar-day.is-today {
  border: 2px solid rgb(var(--v-theme-primary));
  font-weight: bold;
}

.day-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.day-number {
  font-size: 0.875rem;
  font-weight: 500;
}

.status-indicator {
  position: absolute;
  bottom: 4px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.calendar-day.status-complete {
  background: rgba(var(--v-theme-success), 0.1);
}

.calendar-day.status-partial {
  background: rgba(var(--v-theme-warning), 0.1);
}

.calendar-day.status-missed {
  background: rgba(var(--v-theme-error), 0.1);
}

.legend-box {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.bg-gradient {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-secondary)) 100%
  );
}

@keyframes float-up {
  0% {
    transform: translate(-50%, 0) scale(0.5);
    opacity: 0;
  }
  20% {
    transform: translate(-50%, -20px) scale(1.2);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50px) scale(1);
    opacity: 0;
  }
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes pop {
  0% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes coin-spin {
  0% {
    transform: rotateY(0deg) scale(0.5);
    opacity: 0;
  }
  50% {
    transform: rotateY(180deg) scale(1.2);
    opacity: 1;
  }
  100% {
    transform: rotateY(360deg) scale(1);
    opacity: 1;
  }
}

@keyframes pulse-soft {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.bg-surface-soft {
  background-color: rgb(var(--v-theme-surface-soft)) !important;
}

.border-thin {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.border-dashed {
  border: 2px dashed rgba(var(--v-theme-on-surface), 0.1);
}

.border-dashed-primary {
  border: 1px dashed rgba(var(--v-theme-primary), 0.3);
}

.sticky-top {
  position: sticky;
  top: 24px;
}

/* Fix for unwanted browser focus outlines */
:deep(input:focus),
:deep(textarea:focus),
:deep(select:focus),
:deep(.v-field__input:focus) {
  outline: none !important;
  box-shadow: none !important;
}
</style>
