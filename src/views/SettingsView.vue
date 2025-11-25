<template>
  <div class="view-container">
    <h2>Pengaturan</h2>

    <!-- Theme Settings -->
    <div class="card">
      <h3>Tampilan & Tema</h3>
      <div class="themes-grid">
        <div
          v-for="t in themeOptions"
          :key="t.value"
          class="theme-option"
          :class="{ active: currentTheme === t.value }"
          @click="setTheme(t.value)"
        >
          <div class="theme-preview" :style="{ background: t.color }">
            <div class="theme-check" v-if="currentTheme === t.value">
              <v-icon icon="mdi-check" color="white"></v-icon>
            </div>
          </div>
          <span class="theme-name">{{ t.label }}</span>
        </div>
      </div>
    </div>

    <!-- Navigation Settings -->
    <div class="card">
      <h3>Navigasi</h3>
      <div class="setting-item">
        <label class="setting-label">
          <span>Item Navigasi Bawah (Mobile)</span>
        </label>
        <div class="nav-size-options">
          <button
            v-for="size in [4, 5, 6]"
            :key="size"
            class="size-btn"
            :class="{ active: bottomNavSize === size }"
            @click="setBottomNavSize(size)"
          >
            {{ size }} item
          </button>
        </div>
      </div>
    </div>

    <!-- Data Management -->
    <div class="card">
      <h3>Manajemen Data</h3>
      <p class="setting-desc mb-4">
        Simpan data Anda secara lokal atau pindahkan ke perangkat lain.
      </p>

      <div class="d-flex gap-3 flex-wrap">
        <v-btn
          color="primary"
          prepend-icon="mdi-download"
          variant="flat"
          @click="handleExport"
        >
          Backup Data (JSON)
        </v-btn>

        <v-btn
          color="secondary"
          prepend-icon="mdi-upload"
          variant="tonal"
          @click="triggerImport"
        >
          Restore Data
        </v-btn>
        <input
          type="file"
          ref="fileInput"
          accept=".json"
          style="display: none"
          @change="handleImport"
        />
      </div>
    </div>

    <!-- About -->
    <div class="card">
      <h3>Tentang</h3>
      <div class="d-flex align-center mb-2">
        <v-img
          src="/icons/icon-192x192.png"
          width="48"
          height="48"
          class="mr-3 rounded-lg"
        ></v-img>
        <div>
          <h4 class="text-h6 font-weight-bold">Nivra</h4>
          <p class="text-caption text-medium-emphasis">
            PWA Produktivitas Pribadi v0.1.0
          </p>
        </div>
      </div>
      <p class="text-body-2 text-medium-emphasis mt-2">
        Dibuat dengan ❤️ menggunakan Vue 3 & Vuetify.
      </p>
    </div>

    <!-- Restore Confirmation Dialog -->
    <v-dialog v-model="showRestoreDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5 font-weight-bold"
          >Konfirmasi Restore</v-card-title
        >
        <v-card-text>
          Tindakan ini akan <strong>menimpa</strong> semua data yang ada saat
          ini dengan data dari file backup. Apakah Anda yakin ingin melanjutkan?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showRestoreDialog = false">Batal</v-btn>
          <v-btn color="error" variant="flat" @click="confirmRestore"
            >Ya, Restore Data</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Tutup</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { useFinanceStore } from "@/store/financeStore";
import { useHabitStore } from "@/store/habitStore";
import { useJournalStore } from "@/store/journalStore";
import { useTodoStore } from "@/store/todoStore";
import { useUserStore } from "@/store/userStore";
import { useFocusStore } from "@/store/focusStore";
import { onMounted, ref } from "vue";
import { useTheme } from "vuetify";
import {
  exportAllData,
  downloadJSON,
  readJSONFile,
  importAllData,
  validateImportData,
} from "@/utils/dataBackup";

const theme = useTheme();
const userStore = useUserStore();
const todoStore = useTodoStore();
const habitStore = useHabitStore();
const financeStore = useFinanceStore();
const journalStore = useJournalStore();
const focusStore = useFocusStore();

const currentTheme = ref("ocean");
const bottomNavSize = ref(5);
const fileInput = ref(null);
const showRestoreDialog = ref(false);
const pendingImportData = ref(null);

const snackbar = ref({
  show: false,
  message: "",
  color: "success",
});

const themeOptions = [
  { value: "ocean", label: "Ocean Mist", color: "#3B82F6" },
  { value: "forest", label: "Forest Whisper", color: "#2E7D32" },
  { value: "sunset", label: "Golden Hour", color: "#E64A19" },
  { value: "midnight", label: "Midnight", color: "#0F172A" },
];

const setTheme = (themeName) => {
  currentTheme.value = themeName;
  theme.global.name.value = themeName;
  localStorage.setItem("selectedTheme", themeName);
};

const setBottomNavSize = (size) => {
  bottomNavSize.value = size;
  localStorage.setItem("bottomNavSize", size);
};

// Enhanced Backup Logic with validation
const handleExport = () => {
  try {
    const data = exportAllData();
    downloadJSON(data);
    showSnackbar("✅ Backup berhasil diunduh!", "success");
  } catch (error) {
    console.error("Export error:", error);
    showSnackbar("❌ Gagal membuat backup: " + error.message, "error");
  }
};

// Restore Logic
const triggerImport = () => {
  fileInput.value.click();
};

// Enhanced Restore Logic with validation
const handleImport = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const data = await readJSONFile(file);

    // Validate data structure
    const validation = validateImportData(data);
    if (!validation.valid) {
      showSnackbar(
        "❌ File tidak valid: " + validation.errors.join(", "),
        "error"
      );
      event.target.value = "";
      return;
    }

    // Store for confirmation
    pendingImportData.value = data;
    showRestoreDialog.value = true;
  } catch (error) {
    console.error("Import error:", error);
    showSnackbar("❌ Gagal membaca file: " + error.message, "error");
  }

  // Reset input
  event.target.value = "";
};

const confirmRestore = async () => {
  if (pendingImportData.value) {
    try {
      await importAllData(pendingImportData.value);

      showSnackbar("✅ Data berhasil dipulihkan!", "success");
      showRestoreDialog.value = false;
      pendingImportData.value = null;

      // Reload page to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Restore error:", error);
      showSnackbar("❌ Gagal memulihkan data: " + error.message, "error");
    }
  }
};

const showSnackbar = (msg, color = "success") => {
  snackbar.value = {
    show: true,
    message: msg,
    color: color,
  };
};

onMounted(() => {
  const savedTheme = localStorage.getItem("selectedTheme");
  if (savedTheme) {
    currentTheme.value = savedTheme;
    theme.global.name.value = savedTheme;
  }

  const savedNavSize = localStorage.getItem("bottomNavSize");
  if (savedNavSize) {
    bottomNavSize.value = parseInt(savedNavSize);
  }
});
</script>

<style scoped>
.card h3 {
  margin-top: 0;
  margin-bottom: 16px;
  color: rgb(var(--v-theme-primary));
  font-size: 1.1rem;
  font-weight: 700;
}

.themes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 16px;
}

.theme-option {
  cursor: pointer;
  text-align: center;
}

.theme-preview {
  height: 60px;
  border-radius: 16px;
  margin-bottom: 8px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-option:hover .theme-preview {
  transform: translateY(-4px);
}

.theme-option.active .theme-preview {
  ring: 2px solid rgb(var(--v-theme-primary));
  transform: scale(1.05);
}

.theme-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.setting-item {
  margin-bottom: 20px;
}

.setting-label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: rgb(var(--v-theme-on-surface));
}

.setting-desc {
  font-size: 0.9rem;
  color: rgb(var(--v-theme-medium-emphasis));
  line-height: 1.5;
}

.nav-size-options {
  display: flex;
  gap: 8px;
}

.size-btn {
  padding: 8px 16px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.size-btn:hover {
  background: rgba(var(--v-theme-primary), 0.05);
}

.size-btn.active {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  border-color: rgb(var(--v-theme-primary));
}
</style>
