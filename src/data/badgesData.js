/**
 * Badges Data
 * Collectible badges with rarity tiers
 */

export const RARITY = {
  COMMON: "common",
  RARE: "rare",
  EPIC: "epic",
  LEGENDARY: "legendary",
};

export const RARITY_COLORS = {
  [RARITY.COMMON]: "#94a3b8", // Gray
  [RARITY.RARE]: "#3b82f6", // Blue
  [RARITY.EPIC]: "#a855f7", // Purple
  [RARITY.LEGENDARY]: "#f59e0b", // Gold
};

export const RARITY_LABELS = {
  [RARITY.COMMON]: "Common",
  [RARITY.RARE]: "Rare",
  [RARITY.EPIC]: "Epic",
  [RARITY.LEGENDARY]: "Legendary",
};

export const BADGES = {
  // === COMMON ===
  FIRST_STEP: {
    id: "first_step",
    name: "First Step",
    description: "Complete your first habit",
    icon: "mdi-foot-print",
    rarity: RARITY.COMMON,
    linkedAchievement: "first_habit",
  },
  TASK_WARRIOR: {
    id: "task_warrior",
    name: "Task Warrior",
    description: "Complete 5 tasks",
    icon: "mdi-sword",
    rarity: RARITY.COMMON,
    linkedAchievement: "task_starter",
  },

  // === RARE ===
  WEEK_WARRIOR: {
    id: "week_warrior",
    name: "Week Warrior",
    description: "7-day streak",
    icon: "mdi-fire",
    rarity: RARITY.RARE,
    linkedAchievement: "week_streak",
  },
  RISING_STAR: {
    id: "rising_star",
    name: "Rising Star",
    description: "Reach Level 5",
    icon: "mdi-star",
    rarity: RARITY.RARE,
    linkedAchievement: "level_5",
  },
  FOCUSED_MIND: {
    id: "focused_mind",
    name: "Focused Mind",
    description: "5 focus sessions completed",
    icon: "mdi-bullseye",
    rarity: RARITY.RARE,
    linkedAchievement: "focus_beginner",
  },

  // === EPIC ===
  MONTH_CHAMPION: {
    id: "month_champion",
    name: "Month Champion",
    description: "30-day streak",
    icon: "mdi-medal",
    rarity: RARITY.EPIC,
    linkedAchievement: "month_streak",
  },
  ELITE: {
    id: "elite",
    name: "Elite",
    description: "Reach Level 25",
    icon: "mdi-shield-star",
    rarity: RARITY.EPIC,
    linkedAchievement: "level_25",
  },
  HABIT_MASTER: {
    id: "habit_master",
    name: "Habit Master",
    description: "100 habits completed",
    icon: "mdi-crown",
    rarity: RARITY.EPIC,
    linkedAchievement: "habit_master",
  },
  DEEP_WORK_MASTER: {
    id: "deep_work_master",
    name: "Deep Work Master",
    description: "50 focus sessions",
    icon: "mdi-meditation",
    rarity: RARITY.EPIC,
    linkedAchievement: "focus_master",
  },

  // === LEGENDARY ===
  CENTURION: {
    id: "centurion",
    name: "Centurion",
    description: "100-day streak",
    icon: "mdi-trophy",
    rarity: RARITY.LEGENDARY,
    linkedAchievement: "centurion",
  },
  EARLY_BIRD: {
    id: "early_bird",
    name: "Early Bird",
    description: "Master of mornings",
    icon: "mdi-weather-sunset-up",
    rarity: RARITY.LEGENDARY,
    linkedAchievement: "early_bird",
  },
  PERFECTIONIST: {
    id: "perfectionist",
    name: "Perfectionist",
    description: "Perfect days achieved",
    icon: "mdi-check-all",
    rarity: RARITY.LEGENDARY,
    linkedAchievement: "perfectionist",
  },
};

// Helper functions
export const getAllBadges = () => Object.values(BADGES);

export const getBadgesByRarity = (rarity) => {
  return getAllBadges().filter((b) => b.rarity === rarity);
};

export const getBadgeById = (id) => {
  return BADGES[Object.keys(BADGES).find((key) => BADGES[key].id === id)];
};
