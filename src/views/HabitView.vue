<script setup>
import { useHabitStore } from "@/store/habitStore";
import { useUserStore } from "@/store/userStore";
import { onMounted, ref } from "vue";

const habitStore = useHabitStore();
const userStore = useUserStore();

const showAddDialog = ref(false);
const newHabit = ref({
  title: "",
  description: "",
  xp: 10,
  frequency: "Daily",
  icon: "mdi-circle",
});

const frequencies = ["Daily", "Weekly"];
const icons = [
  "mdi-meditation",
  "mdi-run",
  "mdi-book-open-variant",
  "mdi-water",
  "mdi-bed",
  "mdi-code-tags",
  "mdi-dumbbell",
  "mdi-food-apple",
];

// Initialize stores (data is now auto-loaded by persistence plugin)
onMounted(() => {
  // habitStore.initHabits(); // No longer needed
  // userStore.initUser(); // No longer needed
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

const handleAddHabit = async () => {
  if (newHabit.value.title) {
    // Set default icon if not selected or generic
    if (newHabit.value.icon === "mdi-circle") {
      newHabit.value.icon = getIcon(newHabit.value);
    }

    await habitStore.addHabit(newHabit.value);

    // Reset form
    newHabit.value = {
      title: "",
      description: "",
      xp: 10,
      frequency: "Daily",
      icon: "mdi-circle",
    };
    showAddDialog.value = false;
  }
};

const handleCompleteHabit = async (habit) => {
  if (!isCompletedToday(habit)) {
    await habitStore.completeHabit(habit.id);
  }
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
</script>

<template>
  <v-container fluid class="pa-6 bg-background h-100">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-8">
      <h1 class="text-h4 font-weight-bold">Dashboard Kebiasaan Strategis</h1>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        height="44"
        rounded="lg"
        elevation="2"
        @click="showAddDialog = true"
      >
        Kebiasaan Baru
      </v-btn>
    </div>

    <v-row>
      <!-- Habits Grid -->
      <v-col cols="12" lg="8">
        <v-row>
          <v-col
            v-for="habit in habitStore.habits"
            :key="habit.id"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card
              class="ocean-card pa-5 h-100 d-flex flex-column"
              elevation="0"
            >
              <!-- Top Row: Icon & Frequency -->
              <div class="d-flex justify-space-between align-start mb-4">
                <v-avatar
                  color="primary"
                  variant="tonal"
                  rounded="lg"
                  size="56"
                >
                  <v-icon size="32" color="primary">{{
                    getIcon(habit)
                  }}</v-icon>
                </v-avatar>
                <v-chip
                  size="small"
                  color="surface-variant"
                  variant="flat"
                  class="font-weight-bold"
                >
                  {{ habit.frequency || "Daily" }}
                </v-chip>
              </div>

              <!-- Title & Description -->
              <div class="mb-4">
                <div class="text-h6 font-weight-bold mb-1 text-on-surface">
                  {{ habit.title }}
                </div>
                <div class="text-body-2 text-medium-emphasis text-truncate">
                  {{ habit.description || "Terus semangat!" }}
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="mb-4">
                <v-progress-linear
                  :model-value="calculateCompletionRate(habit)"
                  color="secondary"
                  height="8"
                  rounded
                  bg-color="surface-variant"
                  class="mb-2"
                ></v-progress-linear>
                <div class="d-flex justify-space-between text-caption">
                  <span class="font-weight-bold text-medium-emphasis"
                    >{{ calculateCompletionRate(habit) }}% Selesai</span
                  >
                  <span class="text-accent font-weight-bold">
                    <v-icon size="14" color="accent" class="mr-1"
                      >mdi-fire</v-icon
                    >
                    {{ calculateStreak(habit.completedDates) }} hari streak
                  </span>
                </div>
              </div>

              <!-- Stats Grid -->
              <div
                class="d-flex justify-space-between mb-6 text-caption text-medium-emphasis"
              >
                <div>
                  <div class="font-weight-bold text-on-surface">
                    {{ calculateCompletionRate(habit) }}%
                  </div>
                  <div>Tingkat Penyelesaian</div>
                </div>
                <div class="text-right">
                  <div class="font-weight-bold text-on-surface">
                    {{ calculateStreak(habit.completedDates) }} hari
                  </div>
                  <div>Streak Saat Ini</div>
                </div>
              </div>

              <!-- Action Button -->
              <v-btn
                block
                height="48"
                rounded="lg"
                variant="flat"
                :color="isCompletedToday(habit) ? 'success' : 'primary'"
                :disabled="isCompletedToday(habit)"
                @click="handleCompleteHabit(habit)"
                class="mt-auto"
              >
                <v-icon class="mr-2">{{
                  isCompletedToday(habit) ? "mdi-check" : "mdi-plus"
                }}</v-icon>
                {{
                  isCompletedToday(habit)
                    ? "Selesai Hari Ini!"
                    : `+${habit.xp} XP`
                }}
              </v-btn>
            </v-card>
          </v-col>

          <!-- Empty State -->
          <v-col v-if="habitStore.habits.length === 0" cols="12">
            <v-card
              class="ocean-card pa-12 text-center bg-surface-soft"
              elevation="0"
            >
              <v-icon size="80" color="medium-emphasis" class="mb-4"
                >mdi-target</v-icon
              >
              <h3 class="text-h6 font-weight-bold mb-2 text-on-surface">
                Belum Ada Kebiasaan
              </h3>
              <p class="text-body-2 text-medium-emphasis mb-6">
                Mulai bangun kebiasaan baru untuk meningkatkan produktivitas
                Anda
              </p>
              <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                rounded="lg"
                elevation="2"
                @click="showAddDialog = true"
              >
                Buat Kebiasaan Pertama
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <!-- Right Column: Stats Overview -->
      <v-col cols="12" lg="4">
        <v-card class="ocean-card pa-6 mb-4 bg-surface-soft" elevation="0">
          <h3 class="text-h6 font-weight-bold mb-4">Statistik Kebiasaan</h3>
          <div class="d-flex flex-column gap-4">
            <div class="d-flex justify-space-between align-center">
              <span class="text-body-2 text-medium-emphasis"
                >Total Kebiasaan</span
              >
              <span class="text-h5 font-weight-bold text-primary">{{
                habitStore.habits.length
              }}</span>
            </div>
            <v-divider></v-divider>
            <div class="d-flex justify-space-between align-center">
              <span class="text-body-2 text-medium-emphasis"
                >Selesai Hari Ini</span
              >
              <span class="text-h5 font-weight-bold text-success">{{
                habitStore.habits.filter(isCompletedToday).length
              }}</span>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add Habit Dialog -->
    <v-dialog v-model="showAddDialog" max-width="500">
      <v-card class="ocean-card pa-4">
        <v-card-title class="text-h5 font-weight-bold mb-4">
          Kebiasaan Baru
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newHabit.title"
            label="Nama Kebiasaan"
            variant="outlined"
            density="comfortable"
            class="mb-2"
          ></v-text-field>
          <v-textarea
            v-model="newHabit.description"
            label="Deskripsi (Opsional)"
            variant="outlined"
            rows="3"
            class="mb-2"
          ></v-textarea>
          <v-text-field
            v-model.number="newHabit.xp"
            label="Nilai XP"
            type="number"
            variant="outlined"
            density="comfortable"
            class="mb-2"
          ></v-text-field>
          <v-select
            v-model="newHabit.frequency"
            :items="frequencies"
            label="Frekuensi"
            variant="outlined"
            density="comfortable"
            class="mb-2"
          ></v-select>
          <v-select
            v-model="newHabit.icon"
            :items="icons"
            label="Ikon"
            variant="outlined"
            density="comfortable"
          >
            <template v-slot:selection="{ item }">
              <v-icon :icon="item.value" class="mr-2"></v-icon>
              <span>{{ item.value }}</span>
            </template>
            <template v-slot:item="{ item, props }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-icon :icon="item.value"></v-icon>
                </template>
              </v-list-item>
            </template>
          </v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showAddDialog = false">Batal</v-btn>
          <v-btn color="primary" variant="flat" @click="handleAddHabit">
            Buat Kebiasaan
          </v-btn>
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

.ocean-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.bg-surface-soft {
  background-color: rgb(var(--v-theme-surface-soft)) !important;
}
</style>
