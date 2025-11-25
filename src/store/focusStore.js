import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useUserStore } from "./userStore";

export const useFocusStore = defineStore(
  "focus",
  () => {
    // State
    const timeLeft = ref(25 * 60); // in seconds
    const isActive = ref(false);
    const mode = ref("focus"); // 'focus', 'short-break', 'long-break'
    const selectedTaskId = ref(null);
    const totalSessions = ref(0);

    // Timer interval reference (not persisted)
    let timerInterval = null;

    // Getters
    const formattedTime = computed(() => {
      const minutes = Math.floor(timeLeft.value / 60);
      const seconds = timeLeft.value % 60;
      return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    });

    const progress = computed(() => {
      const total =
        mode.value === "focus"
          ? 25 * 60
          : mode.value === "short-break"
          ? 5 * 60
          : 15 * 60;
      return ((total - timeLeft.value) / total) * 100;
    });

    // Actions
    function setMode(newMode) {
      mode.value = newMode;
      isActive.value = false;
      clearInterval(timerInterval);

      switch (newMode) {
        case "focus":
          timeLeft.value = 25 * 60;
          break;
        case "short-break":
          timeLeft.value = 5 * 60;
          break;
        case "long-break":
          timeLeft.value = 15 * 60;
          break;
      }
    }

    function toggleTimer() {
      if (isActive.value) {
        pauseTimer();
      } else {
        startTimer();
      }
    }

    function startTimer() {
      if (isActive.value) return;
      isActive.value = true;

      timerInterval = setInterval(() => {
        if (timeLeft.value > 0) {
          timeLeft.value--;
        } else {
          completeSession();
        }
      }, 1000);
    }

    function pauseTimer() {
      isActive.value = false;
      clearInterval(timerInterval);
    }

    function resetTimer() {
      pauseTimer();
      setMode(mode.value);
    }

    function completeSession() {
      pauseTimer();

      // Play notification sound (handled in view or here if possible)
      // new Audio('/sounds/bell.mp3').play().catch(e => console.log(e));

      if (mode.value === "focus") {
        totalSessions.value++;

        // Award XP
        const userStore = useUserStore();
        userStore.addXP(50); // 50 XP for a focus session

        // If task was selected, maybe mark progress?
        // For now just keep it simple

        // Auto switch to break? Or wait for user?
        // Let's wait for user, but maybe show notification
        userStore.showNotification("Sesi Fokus Selesai! Istirahatlah sejenak.");
      } else {
        const userStore = useUserStore();
        userStore.showNotification("Istirahat Selesai! Kembali bekerja?");
      }
    }

    function selectTask(taskId) {
      selectedTaskId.value = taskId;
    }

    // Persistence helpers
    function getUserData() {
      return {
        totalSessions: totalSessions.value,
      };
    }

    function loadUserData(data) {
      if (data && data.totalSessions) {
        totalSessions.value = data.totalSessions;
      }
    }

    return {
      timeLeft,
      isActive,
      mode,
      selectedTaskId,
      totalSessions,
      formattedTime,
      progress,
      setMode,
      toggleTimer,
      resetTimer,
      selectTask,
      getUserData,
      loadUserData,
    };
  },
  {
    persist: {
      paths: ["mode", "selectedTaskId", "totalSessions"], // Don't persist active timer state perfectly for now to avoid issues
    },
  }
);
