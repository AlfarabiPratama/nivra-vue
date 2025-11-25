<template>
  <v-app>
    <!-- Responsive Sidebar -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail && !mobile"
      :permanent="!mobile"
      :temporary="mobile"
      @click="rail = false"
      color="#273544"
      theme="dark"
      class="ocean-sidebar border-none rounded-r-xl"
      elevation="4"
      :width="280"
    >
      <div class="d-flex align-center pa-4 mb-4">
        <v-avatar color="transparent" size="40" class="mr-3">
          <v-img src="/assets/logo-transparent.png" alt="Nivra Logo"></v-img>
        </v-avatar>
        <div
          v-if="!rail"
          class="text-h5 font-weight-bold text-white tracking-wide"
        >
          Nivra
        </div>
        <v-btn
          v-if="!rail"
          icon="mdi-chevron-left"
          variant="text"
          size="small"
          class="ml-auto text-grey"
          @click="rail = !rail"
        ></v-btn>
      </div>

      <v-divider></v-divider>

      <v-list density="compact" nav class="flex-grow-1">
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Beranda"
          value="dashboard"
          to="/"
          active-class="active-nav-item"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-checkbox-marked-circle"
          title="Kebiasaan"
          value="habits"
          to="/habits"
          active-class="active-nav-item"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-finance"
          title="Keuangan"
          value="finance"
          to="/finance"
          active-class="active-nav-item"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-book-open-page-variant"
          title="Jurnal"
          value="journal"
          to="/journal"
          active-class="active-nav-item"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-format-list-checks"
          title="Tugas"
          value="todo"
          to="/todo"
          active-class="active-nav-item"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-book-variant"
          title="Bacaan"
          value="reading"
          to="/reading"
          active-class="active-nav-item"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-trophy"
          title="Hadiah"
          value="rewards"
          to="/rewards"
          active-class="active-nav-item"
        ></v-list-item>
      </v-list>

      <template v-slot:append>
        <div v-if="!rail" class="pa-4">
          <v-card
            class="ocean-card pa-3 d-flex align-center bg-surface-soft"
            elevation="0"
          >
            <v-avatar size="36" class="mr-3">
              <v-img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="Avatar"
              ></v-img>
            </v-avatar>
            <div class="flex-grow-1 overflow-hidden">
              <div class="text-subtitle-2 font-weight-bold text-truncate">
                Alex Doe
              </div>
              <div class="text-caption text-grey-lighten-1">Level 12</div>
            </div>
            <v-btn
              icon="mdi-cog-outline"
              variant="text"
              size="small"
              to="/settings"
              color="grey-lighten-1"
            ></v-btn>
          </v-card>
        </div>
        <div v-else class="pa-2 text-center">
          <v-btn icon="mdi-cog-outline" variant="text" to="/settings"></v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Mobile Header -->
    <v-app-bar app class="d-md-none" elevation="0" color="background">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title class="font-weight-bold">Nivra</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleTheme">
        <v-icon>{{
          isDark ? "mdi-weather-sunny" : "mdi-weather-night"
        }}</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="bg-background">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>

    <!-- Mobile Bottom Nav -->
    <v-bottom-navigation
      app
      class="d-md-none"
      grow
      color="primary"
      bg-color="surface"
    >
      <v-btn to="/">
        <v-icon>mdi-view-dashboard</v-icon>
        <span>Home</span>
      </v-btn>
      <v-btn to="/habits">
        <v-icon>mdi-checkbox-marked-circle</v-icon>
        <span>Habits</span>
      </v-btn>
      <v-btn to="/finance">
        <v-icon>mdi-wallet</v-icon>
        <span>Keuangan</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>

  <!-- Gamification Components -->
  <LevelUpModal v-model="userStore.showLevelUpModal" :level="userStore.level" />
  <ToastNotification
    v-model="userStore.showToast"
    :amount="userStore.toastAmount"
    :message="userStore.toastMessage"
  />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useTheme, useDisplay } from "vuetify";
import { useUserStore } from "@/store/userStore";
import LevelUpModal from "@/components/LevelUpModal.vue";
import ToastNotification from "@/components/ToastNotification.vue";

const theme = useTheme();
const { mobile } = useDisplay();
const userStore = useUserStore();
const drawer = ref(true);
const rail = ref(false);
const isDark = ref(false);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  theme.global.name.value = isDark.value ? "dark" : "light";
  localStorage.setItem("theme-dark", isDark.value);
};

// Auto-collapse sidebar on mobile
onMounted(() => {
  if (mobile.value) {
    drawer.value = false;
    rail.value = false;
  }
});

onMounted(() => {
  const savedTheme = localStorage.getItem("theme-dark");
  if (savedTheme !== null) {
    isDark.value = savedTheme === "true";
    theme.global.name.value = isDark.value ? "dark" : "light";
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* --- OCEAN MIST SIDEBAR STYLES --- */
.ocean-sidebar {
  border-right: 1px solid rgba(141, 163, 179, 0.1);
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15);
}

.active-glow {
  background: linear-gradient(90deg, #8da3b3, #5faf8b) !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(141, 163, 179, 0.3);
  font-weight: 600;
}

.nav-item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 4px;
}

.nav-item:not(.active-glow):hover {
  background: rgba(141, 163, 179, 0.1);
  transform: translateX(6px);
}
</style>
