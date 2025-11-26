<template>
  <v-app>
    <!-- Modern Glassmorphism Sidebar -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail && !mobile"
      :permanent="!mobile"
      :temporary="mobile"
      class="modern-sidebar elevation-8"
      :width="280"
    >
      <!-- Header Section -->
      <div class="sidebar-header" :class="{ 'rail-header': rail }">
        <!-- Rail Mode (Collapsed) - Logo Only Centered -->
        <div
          v-if="rail"
          class="d-flex justify-center align-center py-4"
          style="width: 100%; overflow: hidden"
        >
          <v-avatar color="white" size="50" class="logo-avatar">
            <v-img src="/nivra-vue/logo.png" alt="Logo" cover></v-img>
          </v-avatar>
        </div>

        <!-- Normal Mode (Expanded) - Full Header -->
        <div v-else class="pa-6">
          <div class="d-flex align-center">
            <div class="logo-container">
              <v-avatar color="white" size="50" class="logo-avatar">
                <v-img src="/nivra-vue/logo.png" alt="Logo" cover></v-img>
              </v-avatar>
            </div>
            <div class="ml-4 flex-grow-1">
              <div class="text-h5 font-weight-black app-title">Nivra</div>
              <div class="text-caption text-medium-emphasis">
                Produktivitas PWA
              </div>
            </div>
            <v-btn
              v-if="!mobile"
              icon="mdi-chevron-left"
              variant="text"
              size="small"
              class="ml-2"
              aria-label="Collapse navigation menu"
              @click.stop="rail = true"
            ></v-btn>
          </div>
        </div>
      </div>

      <!-- Navigation Items -->
      <v-list class="nav-list pa-2" nav>
        <v-list-item
          v-for="item in navItems"
          :key="item.value"
          :title="!rail ? item.title : undefined"
          :value="item.value"
          :to="item.to"
          :aria-label="'Navigate to ' + item.title"
          class="nav-item mb-2 rounded-xl"
          :class="{ 'nav-item-rail': rail, 'px-2': rail }"
        >
          <template v-slot:prepend>
            <div class="nav-icon-wrapper" :style="{ background: item.color }">
              <v-icon :icon="item.icon" color="white" size="20"></v-icon>
            </div>
          </template>
        </v-list-item>
      </v-list>

      <!-- Bottom Actions -->
      <template v-slot:append>
        <!-- Theme Toggle -->
        <div class="pa-3 border-t">
          <v-btn
            :prepend-icon="
              !rail
                ? isDark
                  ? 'mdi-weather-sunny'
                  : 'mdi-weather-night'
                : undefined
            "
            :icon="
              rail
                ? isDark
                  ? 'mdi-weather-sunny'
                  : 'mdi-weather-night'
                : undefined
            "
            :aria-label="
              isDark ? 'Switch to light mode' : 'Switch to dark mode'
            "
            variant="tonal"
            color="primary"
            @click.stop="toggleTheme"
            :block="!rail"
            class="theme-toggle-btn rounded-xl"
          >
            <span v-if="!rail">{{
              isDark ? "Mode Terang" : "Mode Gelap"
            }}</span>
          </v-btn>
        </div>

        <!-- User Profile Card -->
        <div v-if="!rail" class="pa-3">
          <v-card class="user-card rounded-xl pa-4" elevation="0">
            <div class="d-flex align-center">
              <v-avatar size="48" class="user-avatar" color="surface-variant">
                <v-icon :icon="userStore.avatar" size="28"></v-icon>
              </v-avatar>
              <div class="ml-3 flex-grow-1 overflow-hidden">
                <div class="text-subtitle-2 font-weight-bold text-truncate">
                  {{ userStore.name }}
                </div>
                <div class="d-flex align-center mt-1">
                  <v-icon size="14" color="accent" class="mr-1"
                    >mdi-star</v-icon
                  >
                  <span class="text-caption text-medium-emphasis"
                    >Level {{ userStore.level }}</span
                  >
                </div>
              </div>
              <v-btn
                icon="mdi-cog"
                variant="text"
                size="small"
                aria-label="Open settings"
                to="/settings"
              ></v-btn>
            </div>
          </v-card>
        </div>

        <!-- Collapsed State Buttons -->
        <div v-else class="pa-3 d-flex flex-column gap-2">
          <v-btn
            icon="mdi-account-circle"
            variant="text"
            aria-label="Go to settings"
            to="/settings"
          ></v-btn>
          <v-btn
            icon="mdi-chevron-right"
            variant="text"
            aria-label="Expand navigation menu"
            @click.stop="rail = false"
          ></v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Mobile Header -->
    <v-app-bar app class="d-md-none modern-app-bar" elevation="0">
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        aria-label="Toggle navigation drawer"
      ></v-app-bar-nav-icon>
      <v-app-bar-title class="font-weight-bold">Nivra</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn
        icon
        @click="toggleTheme"
        variant="text"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <v-icon>{{
          isDark ? "mdi-weather-sunny" : "mdi-weather-night"
        }}</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="bg-background" id="main-content" role="main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>

    <!-- Mobile Bottom Nav -->
    <v-bottom-navigation
      app
      class="d-md-none modern-bottom-nav"
      grow
      color="primary"
    >
      <v-btn to="/" value="home">
        <v-icon>mdi-view-dashboard</v-icon>
        <span>Home</span>
      </v-btn>
      <v-btn to="/habits" value="habits">
        <v-icon>mdi-checkbox-marked-circle</v-icon>
        <span>Habits</span>
      </v-btn>
      <v-btn to="/finance" value="finance">
        <v-icon>mdi-wallet</v-icon>
        <span>Finance</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>

  <!-- Gamification Components with Lazy Loading -->
  <Suspense>
    <LevelUpModal
      v-model="userStore.showLevelUpModal"
      :level="userStore.level"
    />
  </Suspense>
  <Suspense>
    <ToastNotification
      v-model="userStore.showToast"
      :amount="userStore.toastAmount"
      :message="userStore.toastMessage"
    />
  </Suspense>

  <!-- Global Error Notification -->
  <ErrorNotification />

  <!-- PWA Components -->
  <InstallPrompt />
  <OfflineIndicator />
  <UpdateNotification />

  <!-- Gamification Components -->
  <AchievementNotification />
</template>

<script setup>
import { onMounted, ref, computed, defineAsyncComponent } from "vue";
import { useTheme, useDisplay } from "vuetify";
import { useUserStore } from "@/store/userStore";
import ImageLoader from "@/components/ImageLoader.vue";
import ErrorNotification from "@/components/ErrorNotification.vue";
import InstallPrompt from "@/components/InstallPrompt.vue";
import OfflineIndicator from "@/components/OfflineIndicator.vue";
import UpdateNotification from "@/components/UpdateNotification.vue";
import AchievementNotification from "@/components/AchievementNotification.vue";

// Lazy load modal components
const LevelUpModal = defineAsyncComponent(() =>
  import("@/components/LevelUpModal.vue")
);
const ToastNotification = defineAsyncComponent(() =>
  import("@/components/ToastNotification.vue")
);

const theme = useTheme();
const { mobile } = useDisplay();
const userStore = useUserStore();
const drawer = ref(true);
const rail = ref(false);
const isDark = ref(false);

const navItems = [
  {
    icon: "mdi-view-dashboard",
    title: "Beranda",
    value: "dashboard",
    to: "/",
    color: "linear-gradient(135deg, #202238 0%, #404470 100%)",
  },
  {
    icon: "mdi-checkbox-marked-circle",
    title: "Kebiasaan",
    value: "habits",
    to: "/habits",
    color: "linear-gradient(135deg, #202238 0%, #404470 100%)",
  },
  {
    icon: "mdi-finance",
    title: "Keuangan",
    value: "finance",
    to: "/finance",
    color: "linear-gradient(135deg, #202238 0%, #404470 100%)",
  },
  {
    icon: "mdi-book-open-page-variant",
    title: "Jurnal",
    value: "journal",
    to: "/journal",
    color: "linear-gradient(135deg, #202238 0%, #404470 100%)",
  },
  {
    icon: "mdi-format-list-checks",
    title: "Tugas",
    value: "todo",
    to: "/todo",
    color: "linear-gradient(135deg, #202238 0%, #404470 100%)",
  },
  {
    icon: "mdi-book-variant",
    title: "Bacaan",
    value: "reading",
    to: "/reading",
    color: "linear-gradient(135deg, #202238 0%, #404470 100%)",
  },
  {
    icon: "mdi-trophy",
    title: "Hadiah",
    value: "rewards",
    to: "/rewards",
    color: "linear-gradient(135deg, #202238 0%, #404470 100%)",
  },
  {
    icon: "mdi-bullseye-arrow",
    title: "Fokus",
    value: "focus",
    to: "/focus",
    color: "linear-gradient(135deg, #202238 0%, #404470 100%)",
  },
];

const toggleTheme = () => {
  isDark.value = !isDark.value;
  theme.global.name.value = isDark.value ? "midnight" : "ocean";
  localStorage.setItem("theme-dark", isDark.value);
};

onMounted(() => {
  if (mobile.value) {
    drawer.value = false;
    rail.value = false;
  }

  const savedTheme = localStorage.getItem("theme-dark");
  if (savedTheme !== null) {
    isDark.value = savedTheme === "true";
    theme.global.name.value = isDark.value ? "midnight" : "ocean";
  }

  // Initialize gamification
  userStore.generateDailyChallenge();
  userStore.generateWeeklyChallenge();
  userStore.checkAchievements();
});
</script>

<style scoped>
/* Global Mobile Overflow Fix */
:deep(.v-application),
:deep(.v-main),
:deep(body),
:deep(html) {
  overflow-x: hidden !important;
  max-width: 100vw !important;
}

:deep(.v-container) {
  max-width: 100% !important;
}

/* Page Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Modern Sidebar - Glassmorphism */
.modern-sidebar {
  background: rgba(var(--v-theme-surface), 0.8) !important;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-right: 1px solid rgba(var(--v-theme-on-surface), 0.08) !important;
}

/* Sidebar Header */
.sidebar-header {
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.1) 0%,
    rgba(var(--v-theme-secondary), 0.05) 100%
  );
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.05);
}

.logo-avatar {
  box-shadow: 0 8px 24px rgba(var(--v-theme-primary), 0.3);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.logo-avatar:hover {
  transform: rotate(15deg) scale(1.1);
}

.app-title {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)),
    rgb(var(--v-theme-secondary))
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Navigation List */
.nav-list {
  flex-grow: 1;
  overflow-y: auto;
}

/* Navigation Items - Modern Style */
.nav-item {
  margin-bottom: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: linear-gradient(
    180deg,
    rgb(var(--v-theme-primary)),
    rgb(var(--v-theme-secondary))
  );
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.nav-item:hover::before,
.nav-item.v-list-item--active::before {
  transform: scaleY(1);
}

.nav-item:hover {
  background: rgba(var(--v-theme-primary), 0.08);
  transform: translateX(4px);
}

.nav-item.v-list-item--active {
  background: linear-gradient(
    90deg,
    rgba(var(--v-theme-primary), 0.15),
    rgba(var(--v-theme-primary), 0.05)
  );
  font-weight: 600;
}

.nav-item.v-list-item--active :deep(.v-list-item-title) {
  color: rgb(var(--v-theme-primary));
  font-weight: 700;
}

/* Icon Wrapper with Gradient Background */
.nav-icon-wrapper {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  margin-right: 16px;
}

.nav-item:hover .nav-icon-wrapper {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.nav-item-rail {
  justify-content: center;
}

/* Theme Toggle Button */
.theme-toggle-btn {
  transition: all 0.3s ease;
}

.theme-toggle-btn:hover {
  transform: scale(1.05);
}

/* User Card */
.user-card {
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-surface-light), 0.6),
    rgba(var(--v-theme-surface), 0.4)
  );
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  transition: all 0.3s ease;
}

.user-card:hover {
  background: rgba(var(--v-theme-surface-light), 0.8);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  border: 2px solid rgb(var(--v-theme-primary));
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.2);
}

/* Mobile App Bar */
.modern-app-bar {
  background: rgba(var(--v-theme-surface), 0.9) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

/* Mobile Bottom Nav */
.modern-bottom-nav {
  background: rgba(var(--v-theme-surface), 0.9) !important;
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

/* Scrollbar Styling - Hidden */
.nav-list {
  scrollbar-width: none !important; /* Firefox */
  -ms-overflow-style: none !important; /* IE and Edge */
  overflow-y: auto !important;
}

.nav-list::-webkit-scrollbar {
  display: none !important; /* Chrome, Safari, Opera */
  width: 0 !important;
  height: 0 !important;
}

.modern-sidebar :deep(.v-navigation-drawer__content) {
  overflow-y: auto !important;
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}

.modern-sidebar :deep(.v-navigation-drawer__content)::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
}

/* Rail Mode Header Styling */
.rail-header {
  padding: 1.5rem 0 !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  width: 100% !important;
}

.rail-header .d-flex {
  width: 100% !important;
  justify-content: center !important;
  padding: 0 !important;
  margin: 0 !important;
}

.rail-header .logo-container {
  margin: 0 !important;
}

/* Override Vuetify Rail Mode Padding */
.modern-sidebar.v-navigation-drawer--rail .sidebar-header {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.modern-sidebar.v-navigation-drawer--rail .rail-header > div {
  width: 100% !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

/* Nav Item Rail Mode Styling */
.nav-item-rail {
  justify-content: center !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.nav-item-rail :deep(.v-list-item__content) {
  display: none !important;
  width: 0 !important;
}

.nav-item-rail :deep(.v-list-item__prepend) {
  margin-inline-end: 0 !important;
  display: flex !important;
  justify-content: center !important;
  width: 100% !important;
}

.nav-item-rail .nav-icon-wrapper {
  margin: 0 auto !important;
}
</style>
