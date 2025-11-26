/**
 * Achievements Data
 * Defines all achievements with unlock conditions and rewards
 */

export const ACHIEVEMENT_CATEGORIES = {
  HABITS: "habits",
  TASKS: "tasks",
  STREAKS: "streaks",
  LEVELS: "levels",
  FOCUS: "focus",
  MILESTONES: "milestones",
};

export const ACHIEVEMENTS = {
  // === HABITS ===
  FIRST_HABIT: {
    id: "first_habit",
    category: ACHIEVEMENT_CATEGORIES.HABITS,
    name: "Langkah Pertama",
    description: "Selesaikan habit pertama kamu",
    icon: "/icons/3d/star.png", // 3D star for first achievement
    condition: { type: "habits_completed", value: 1 },
    xpReward: 50,
  },
  HABIT_ENTHUSIAST: {
    id: "habit_enthusiast",
    category: ACHIEVEMENT_CATEGORIES.HABITS,
    name: "Penggemar Kebiasaan",
    description: "Selesaikan 10 habits",
    icon: "/icons/3d/fire.png", // 3D fire for enthusiasm
    condition: { type: "habits_completed", value: 10 },
    xpReward: 100,
  },
  HABIT_MASTER: {
    id: "habit_master",
    category: ACHIEVEMENT_CATEGORIES.HABITS,
    name: "Century Club",
    description: "Selesaikan 100 habits",
    icon: "/icons/3d/trophy.png", // 3D trophy for mastery
    condition: { type: "habits_completed", value: 100 },
    xpReward: 500,
  },

  // === TASKS ===
  TASK_STARTER: {
    id: "task_starter",
    category: ACHIEVEMENT_CATEGORIES.TASKS,
    name: "Task Warrior",
    description: "Selesaikan 5 tasks",
    icon: "mdi-checkbox-marked",
    condition: { type: "tasks_completed", value: 5 },
    xpReward: 50,
  },
  TASK_COMPLETER: {
    id: "task_completer",
    category: ACHIEVEMENT_CATEGORIES.TASKS,
    name: "Getting Things Done",
    description: "Selesaikan 25 tasks",
    icon: "mdi-playlist-check",
    condition: { type: "tasks_completed", value: 25 },
    xpReward: 150,
  },
  TASK_GURU: {
    id: "task_guru",
    category: ACHIEVEMENT_CATEGORIES.TASKS,
    name: "Task Guru",
    description: "Selesaikan 100 tasks",
    icon: "mdi-trophy-variant",
    condition: { type: "tasks_completed", value: 100 },
    xpReward: 500,
  },

  // === STREAKS ===
  WEEK_STREAK: {
    id: "week_streak",
    category: ACHIEVEMENT_CATEGORIES.STREAKS,
    name: "7 Days Strong",
    description: "Pertahankan streak 7 hari",
    icon: "/icons/3d/fire.png", // 3D fire
    condition: { type: "streak", value: 7 },
    xpReward: 200,
  },
  MONTH_STREAK: {
    id: "month_streak",
    category: ACHIEVEMENT_CATEGORIES.STREAKS,
    name: "Month Champion",
    description: "Pertahankan streak 30 hari",
    icon: "/icons/3d/medal.png", // 3D medal
    condition: { type: "streak", value: 30 },
    xpReward: 1000,
  },
  CENTURION: {
    id: "centurion",
    category: ACHIEVEMENT_CATEGORIES.STREAKS,
    name: "Centurion",
    description: "Pertahankan streak 100 hari",
    icon: "/icons/3d/trophy.png", // 3D trophy
    condition: { type: "streak", value: 100 },
    xpReward: 5000,
  },

  // === LEVELS ===
  LEVEL_5: {
    id: "level_5",
    category: ACHIEVEMENT_CATEGORIES.LEVELS,
    name: "Rising Star",
    description: "Capai Level 5",
    icon: "/icons/3d/star.png", // 3D star
    condition: { type: "level", value: 5 },
    xpReward: 100,
  },
  LEVEL_10: {
    id: "level_10",
    category: ACHIEVEMENT_CATEGORIES.LEVELS,
    name: "Determined",
    description: "Capai Level 10",
    icon: "/icons/3d/medal.png", // 3D medal for significant achievement
    condition: { type: "level", value: 10 },
    xpReward: 300,
  },
  LEVEL_25: {
    id: "level_25",
    category: ACHIEVEMENT_CATEGORIES.LEVELS,
    name: "Elite",
    description: "Capai Level 25",
    icon: "/icons/3d/trophy.png", // 3D trophy for elite status
    condition: { type: "level", value: 25 },
    xpReward: 1000,
  },

  // === FOCUS ===
  FOCUS_BEGINNER: {
    id: "focus_beginner",
    category: ACHIEVEMENT_CATEGORIES.FOCUS,
    name: "Focused Mind",
    description: "Selesaikan 5 sesi fokus",
    icon: "mdi-bullseye-arrow",
    condition: { type: "focus_sessions", value: 5 },
    xpReward: 100,
  },
  FOCUS_MASTER: {
    id: "focus_master",
    category: ACHIEVEMENT_CATEGORIES.FOCUS,
    name: "Deep Work Master",
    description: "Selesaikan 50 sesi fokus",
    icon: "mdi-meditation",
    condition: { type: "focus_sessions", value: 50 },
    xpReward: 500,
  },

  // === MILESTONES ===
  EARLY_BIRD: {
    id: "early_bird",
    category: ACHIEVEMENT_CATEGORIES.MILESTONES,
    name: "Early Bird",
    description: "Selesaikan 5 habits sebelum jam 8 pagi",
    icon: "mdi-weather-sunset-up",
    condition: { type: "early_habits", value: 5 },
    xpReward: 150,
  },
  NIGHT_OWL: {
    id: "night_owl",
    category: ACHIEVEMENT_CATEGORIES.MILESTONES,
    name: "Night Owl",
    description: "Selesaikan 5 tasks setelah jam 10 malam",
    icon: "mdi-owl",
    condition: { type: "late_tasks", value: 5 },
    xpReward: 150,
  },
  PERFECTIONIST: {
    id: "perfectionist",
    category: ACHIEVEMENT_CATEGORIES.MILESTONES,
    name: "Perfectionist",
    description: "Selesaikan semua tasks di hari yang sama 5x",
    icon: "mdi-check-all",
    condition: { type: "perfect_days", value: 5 },
    xpReward: 300,
  },
};

// Helper to get all achievements as array
export const getAllAchievements = () => Object.values(ACHIEVEMENTS);

// Helper to get achievements by category
export const getAchievementsByCategory = (category) => {
  return getAllAchievements().filter((a) => a.category === category);
};
