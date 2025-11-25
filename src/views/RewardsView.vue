<template>
  <div class="view-container py-6">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-h3 font-weight-black mb-2">
        <v-icon
          icon="mdi-trophy"
          color="accent"
          size="36"
          class="mr-2"
        ></v-icon>
        Hadiah & Pencapaian
      </h1>
      <p class="text-body-1 text-medium-emphasis">
        Kumpulkan achievements dan badges dengan menyelesaikan tantanganmu
      </p>
    </div>

    <!-- Stats Overview -->
    <v-row class="mb-6">
      <v-col cols="6" md="3">
        <v-card class="stat-card text-center pa-4" elevation="2">
          <v-icon
            icon="mdi-star-four-points"
            color="primary"
            size="32"
            class="mb-2"
          ></v-icon>
          <div class="text-h4 font-weight-bold text-primary">
            {{ userStore.level }}
          </div>
          <div class="text-caption text-medium-emphasis">Level</div>
        </v-card>
      </v-col>
      <v-col cols="6" md="3">
        <v-card class="stat-card text-center pa-4" elevation="2">
          <v-icon
            icon="mdi-lightning-bolt"
            color="accent"
            size="32"
            class="mb-2"
          ></v-icon>
          <div class="text-h4 font-weight-bold text-accent">
            {{ userStore.xp }}
          </div>
          <div class="text-caption text-medium-emphasis">Total XP</div>
        </v-card>
      </v-col>
      <v-col cols="6" md="3">
        <v-card class="stat-card text-center pa-4" elevation="2">
          <v-icon
            icon="mdi-trophy-variant"
            color="warning"
            size="32"
            class="mb-2"
          ></v-icon>
          <div class="text-h4 font-weight-bold text-warning">
            {{ unlockedAchievements.length }}
          </div>
          <div class="text-caption text-medium-emphasis">Achievements</div>
        </v-card>
      </v-col>
      <v-col cols="6" md="3">
        <v-card class="stat-card text-center pa-4" elevation="2">
          <v-icon icon="mdi-fire" color="error" size="32" class="mb-2"></v-icon>
          <div class="text-h4 font-weight-bold text-error">
            {{ userStore.streak }}
          </div>
          <div class="text-caption text-medium-emphasis">Streak Hari</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Statistics Section -->
    <v-card class="mb-6" elevation="2">
      <v-card-title class="d-flex align-center">
        <v-icon icon="mdi-chart-line" class="mr-2"></v-icon>
        Statistik
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <div class="d-flex align-center">
              <v-icon
                icon="mdi-checkbox-marked-circle"
                color="success"
                class="mr-3"
              ></v-icon>
              <div>
                <div class="text-h6 font-weight-bold">
                  {{ stats.totalHabitsCompleted }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Habits Completed
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <div class="d-flex align-center">
              <v-icon
                icon="mdi-playlist-check"
                color="primary"
                class="mr-3"
              ></v-icon>
              <div>
                <div class="text-h6 font-weight-bold">
                  {{ stats.totalTasksCompleted }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Tasks Completed
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <div class="d-flex align-center">
              <v-icon icon="mdi-meditation" color="info" class="mr-3"></v-icon>
              <div>
                <div class="text-h6 font-weight-bold">
                  {{ stats.totalFocusSessions }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Focus Sessions
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Achievements Section -->
    <v-card class="mb-6" elevation="2">
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon icon="mdi-trophy" class="mr-2"></v-icon>
          Achievements
        </div>
        <v-chip size="small" color="primary" variant="tonal">
          {{ unlockedAchievements.length }}/{{ allAchievements.length }}
        </v-chip>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            v-for="achievement in allAchievements"
            :key="achievement.id"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card
              :class="[
                'achievement-card pa-4',
                isUnlocked(achievement.id) ? 'unlocked' : 'locked',
              ]"
              elevation="1"
            >
              <div class="d-flex flex-column align-center text-center">
                <v-icon
                  :icon="achievement.icon"
                  :color="isUnlocked(achievement.id) ? 'primary' : 'grey'"
                  size="48"
                  class="mb-3"
                  :class="{
                    'achievement-icon-locked': !isUnlocked(achievement.id),
                  }"
                ></v-icon>
                <div class="text-subtitle-2 font-weight-bold mb-1">
                  {{ achievement.name }}
                </div>
                <div class="text-caption text-medium-emphasis mb-2">
                  {{ achievement.description }}
                </div>
                <v-chip
                  size="x-small"
                  :color="isUnlocked(achievement.id) ? 'success' : 'grey'"
                  variant="tonal"
                >
                  {{
                    isUnlocked(achievement.id)
                      ? "Unlocked"
                      : `+${achievement.xpReward} XP`
                  }}
                </v-chip>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Badges Section -->
    <v-card elevation="2">
      <v-card-title class="d-flex align-center">
        <v-icon icon="mdi-shield-star" class="mr-2"></v-icon>
        Badge Collection
      </v-card-title>
      <v-card-text>
        <div v-for="rarity in Object.keys(RARITY)" :key="rarity" class="mb-6">
          <div
            class="text-overline font-weight-bold mb-3"
            :style="{ color: RARITY_COLORS[rarity] }"
          >
            {{ RARITY_LABELS[rarity] }} Badges
          </div>
          <v-row>
            <v-col
              v-for="badge in getBadgesByRarity(rarity)"
              :key="badge.id"
              cols="6"
              sm="4"
              md="3"
            >
              <v-card
                :class="[
                  'badge-card pa-3 text-center',
                  hasBadge(badge) ? '' : 'locked',
                ]"
                elevation="1"
                :style="{
                  borderColor: hasBadge(badge)
                    ? RARITY_COLORS[rarity]
                    : 'transparent',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                }"
              >
                <v-icon
                  :icon="badge.icon"
                  :color="hasBadge(badge) ? RARITY_COLORS[rarity] : 'grey'"
                  size="40"
                  class="mb-2"
                  :class="{ 'opacity-30': !hasBadge(badge) }"
                ></v-icon>
                <div class="text-caption font-weight-bold">
                  {{ badge.name }}
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useUserStore } from "@/store/userStore";
import { getAllAchievements } from "@/data/achievementsData";
import {
  getAllBadges,
  RARITY,
  RARITY_COLORS,
  RARITY_LABELS,
  getBadgesByRarity,
} from "@/data/badgesData";

const userStore = useUserStore();

const allAchievements = getAllAchievements();
const allBadges = getAllBadges();

const stats = computed(() => userStore.statistics);

const unlockedAchievements = computed(() =>
  allAchievements.filter((a) => userStore.achievements.includes(a.id))
);

const isUnlocked = (achievementId) => {
  return userStore.achievements.includes(achievementId);
};

const hasBadge = (badge) => {
  // Check if linked achievement is unlocked
  if (badge.linkedAchievement) {
    return userStore.achievements.includes(badge.linkedAchievement);
  }
  return userStore.badges.includes(badge.id);
};
</script>

<style scoped>
.stat-card {
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.achievement-card {
  transition: all 0.3s ease;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.achievement-card.unlocked {
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.05),
    rgba(var(--v-theme-accent), 0.05)
  );
}

.achievement-card.locked {
  opacity: 0.6;
  filter: grayscale(0.5);
}

.achievement-icon-locked {
  opacity: 0.3;
}

.badge-card {
  transition: all 0.3s ease;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.badge-card.locked {
  opacity: 0.5;
  filter: grayscale(1);
}

.badge-card:hover {
  transform: scale(1.05);
}
</style>
