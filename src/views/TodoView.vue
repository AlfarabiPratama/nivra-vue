<template>
  <v-container fluid class="pa-4 pa-md-8 h-100 bg-background">
    <v-row class="h-100">
      <!-- Sidebar Filter (Desktop) -->
      <v-col cols="12" md="3" class="d-none d-md-block">
        <v-card class="ocean-card h-100 pa-4" elevation="0">
          <v-btn
            block
            color="primary"
            class="mb-6 font-weight-bold"
            prepend-icon="mdi-plus"
            height="48"
            rounded="lg"
            @click="showAddDialog = true"
          >
            Tambah Tugas
          </v-btn>

          <div
            class="text-subtitle-2 text-medium-emphasis mb-2 font-weight-bold"
          >
            Filter
          </div>
          <v-list density="compact" nav class="bg-transparent">
            <v-list-item
              v-for="item in filters"
              :key="item.value"
              :value="item.value"
              :title="item.title"
              :prepend-icon="item.icon"
              rounded="lg"
              :active="currentFilter === item.value"
              @click="currentFilter = item.value"
              color="primary"
              class="mb-1"
            >
              <template v-slot:append v-if="item.count > 0">
                <v-badge
                  :content="item.count"
                  color="surface-variant"
                  inline
                ></v-badge>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Main Task List -->
      <v-col cols="12" md="9">
        <div class="d-flex justify-space-between align-center mb-6">
          <div>
            <h1 class="text-h4 font-weight-black text-on-background">Tugas</h1>
            <p class="text-body-1 text-medium-emphasis">
              Anda memiliki {{ todoStore.pendingTasks }} tugas tertunda
            </p>
          </div>
          <v-btn
            class="d-md-none"
            color="primary"
            icon="mdi-plus"
            @click="showAddDialog = true"
          ></v-btn>
        </div>

        <!-- Filter Chips (Mobile) -->
        <div class="d-md-none mb-4 overflow-x-auto d-flex gap-2 pb-2">
          <v-chip
            v-for="item in filters"
            :key="item.value"
            :color="currentFilter === item.value ? 'primary' : 'default'"
            variant="flat"
            @click="currentFilter = item.value"
          >
            {{ item.title }}
          </v-chip>
        </div>

        <!-- Task List -->
        <div v-if="filteredTasks.length > 0">
          <transition-group name="list" tag="div">
            <v-card
              v-for="task in filteredTasks"
              :key="task.id"
              class="ocean-card mb-3 pa-4 d-flex align-center"
              :class="{ 'task-completed': task.completed }"
              elevation="0"
            >
              <v-checkbox-btn
                :model-value="task.completed"
                @update:model-value="todoStore.toggleTask(task.id)"
                color="secondary"
                class="mr-4"
              ></v-checkbox-btn>

              <div class="flex-grow-1">
                <div
                  class="text-h6 font-weight-bold"
                  :class="{
                    'text-decoration-line-through text-medium-emphasis':
                      task.completed,
                  }"
                >
                  {{ task.title }}
                </div>
                <div class="d-flex align-center mt-1 gap-3 flex-wrap">
                  <v-chip
                    size="x-small"
                    :color="getCategoryColor(task.category)"
                    variant="tonal"
                    class="font-weight-bold"
                  >
                    {{ task.category }}
                  </v-chip>
                  <div
                    class="text-caption text-medium-emphasis d-flex align-center"
                  >
                    <v-icon
                      icon="mdi-calendar"
                      size="small"
                      class="mr-1"
                    ></v-icon>
                    {{ formatDate(task.dueDate) }}
                  </div>
                  <v-icon
                    v-if="task.priority === 'tinggi'"
                    icon="mdi-flag"
                    color="error"
                    size="small"
                  ></v-icon>
                </div>
              </div>

              <v-btn
                icon="mdi-delete"
                variant="text"
                color="error"
                size="small"
                class="hover-visible"
                @click="todoStore.deleteTask(task.id)"
              ></v-btn>
            </v-card>
          </transition-group>
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="d-flex flex-column align-center justify-center py-12 text-center"
        >
          <v-img
            src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png"
            width="200"
            class="mb-6 grayscale opacity-50"
          ></v-img>
          <h3 class="text-h5 font-weight-bold text-medium-emphasis">
            Tidak ada tugas ditemukan
          </h3>
          <p class="text-body-2 text-disabled">
            Nikmati waktu luang Anda atau tambahkan tugas baru!
          </p>
        </div>
      </v-col>
    </v-row>

    <!-- Add Task Dialog -->
    <v-dialog v-model="showAddDialog" max-width="500">
      <v-card class="rounded-xl pa-4">
        <v-card-title class="text-h5 font-weight-bold"
          >Tambah Tugas Baru</v-card-title
        >
        <v-card-text>
          <v-text-field
            v-model="newTask.title"
            label="Judul Tugas"
            variant="outlined"
            rounded="lg"
            class="mb-2"
          ></v-text-field>
          <v-select
            v-model="newTask.category"
            :items="['Pekerjaan', 'Pribadi', 'Belanja', 'Kesehatan']"
            label="Kategori"
            variant="outlined"
            rounded="lg"
            class="mb-2"
          ></v-select>
          <v-select
            v-model="newTask.priority"
            :items="['rendah', 'sedang', 'tinggi']"
            label="Prioritas"
            variant="outlined"
            rounded="lg"
            class="mb-2"
          ></v-select>
          <v-text-field
            v-model="newTask.dueDate"
            label="Tenggat Waktu"
            type="date"
            variant="outlined"
            rounded="lg"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showAddDialog = false">Batal</v-btn>
          <v-btn color="primary" variant="flat" rounded="lg" @click="addTask"
            >Tambah Tugas</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import { useTodoStore } from "../store/todoStore";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const todoStore = useTodoStore();
const showAddDialog = ref(false);
const currentFilter = ref("all");

const newTask = ref({
  title: "",
  category: "Pribadi",
  priority: "sedang",
  dueDate: new Date().toISOString().split("T")[0],
});

const filters = computed(() => [
  {
    title: "Semua Tugas",
    value: "all",
    icon: "mdi-tray-full",
    count: todoStore.tasks.length,
  },
  {
    title: "Hari Ini",
    value: "today",
    icon: "mdi-calendar-today",
    count: todoStore.filteredTasks("today").length,
  },
  {
    title: "Penting",
    value: "important",
    icon: "mdi-alert-circle",
    count: todoStore.filteredTasks("important").length,
  },
  {
    title: "Selesai",
    value: "completed",
    icon: "mdi-check-circle",
    count: todoStore.filteredTasks("completed").length,
  },
]);

const filteredTasks = computed(() => {
  return todoStore.filteredTasks(currentFilter.value);
});

const addTask = () => {
  if (newTask.value.title) {
    todoStore.addTask(newTask.value);
    showAddDialog.value = false;
    newTask.value.title = ""; // Reset
  }
};

const getCategoryColor = (category) => {
  const colors = {
    Pekerjaan: "primary",
    Pribadi: "success",
    Belanja: "warning",
    Kesehatan: "error",
  };
  return colors[category] || "grey";
};

const formatDate = (dateStr) => {
  return format(new Date(dateStr), "d MMM", { locale: id });
};
</script>

<style scoped>
.ocean-card {
  background: rgb(var(--v-theme-surface));
  border-radius: 16px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
  transition: all 0.2s ease;
}

.active-filter {
  background-color: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
}

.task-completed {
  opacity: 0.7;
  background-color: rgba(var(--v-theme-surface-variant), 0.1);
}

.gap-2 {
  gap: 8px;
}
.gap-3 {
  gap: 12px;
}

.hover-visible {
  opacity: 0;
  transition: opacity 0.2s;
}
.ocean-card:hover .hover-visible {
  opacity: 1;
}

.grayscale {
  filter: grayscale(100%);
}

/* List Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
