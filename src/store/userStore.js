import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    xp: 0,
    level: 1,
    badges: [],
    streak: 0,
    xpToNextLevel: 100,
    // UI State for notifications
    showLevelUpModal: false,
    showToast: false,
    toastMessage: "",
    toastAmount: 0,
  }),
  actions: {
    calculateNextLevel() {
      // Simple formula: Level * 100 XP needed
      this.xpToNextLevel = this.level * 100;
    },

    addXP(amount) {
      this.xp += amount;

      // Show toast notification
      this.toastAmount = amount;
      this.toastMessage = "Hebat!";
      this.showToast = true;

      // Auto-hide toast after 2 seconds
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

      // Show level up modal
      this.showLevelUpModal = true;
    },

    updateStreak(days) {
      this.streak = days;
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
          icon: "/icons/icon-192x192.png",
        });
      } else {
        // Fallback to toast (implemented in UI)
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
      };
    },

    loadUserData(data) {
      if (data) {
        this.xp = data.xp || 0;
        this.level = data.level || 1;
        this.badges = data.badges || [];
        this.streak = data.streak || 0;
        this.xpToNextLevel = data.xpToNextLevel || 100;
      }
    },
  },
  persist: true,
});
