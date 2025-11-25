import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: () => import("../views/DashboardView.vue"),
  },
  {
    path: "/habits",
    name: "Habits",
    component: () => import("../views/HabitView.vue"),
  },
  {
    path: "/reading",
    name: "Reading",
    component: () => import("../views/ReadingView.vue"),
  },
  {
    path: "/finance",
    name: "Finance",
    component: () => import("../views/FinanceView.vue"),
  },
  {
    path: "/todo",
    name: "Todo",
    component: () => import("../views/TodoView.vue"),
  },
  {
    path: "/journal",
    name: "Journal",
    component: () => import("../views/JournalView.vue"),
  },
  {
    path: "/rewards",
    name: "Rewards",
    component: () => import("../views/RewardsView.vue"),
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("../views/SettingsView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
