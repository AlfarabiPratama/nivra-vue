/**
 * Daily/Weekly Challenges Data
 * Auto-generated challenges for bonus XP
 */

export const CHALLENGE_TYPE = {
  DAILY: "daily",
  WEEKLY: "weekly",
};

export const CHALLENGE_CATEGORY = {
  HABITS: "habits",
  TASKS: "tasks",
  FOCUS: "focus",
  MIXED: "mixed",
};

export const CHALLENGE_TEMPLATES = [
  // === DAILY CHALLENGES - HABITS ===
  {
    id: "daily_3_habits",
    type: CHALLENGE_TYPE.DAILY,
    category: CHALLENGE_CATEGORY.HABITS,
    name: "Triple Threat",
    description: "Complete 3 habits today",
    icon: "mdi-checkbox-multiple-marked",
    requirement: { type: "habits_completed_today", value: 3 },
    xpReward: 100,
  },
  {
    id: "daily_5_habits",
    type: CHALLENGE_TYPE.DAILY,
    category: CHALLENGE_CATEGORY.HABITS,
    name: "Habit Hero",
    description: "Complete 5 habits today",
    icon: "mdi-heart-multiple",
    requirement: { type: "habits_completed_today", value: 5 },
    xpReward: 150,
  },

  // === DAILY CHALLENGES - TASKS ===
  {
    id: "daily_all_tasks",
    type: CHALLENGE_TYPE.DAILY,
    category: CHALLENGE_CATEGORY.TASKS,
    name: "Clean Sweep",
    description: "Complete all tasks for today",
    icon: "mdi-broom",
    requirement: { type: "all_tasks_today", value: true },
    xpReward: 150,
  },
  {
    id: "daily_3_high_priority",
    type: CHALLENGE_TYPE.DAILY,
    category: CHALLENGE_CATEGORY.TASKS,
    name: "Priority Master",
    description: "Complete 3 high-priority tasks",
    icon: "mdi-fire",
    requirement: { type: "high_priority_tasks", value: 3 },
    xpReward: 120,
  },

  // === DAILY CHALLENGES - FOCUS ===
  {
    id: "daily_2_focus",
    type: CHALLENGE_TYPE.DAILY,
    category: CHALLENGE_CATEGORY.FOCUS,
    name: "Deep Dive",
    description: "Complete 2 focus sessions",
    icon: "mdi-meditation",
    requirement: { type: "focus_sessions_today", value: 2 },
    xpReward: 150,
  },

  // === DAILY CHALLENGES - MIXED ===
  {
    id: "daily_early_morning",
    type: CHALLENGE_TYPE.DAILY,
    category: CHALLENGE_CATEGORY.MIXED,
    name: "Early Riser",
    description: "Complete 2 habits before 8 AM",
    icon: "mdi-weather-sunset-up",
    requirement: { type: "early_habits", value: 2 },
    xpReward: 200,
  },

  // === WEEKLY CHALLENGES ===
  {
    id: "weekly_perfect_week",
    type: CHALLENGE_TYPE.WEEKLY,
    category: CHALLENGE_CATEGORY.HABITS,
    name: "Perfect Week",
    description: "Complete at least 3 habits every day this week",
    icon: "mdi-calendar-star",
    requirement: { type: "daily_habits_streak", value: 7 },
    xpReward: 500,
  },
  {
    id: "weekly_20_tasks",
    type: CHALLENGE_TYPE.WEEKLY,
    category: CHALLENGE_CATEGORY.TASKS,
    name: "Task Marathon",
    description: "Complete 20 tasks this week",
    icon: "mdi-run-fast",
    requirement: { type: "tasks_completed_week", value: 20 },
    xpReward: 400,
  },
  {
    id: "weekly_5_focus",
    type: CHALLENGE_TYPE.WEEKLY,
    category: CHALLENGE_CATEGORY.FOCUS,
    name: "Focus Week",
    description: "Complete 5 focus sessions this week",
    icon: "mdi-brain",
    requirement: { type: "focus_sessions_week", value: 5 },
    xpReward: 450,
  },
];

// Helper functions
export const getDailyChallenges = () => {
  return CHALLENGE_TEMPLATES.filter((c) => c.type === CHALLENGE_TYPE.DAILY);
};

export const getWeeklyChallenges = () => {
  return CHALLENGE_TEMPLATES.filter((c) => c.type === CHALLENGE_TYPE.WEEKLY);
};

export const getRandomDailyChallenge = () => {
  const dailies = getDailyChallenges();
  return dailies[Math.floor(Math.random() * dailies.length)];
};

export const getRandomWeeklyChallenge = () => {
  const weeklies = getWeeklyChallenges();
  return weeklies[Math.floor(Math.random() * weeklies.length)];
};
