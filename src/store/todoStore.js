import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useUserStore } from "./userStore";

export const useTodoStore = defineStore(
  "todo",
  () => {
    // State
    const tasks = ref([
      {
        id: 1,
        title: "Selesaikan laporan proyek",
        completed: false,
        category: "Pekerjaan",
        priority: "tinggi",
        dueDate: "2023-10-30",
      },
      {
        id: 2,
        title: "Beli bahan makanan",
        completed: false,
        category: "Belanja",
        priority: "sedang",
        dueDate: "2023-10-28",
      },
      {
        id: 3,
        title: "Jogging pagi",
        completed: true,
        category: "Kesehatan",
        priority: "rendah",
        dueDate: "2023-10-27",
      },
    ]);

    // Getters
    const pendingTasks = computed(
      () => tasks.value.filter((t) => !t.completed).length
    );

    const filteredTasks = (filter) => {
      switch (filter) {
        case "today":
          const today = new Date().toISOString().split("T")[0];
          return tasks.value.filter((t) => t.dueDate === today && !t.completed);
        case "important":
          return tasks.value.filter(
            (t) => t.priority === "tinggi" && !t.completed
          );
        case "completed":
          return tasks.value.filter((t) => t.completed);
        default:
          return tasks.value; // 'all'
      }
    };

    const todayTasks = computed(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return tasks.value
        .filter((t) => {
          if (t.completed) return false;
          if (!t.dueDate) return false;

          const dueDate = new Date(t.dueDate);
          dueDate.setHours(0, 0, 0, 0);

          // Include today's tasks and overdue tasks
          return dueDate <= today;
        })
        .slice(0, 5);
    });

    // Actions
    function addTask(task) {
      tasks.value.push({
        id: Date.now(),
        completed: false,
        ...task,
      });
    }

    function toggleTask(id) {
      const task = tasks.value.find((t) => t.id === id);
      if (task) {
        task.completed = !task.completed;

        // Award XP if completed
        if (task.completed) {
          task.completedAt = new Date().toISOString();
          const userStore = useUserStore();
          let xpAmount = 10; // Default / Rendah

          if (task.priority === "tinggi") xpAmount = 50;
          else if (task.priority === "sedang") xpAmount = 30;

          userStore.addXP(xpAmount);
        } else {
          delete task.completedAt;
        }
      }
    }

    function deleteTask(id) {
      tasks.value = tasks.value.filter((t) => t.id !== id);
    }

    return {
      tasks,
      pendingTasks,
      filteredTasks,
      todayTasks,
      addTask,
      toggleTask,
      deleteTask,
    };
  },
  {
    persist: true,
  }
);
