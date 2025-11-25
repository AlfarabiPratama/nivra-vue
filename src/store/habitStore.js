import { defineStore } from "pinia";
import { useUserStore } from "./userStore";

export const useHabitStore = defineStore("habit", {
  state: () => ({
    habits: [],
  }),

  actions: {
    addHabit(habit) {
      if (!habit.title || !habit.xp) {
        return console.error("Habit title and xp are required");
      }

      const newHabit = {
        id: Date.now(),
        ...habit,
        createdAt: new Date(),
        completedDates: [],
      };
      this.habits.push(newHabit);
    },

    completeHabit(habitId) {
      const habit = this.habits.find((h) => h.id === habitId);
      if (habit) {
        const today = new Date().setHours(0, 0, 0, 0);

        // Prevent completing the same habit multiple times a day
        const alreadyCompletedToday = habit.completedDates?.some(
          (date) => new Date(date).setHours(0, 0, 0, 0) === today
        );

        if (!alreadyCompletedToday) {
          if (!habit.completedDates) habit.completedDates = [];
          habit.completedDates.push(new Date().toISOString());

          // Update streak logic here if needed, or rely on computed

          // Add XP
          const userStore = useUserStore();
          userStore.addXP(habit.xp);
        }
      }
    },

    deleteHabit(habitId) {
      this.habits = this.habits.filter((h) => h.id !== habitId);
    },

    getUserData() {
      return { habits: this.habits };
    },

    loadUserData(data) {
      if (data && data.habits) this.habits = data.habits;
    },
  },
  persist: true,
});
