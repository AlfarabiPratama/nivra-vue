import { defineStore } from "pinia";
import { ACHIEVEMENTS, getAllAchievements } from "@/data/achievementsData";
import {
  getRandomDailyChallenge,
  getRandomWeeklyChallenge,
} from "@/data/challengesData";

export const useUserStore = defineStore("user", {
  state: () => ({
    xp: 0,
    level: 1,
    badges: [],
    streak: 0,
    xpToNextLevel: 100,

    // Achievements
    achievements: [], // Array of unlocked achievement IDs

    // Statistics
    statistics: {
      totalHabitsCompleted: 0,
      totalTasksCompleted: 0,
      totalFocusSessions: 0,
      totalFocusMinutes: 0,
      longestStreak: 0,
      earlyHabits: 0, // Completed before 8 AM
      lateTasks: 0, // Completed after 10 PM
      perfectDays: 0, // All tasks completed
    },

    // Challenges
    dailyChallenge: null,
    weeklyChallenge: null,
    challengeProgress: {},
    lastChallengeReset: null,

    // UI State for notifications
    showLevelUpModal: false,
    showToast: false,
    toastMessage: "",
    toastAmount: 0,
    showAchievementNotification: false,
    currentAchievement: null,
  }),

  actions: {
    calculateNextLevel() {
      this.xpToNextLevel = this.level * 100;
    },

    addXP(amount) {
      this.xp += amount;
      this.toastAmount = amount;
      this.toastMessage = "Hebat!";
      this.showToast = true;

      setTimeout(() => {
        this.showToast = false;
      }, 2000);

      if (this.xp >= this.xpToNextLevel) {
        this.levelUp();
      }
    },

    levelUp() {
      this.xp -= this.xpToNextLevel;
      this.level++;
      this.calculateNextLevel();
      this.showLevelUpModal = true;

      // Check for level achievements
      this.checkAchievements();
    },

    updateStreak(days) {
      this.streak = days;
      if (days > this.statistics.longestStreak) {
        this.statistics.longestStreak = days;
      }
      this.checkAchievements();
    },

    // === ACHIEVEMENTS SYSTEM ===
    checkAchievements() {
      const allAchievements = getAllAchievements();

      allAchievements.forEach((achievement) => {
        // Skip if already unlocked
        if (this.achievements.includes(achievement.id)) return;

        // Check condition
        const isUnlocked = this.checkAchievementCondition(
          achievement.condition
        );

        if (isUnlocked) {
          this.unlockAchievement(achievement);
        }
      });
    },

    checkAchievementCondition(condition) {
      switch (condition.type) {
        case "habits_completed":
          return this.statistics.totalHabitsCompleted >= condition.value;
        case "tasks_completed":
          return this.statistics.totalTasksCompleted >= condition.value;
        case "streak":
          return this.streak >= condition.value;
        case "level":
          return this.level >= condition.value;
        case "focus_sessions":
          return this.statistics.totalFocusSessions >= condition.value;
        case "early_habits":
          return this.statistics.earlyHabits >= condition.value;
        case "late_tasks":
          return this.statistics.lateTasks >= condition.value;
        case "perfect_days":
          return this.statistics.perfectDays >= condition.value;
        default:
          return false;
      }
    },

    unlockAchievement(achievement) {
      this.achievements.push(achievement.id);

      // Award XP
      if (achievement.xpReward) {
        this.xp += achievement.xpReward;
      }

      // Show achievement notification
      this.currentAchievement = achievement;
      this.showAchievementNotification = true;

      // Auto-hide after 5 seconds
      setTimeout(() => {
        this.showAchievementNotification = false;
      }, 5000);
    },

    // === CHALLENGES SYSTEM ===
    generateDailyChallenge() {
      const today = new Date().toDateString();

      // Only generate if no challenge or new day
      if (!this.dailyChallenge || this.lastChallengeReset !== today) {
        this.dailyChallenge = getRandomDailyChallenge();
        this.challengeProgress[this.dailyChallenge.id] = 0;
        this.lastChallengeReset = today;
      }
    },

    generateWeeklyChallenge() {
      // Generate at start of week if needed
      if (!this.weeklyChallenge) {
        this.weeklyChallenge = getRandomWeeklyChallenge();
        this.challengeProgress[this.weeklyChallenge.id] = 0;
      }
    },

    updateChallengeProgress(challengeId, progress) {
      this.challengeProgress[challengeId] = progress;

      // Check if challenge completed
      const challenge =
        this.dailyChallenge?.id === challengeId
          ? this.dailyChallenge
          : this.weeklyChallenge;

      if (challenge && progress >= challenge.requirement.value) {
        this.completeChallenge(challenge);
      }
    },

    completeChallenge(challenge) {
      // Award bonus XP
      this.addXP(challenge.xpReward);

      // Show notification
      this.toastMessage = `Challenge Complete: ${challenge.name}!`;
      this.toastAmount = challenge.xpReward;
      this.showToast = true;
    },

    // === STATISTICS TRACKING ===
    incrementStat(statName, amount = 1) {
      if (this.statistics.hasOwnProperty(statName)) {
        this.statistics[statName] += amount;
        this.checkAchievements();
      }
    },

    unlockBadge(badgeName) {
      if (!this.badges.includes(badgeName)) {
        this.badges.push(badgeName);
        this.showNotification(`New Badge Unlocked: ${badgeName}`);
      }
    },

    showNotification(message) {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Nivra", {
          body: message,
          icon: "/nivra-vue/logo.png",
        });
      } else {
        console.log("Notification:", message);
      }
    },

    getUserData() {
      return {
        xp: this.xp,
        level: this.level,
        badges: this.badges,
        streak: this.streak,
        xpToNextLevel: this.xpToNextLevel,
        achievements: this.achievements,
        statistics: this.statistics,
        dailyChallenge: this.dailyChallenge,
        weeklyChallenge: this.weeklyChallenge,
        challengeProgress: this.challengeProgress,
        lastChallengeReset: this.lastChallengeReset,
      };
    },

    loadUserData(data) {
      if (data) {
        this.xp = data.xp || 0;
        this.level = data.level || 1;
        this.badges = data.badges || [];
        this.streak = data.streak || 0;
        this.xpToNextLevel = data.xpToNextLevel || 100;
        this.achievements = data.achievements || [];
        this.statistics = data.statistics || {
          totalHabitsCompleted: 0,
          totalTasksCompleted: 0,
          totalFocusSessions: 0,
          totalFocusMinutes: 0,
          longestStreak: 0,
          earlyHabits: 0,
          lateTasks: 0,
          perfectDays: 0,
        };
        this.dailyChallenge = data.dailyChallenge || null;
        this.weeklyChallenge = data.weeklyChallenge || null;
        this.challengeProgress = data.challengeProgress || {};
        this.lastChallengeReset = data.lastChallengeReset || null;
      }
    },
  },
  persist: true,
});
