<template>
  <v-container fluid class="dashboard-container pa-4 pa-md-8">
    <!-- Row 1: Hero & Streak (Bento Top) -->
    <v-row>
      <!-- Hero Section (Welcome + Daily Progress) -->
      <v-col cols="12" md="8">
        <v-card
          class="ocean-card hero-card h-100 pa-6 pa-md-8 d-flex flex-column justify-center relative overflow-hidden"
          elevation="0"
        >
          <!-- Background Decoration -->
          <div class="hero-bg-circle"></div>

          <div
            class="d-flex flex-column flex-md-row align-center justify-space-between z-index-1"
          >
            <div class="mb-6 mb-md-0 text-center text-md-left">
              <div
                class="d-flex align-center justify-center justify-md-start mb-3"
              >
                <v-chip
                  size="small"
                  color="surface-soft"
                  variant="flat"
                  class="font-weight-bold text-primary px-3 elevation-1"
                >
                  <v-icon start icon="mdi-calendar-today" size="small"></v-icon>
                  {{ currentDate }}
                </v-chip>
              </div>
              <h1
                class="text-h3 font-weight-black mb-3 text-on-background tracking-tight"
              >
                Selamat {{ timeOfDay }}, <br />
                <span class="text-primary">{{ userName }}!</span>
              </h1>
              <p
                class="text-body-1 text-medium-emphasis font-weight-medium mb-6"
                style="max-width: 450px; line-height: 1.6"
              >
                "{{ quoteOfTheDay }}"
              </p>

              <div class="d-flex gap-3 justify-center justify-md-start">
                <v-btn
                  color="primary"
                  elevation="2"
                  rounded="xl"
                  size="large"
                  prepend-icon="mdi-plus"
                  class="px-8 font-weight-bold btn-hover"
                  @click="addNewHabit"
                >
                  Kebiasaan Baru
                </v-btn>
                <v-btn
                  color="surface"
                  variant="flat"
                  rounded="xl"
                  size="large"
                  prepend-icon="mdi-bullseye-arrow"
                  class="px-8 font-weight-bold text-medium-emphasis btn-hover border-thin"
                  @click="$router.push('/focus')"
                >
                  Mode Fokus
                </v-btn>
              </div>
            </div>

            <!-- Daily Progress Circle -->
            <div class="progress-circle-container mx-auto mx-md-0 pl-md-8">
              <v-progress-circular
                :model-value="dailyProgress"
                :size="180"
                :width="18"
                color="secondary"
                bg-color="rgba(var(--v-theme-on-surface), 0.05)"
                class="drop-shadow-lg"
              >
                <div class="text-center">
                  <div class="text-h3 font-weight-black text-on-background">
                    {{ Math.round(dailyProgress) }}%
                  </div>
                  <div
                    class="text-caption font-weight-bold text-medium-emphasis text-uppercase tracking-wide"
                  >
                    Selesai
                  </div>
                </div>
              </v-progress-circular>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Streak Card with Trend Bar -->
      <v-col cols="12" md="4">
        <v-card
          class="ocean-card streak-card h-100 pa-6 pa-md-8 d-flex flex-column align-center justify-center text-center"
          elevation="0"
        >
          <div class="streak-flame mb-4 pulse-animation">
            <div class="flame-bg"></div>
            <v-icon
              icon="mdi-fire"
              size="64"
              color="white"
              class="relative z-10"
            ></v-icon>
          </div>
          <div
            class="text-display-1 font-weight-black text-white mb-1 drop-shadow"
          >
            {{ userStore.streak }}
          </div>
          <div
            class="text-h6 text-white font-weight-bold opacity-90 tracking-wide mb-6"
          >
            STREAK HARI
          </div>

          <!-- Mini Bar Chart for Streak History -->
          <div
            class="d-flex align-end justify-center gap-2 h-100 w-100 px-4"
            style="height: 60px"
          >
            <div
              v-for="(day, index) in streakHistory"
              :key="index"
              class="d-flex flex-column align-center flex-grow-1"
            >
              <div
                class="streak-bar rounded-t-sm transition-all"
                :style="{
                  height: day.active ? '100%' : '30%',
                  opacity: day.active ? 1 : 0.4,
                  backgroundColor: 'white',
                }"
              ></div>
              <div
                class="text-caption text-white mt-1 font-weight-bold opacity-80"
                style="font-size: 10px"
              >
                {{ day.label }}
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Row 2: Widgets (Habits, RPG, Finance/Mood) -->
    <v-row class="mt-2">
      <!-- Today's Tasks Widget -->
      <v-col cols="12" md="4">
        <v-card
          class="ocean-card h-100 d-flex flex-column bg-surface-soft"
          elevation="0"
        >
          <div class="pa-5 border-b d-flex justify-space-between align-center">
            <h3
              class="text-h6 font-weight-bold d-flex align-center text-on-surface"
            >
              <v-icon
                icon="mdi-checkbox-marked-circle"
                color="secondary"
                class="mr-3"
              ></v-icon>
              Fokus Hari Ini
            </h3>
            <v-btn
              icon="mdi-chevron-right"
              variant="text"
              size="small"
              color="primary"
              @click="$router.push('/todo')"
            ></v-btn>
          </div>

          <v-list
            class="flex-grow-1 bg-transparent pa-3"
            v-if="todoStore.todayTasks.length > 0"
          >
            <transition-group name="list" tag="div">
              <v-list-item
                v-for="task in todoStore.todayTasks"
                :key="task.id"
                :value="task.id"
                rounded="lg"
                class="mb-2 task-item py-3"
                @click="todoStore.toggleTask(task.id)"
                elevation="0"
              >
                <template v-slot:prepend>
                  <div class="checkbox-wrapper mr-4">
                    <v-icon
                      :icon="
                        task.completed
                          ? 'mdi-check-circle'
                          : 'mdi-circle-outline'
                      "
                      :color="task.completed ? 'secondary' : 'medium-emphasis'"
                      size="28"
                      class="transition-all scale-on-active"
                    ></v-icon>
                  </div>
                </template>
                <v-list-item-title
                  class="font-weight-bold text-body-1"
                  :class="{
                    'text-decoration-line-through text-medium-emphasis':
                      task.completed,
                  }"
                >
                  {{ task.title }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption mt-1">
                  <v-chip
                    size="x-small"
                    :color="getPriorityColor(task.priority)"
                    variant="tonal"
                    class="mr-2"
                  >
                    {{ task.priority }}
                  </v-chip>
                  <span
                    v-if="isOverdue(task.dueDate)"
                    class="text-error font-weight-bold"
                  >
                    <v-icon icon="mdi-alert-circle" size="x-small"></v-icon>
                    Terlambat
                  </span>
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-chip
                    size="x-small"
                    color="accent"
                    variant="tonal"
                    class="font-weight-bold"
                  >
                    +{{ getTaskXP(task.priority) }} XP
                  </v-chip>
                </template>
              </v-list-item>
            </transition-group>
          </v-list>

          <div
            v-else
            class="d-flex flex-column align-center justify-center flex-grow-1 pa-6 text-center text-medium-emphasis"
          >
            <v-icon
              icon="mdi-check-all"
              size="64"
              class="mb-4 opacity-30"
            ></v-icon>
            <p class="text-h6 font-weight-medium mb-1">Semua selesai!</p>
            <p class="text-body-2 mb-4">
              Tidak ada tugas untuk hari ini. Bagus sekali!
            </p>
            <v-btn
              variant="tonal"
              color="primary"
              rounded="pill"
              size="small"
              @click="$router.push('/todo')"
            >
              Lihat Semua Tugas
            </v-btn>
          </div>
        </v-card>
      </v-col>

      <!-- RPG Stats Widget with Circular Progress -->
      <v-col cols="12" md="4">
        <v-card
          class="ocean-card h-100 pa-0 overflow-hidden d-flex flex-column"
          elevation="0"
        >
          <div
            class="rpg-header pa-6 text-white relative overflow-hidden flex-grow-0"
          >
            <!-- Decorative circles -->
            <div class="absolute-circle circle-1"></div>
            <div class="absolute-circle circle-2"></div>

            <div
              class="d-flex justify-space-between align-center relative z-10"
            >
              <div>
                <div class="text-overline font-weight-bold opacity-80 mb-1">
                  STATISTIK KARAKTER
                </div>
                <div class="text-h4 font-weight-black mb-1">
                  Level {{ userStore.level }}
                </div>
                <v-chip
                  size="x-small"
                  color="white"
                  variant="outlined"
                  class="font-weight-bold"
                  >Master Produktivitas</v-chip
                >
              </div>

              <!-- Circular XP Progress -->
              <div
                class="relative d-flex align-center justify-center hover-scale"
              >
                <v-progress-circular
                  :model-value="(userStore.xp / userStore.xpToNextLevel) * 100"
                  :size="80"
                  :width="8"
                  color="accent"
                  bg-color="rgba(255,255,255,0.2)"
                >
                  <v-avatar size="64" class="border-2-white bg-surface">
                    <ImageLoader
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4"
                      alt="User Avatar"
                      placeholder-height="64px"
                      img-class="rounded-circle"
                    />
                  </v-avatar>
                </v-progress-circular>
                <div class="xp-badge">XP</div>
              </div>
            </div>

            <!-- Enhanced XP Progress Bar -->
            <div class="mt-4 px-2">
              <div class="d-flex justify-space-between align-items-center mb-2">
                <div
                  class="text-caption font-weight-bold text-white opacity-80"
                >
                  XP PROGRESS
                </div>
                <div class="text-caption font-weight-bold text-white">
                  {{ userStore.xp }} / {{ userStore.xpToNextLevel }}
                </div>
              </div>
              <v-progress-linear
                :model-value="xpProgress"
                height="8"
                rounded
                bg-color="rgba(255, 255, 255, 0.2)"
                color="accent"
                :class="{ 'xp-glow': isCloseToLevelUp }"
              ></v-progress-linear>
              <div
                v-if="isCloseToLevelUp"
                class="text-caption text-center mt-2 text-accent font-weight-bold pulse-text"
              >
                🔥 Hampir Level Up!
              </div>
            </div>
          </div>

          <div class="pa-5 flex-grow-1 bg-surface-soft">
            <v-row dense class="h-100">
              <v-col cols="6">
                <div
                  class="stat-box pa-4 rounded-xl bg-surface h-100 d-flex flex-column justify-center align-center text-center border-thin hover-lift"
                >
                  <v-icon
                    icon="mdi-brain"
                    color="primary"
                    class="mb-2"
                  ></v-icon>
                  <div
                    class="text-caption text-medium-emphasis font-weight-bold"
                  >
                    INTELEK
                  </div>
                  <div class="text-h5 font-weight-black text-on-surface">
                    12
                  </div>
                </div>
              </v-col>
              <v-col cols="6">
                <div
                  class="stat-box pa-4 rounded-xl bg-surface h-100 d-flex flex-column justify-center align-center text-center border-thin hover-lift"
                >
                  <v-icon
                    icon="mdi-arm-flex"
                    color="error"
                    class="mb-2"
                  ></v-icon>
                  <div
                    class="text-caption text-medium-emphasis font-weight-bold"
                  >
                    KEKUATAN
                  </div>
                  <div class="text-h5 font-weight-black text-on-surface">8</div>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>

      <!-- Finance & Mood Split Widget with Sparkline -->
      <v-col cols="12" md="4">
        <div class="d-flex flex-column h-100 gap-4">
          <!-- Finance Mini with Sparkline -->
          <v-card
            class="ocean-card flex-grow-1 pa-5 d-flex flex-column justify-space-between relative overflow-hidden bg-surface-soft"
            elevation="0"
          >
            <div class="d-flex justify-space-between align-start z-10">
              <div class="d-flex align-center">
                <div class="icon-box bg-green-lighten-5 pa-2 rounded-lg mr-3">
                  <v-icon icon="mdi-wallet" color="success" size="24"></v-icon>
                </div>
                <div>
                  <div
                    class="text-caption text-medium-emphasis font-weight-bold"
                  >
                    PENGELUARAN HARIAN
                  </div>
                  <div class="text-h6 font-weight-black text-on-surface">
                    Rp 150.000
                  </div>
                </div>
              </div>
              <v-btn
                icon="mdi-plus"
                size="small"
                variant="flat"
                color="success"
                class="rounded-lg"
              ></v-btn>
            </div>

            <!-- SVG Sparkline -->
            <div class="sparkline-container mt-4">
              <svg
                viewBox="0 0 100 30"
                class="w-100"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,30 L0,20 L10,25 L20,15 L30,22 L40,10 L50,18 L60,5 L70,15 L80,10 L90,20 L100,15 L100,30 Z"
                  fill="rgba(var(--v-theme-success), 0.1)"
                ></path>
                <path
                  d="M0,20 L10,25 L20,15 L30,22 L40,10 L50,18 L60,5 L70,15 L80,10 L90,20 L100,15"
                  fill="none"
                  stroke="rgb(var(--v-theme-success))"
                  stroke-width="2"
                  vector-effect="non-scaling-stroke"
                ></path>
              </svg>
            </div>
          </v-card>

          <!-- Mood Mini -->
          <v-card
            class="ocean-card flex-grow-1 pa-5 bg-surface-soft"
            elevation="0"
          >
            <div class="d-flex justify-space-between align-center mb-4">
              <div class="text-caption text-medium-emphasis font-weight-bold">
                PELACAK MOOD
              </div>
              <v-icon
                icon="mdi-emoticon"
                color="medium-emphasis"
                size="small"
              ></v-icon>
            </div>
            <div class="d-flex justify-space-between px-1">
              <v-btn
                v-for="(emoji, index) in moods"
                :key="index"
                icon
                variant="text"
                size="large"
                :class="{ 'mood-selected': selectedMood === index }"
                @click="selectedMood = index"
                class="mood-btn"
              >
                <span class="text-h4 emoji-text">{{ emoji }}</span>
              </v-btn>
            </div>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <!-- Row 2.5: Calendar & Clock Widgets -->
    <v-row class="mt-2">
      <!-- Calendar Widget -->
      <v-col cols="12" md="6">
        <Suspense>
          <CalendarWidget />
          <template #fallback>
            <SkeletonLoader variant="widget" />
          </template>
        </Suspense>
      </v-col>

      <!-- Clock Widget -->
      <v-col cols="12" md="6">
        <Suspense>
          <ClockWidget />
          <template #fallback>
            <SkeletonLoader variant="widget" />
          </template>
        </Suspense>
      </v-col>
    </v-row>

    <!-- Row 3: Heatmap (Full Width) -->
    <v-row class="mt-2">
      <v-col cols="12">
        <v-card class="ocean-card pa-6 pa-md-8 bg-surface-soft" elevation="0">
          <div class="d-flex justify-space-between align-center mb-6">
            <div>
              <h3 class="text-h6 font-weight-bold text-on-surface">
                Log Aktivitas
              </h3>
              <p class="text-body-2 text-medium-emphasis">
                Konsistensi Anda selama setahun terakhir
              </p>
            </div>
            <v-btn
              variant="text"
              size="small"
              color="primary"
              prepend-icon="mdi-calendar"
              >Lihat Riwayat Lengkap</v-btn
            >
          </div>
          <Suspense>
            <CalendarHeatmap :data="activityData" />
            <template #fallback>
              <SkeletonLoader variant="chart" />
            </template>
          </Suspense>
        </v-card>
      </v-col>
    </v-row>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSnackbar"
      :timeout="2000"
      color="success"
      location="top"
      rounded="pill"
      class="mt-4"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2" icon="mdi-check-circle"></v-icon>
        <span class="font-weight-bold"
          >Kebiasaan Selesai! +{{ lastXpEarned }} XP</span
        >
      </div>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { format } from "date-fns";
import { computed, onMounted, ref, defineAsyncComponent } from "vue";
import { useHabitStore } from "../store/habitStore";
import { useUserStore } from "../store/userStore";
import { useTodoStore } from "../store/todoStore";
import SkeletonLoader from "../components/SkeletonLoader.vue";
import ImageLoader from "../components/ImageLoader.vue";

// Lazy load heavy components
const CalendarHeatmap = defineAsyncComponent(() =>
  import("../components/CalendarHeatmap.vue")
);
const CalendarWidget = defineAsyncComponent(() =>
  import("../components/CalendarWidget.vue")
);
const ClockWidget = defineAsyncComponent(() =>
  import("../components/ClockWidget.vue")
);

const userStore = useUserStore();
const habitStore = useHabitStore();
const todoStore = useTodoStore();

const activityData = ref({});
const userName = ref("User");
const selectedMood = ref(null);
const moods = ["😫", "😕", "😐", "🙂", "🤩"];
const showSnackbar = ref(false);
const lastXpEarned = ref(0);

// Mock Streak History Data
const streakHistory = [
  { label: "S", active: true },
  { label: "S", active: true },
  { label: "R", active: false },
  { label: "K", active: true },
  { label: "J", active: true },
  { label: "S", active: true },
  { label: "M", active: true },
];

const timeOfDay = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return "Pagi";
  if (hour < 18) return "Sore";
  return "Malam";
});

const currentDate = computed(() => {
  return new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
});

const quoteOfTheDay = "Langkah kecil setiap hari membawa perubahan besar.";

// XP Progress
const xpProgress = computed(
  () => (userStore.xp / userStore.xpToNextLevel) * 100
);

const isCloseToLevelUp = computed(() => xpProgress.value > 80);

// Task Helpers
const getTaskXP = (priority) => {
  if (priority === "tinggi") return 50;
  if (priority === "sedang") return 30;
  return 10;
};

const getPriorityColor = (priority) => {
  if (priority === "tinggi") return "error";
  if (priority === "sedang") return "warning";
  return "info";
};

const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
};

// Daily Progress (based on today's tasks)
const dailyProgress = computed(() => {
  const todayTasks = todoStore.todayTasks;
  if (todayTasks.length === 0) return 100; // No tasks = 100% complete
  const completed = todoStore.tasks.filter(
    (t) =>
      t.completed &&
      t.dueDate &&
      new Date(t.dueDate).setHours(0, 0, 0, 0) <=
        new Date().setHours(0, 0, 0, 0)
  ).length;
  return Math.min((completed / todayTasks.length) * 100, 100);
});

// Habit Logic (for reference, will be shown in a separate widget later)
const todayHabits = computed(() => habitStore.habits);

const isHabitCompleted = (habit) => {
  if (!habit.completedDates) return false;
  const today = new Date().setHours(0, 0, 0, 0);
  return habit.completedDates.some(
    (d) => new Date(d).setHours(0, 0, 0, 0) === today
  );
};

const toggleHabit = async (habit) => {
  if (!isHabitCompleted(habit)) {
    await habitStore.completeHabit(habit.id);
    lastXpEarned.value = habit.xp;
    showSnackbar.value = true;

    // Update heatmap
    const today = format(new Date(), "yyyy-MM-dd");
    activityData.value[today] = (activityData.value[today] || 0) + 1;
  }
};

const addNewHabit = () => {
  // Logic to open add habit dialog
  console.log("Add new habit clicked");
};

onMounted(() => {
  // Data is now auto-loaded by persistence plugin
  // userStore.initUser(); // No longer needed

  // Mock Heatmap Data
  activityData.value = {
    [format(new Date(), "yyyy-MM-dd")]: 5,
    [format(new Date(Date.now() - 86400000), "yyyy-MM-dd")]: 3,
  };
});
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-background));
}

.ocean-card {
  background: rgb(var(--v-theme-surface));
  border-radius: 24px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.ocean-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08); /* Soft shadow on hover */
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.bg-surface-soft {
  background-color: rgb(var(--v-theme-surface-soft)) !important;
}

/* Hero Card */
.hero-card {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-surface)) 0%,
    rgba(var(--v-theme-primary), 0.05) 100%
  );
  position: relative;
}

.hero-bg-circle {
  position: absolute;
  top: -80px;
  right: -80px;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(var(--v-theme-secondary), 0.1) 0%,
    transparent 70%
  );
  z-index: 0;
}

.z-index-1 {
  position: relative;
  z-index: 1;
}
.tracking-tight {
  letter-spacing: -0.02em;
}
.tracking-wide {
  letter-spacing: 0.05em;
}

/* Streak Card */
.streak-card {
  background: linear-gradient(
    135deg,
    #ff6b6b 0%,
    #ffa500 100%
  ); /* Harmonized Orange/Gold */
  position: relative;
  overflow: hidden;
  border: none;
}

.streak-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.2;
}

.streak-flame {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.flame-bg {
  position: absolute;
  width: 100px;
  height: 100px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.3) 0%,
    transparent 70%
  );
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.streak-bar {
  width: 8px;
  background-color: white;
  border-radius: 4px;
  transition: all 0.3s ease;
}

/* RPG Widget */
.rpg-header {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  position: relative;
}

.absolute-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}
.circle-1 {
  width: 150px;
  height: 150px;
  top: -50px;
  right: -50px;
}
.circle-2 {
  width: 100px;
  height: 100px;
  bottom: -30px;
  left: -30px;
}

.xp-badge {
  position: absolute;
  bottom: -5px;
  background: rgb(var(--v-theme-accent));
  color: white;
  font-size: 10px;
  font-weight: 900;
  padding: 2px 6px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.border-2-white {
  border: 3px solid white;
}

.hover-scale {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.hover-scale:hover {
  transform: scale(1.1);
}

.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
}

/* Animations */
@keyframes pulse {
  0% {
    transform: scale(0.95);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.7;
  }
}

.pulse-animation {
  animation: pulse 3s infinite ease-in-out;
}

.scale-on-active:active {
  transform: scale(0.9);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
/* Animations */
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}

.pulse-animation {
  animation: pulse 2s ease-in-out infinite;
}

.scale-on-active {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-on-active:active {
  transform: scale(1.2);
}

.hover-lift {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-lift:hover {
  transform: translateY(-4px);
}

.hover-scale {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-scale:hover {
  transform: scale(1.05);
}

/* XP Glow Effect */
.xp-glow {
  filter: drop-shadow(0 0 8px rgb(var(--v-theme-accent)));
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%,
  100% {
    filter: drop-shadow(0 0 8px rgb(var(--v-theme-accent)));
  }
  50% {
    filter: drop-shadow(0 0 16px rgb(var(--v-theme-accent)));
  }
}

.pulse-text {
  animation: pulse-text 1.5s ease-in-out infinite;
}

@keyframes pulse-text {
  0%,
  100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

/* Task Item Styles */
.task-item {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.task-item:hover {
  background: rgba(var(--v-theme-primary), 0.05);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
