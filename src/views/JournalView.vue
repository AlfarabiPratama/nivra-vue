<template>
  <v-container fluid class="pa-4 pa-md-8 h-100 bg-background">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-black text-on-background">Jurnal</h1>
        <p class="text-body-1 text-medium-emphasis">
          Catat pikiran dan perasaan Anda
        </p>
      </div>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        rounded="lg"
        elevation="2"
        @click="showAddDialog = true"
      >
        Entri Baru
      </v-btn>
    </div>

    <!-- Mood Tracker Chart -->
    <v-row class="mb-6">
      <v-col cols="12" md="10" lg="8" class="mx-auto">
        <v-card class="ocean-card pa-4" elevation="0">
          <h3 class="text-h6 font-weight-bold mb-4">
            Pelacak Mood (14 Hari Terakhir)
          </h3>
          <MoodChart :entries="journalStore.entries" />
        </v-card>
      </v-col>
    </v-row>

    <!-- Timeline Layout -->
    <v-row>
      <v-col cols="12" md="8" class="mx-auto">
        <v-timeline
          side="end"
          align="start"
          line-color="primary"
          density="comfortable"
        >
          <v-timeline-item
            v-for="entry in journalStore.sortedEntries"
            :key="entry.id"
            :dot-color="getMoodColor(entry.mood)"
            size="small"
            width="100%"
          >
            <template v-slot:opposite>
              <div
                class="text-caption text-medium-emphasis font-weight-bold pt-1"
              >
                {{ formatDate(entry.date) }}
              </div>
            </template>

            <v-card class="ocean-card pa-4 mb-4" elevation="0">
              <div class="d-flex justify-space-between align-start mb-2">
                <h3 class="text-h6 font-weight-bold">{{ entry.title }}</h3>
                <div class="text-h4">{{ getMoodEmoji(entry.mood) }}</div>
              </div>
              <p
                class="text-body-1 text-medium-emphasis"
                style="white-space: pre-line"
              >
                {{ entry.content }}
              </p>
            </v-card>
          </v-timeline-item>

          <div
            v-if="journalStore.entries.length === 0"
            class="text-center text-medium-emphasis py-8"
          >
            Belum ada entri jurnal. Mulailah menulis hari ini!
          </div>
        </v-timeline>
      </v-col>
    </v-row>

    <!-- Add Entry Dialog -->
    <v-dialog v-model="showAddDialog" max-width="600">
      <v-card class="ocean-card pa-4">
        <v-card-title class="text-h5 font-weight-bold mb-4">
          Entri Baru
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newEntry.title"
            label="Judul"
            variant="outlined"
            density="comfortable"
            class="mb-4"
          ></v-text-field>

          <div class="mb-4">
            <label
              class="text-caption font-weight-bold text-medium-emphasis mb-2 d-block"
            >
              Bagaimana perasaan Anda?
            </label>
            <div class="d-flex justify-space-between px-2">
              <div
                v-for="m in moods"
                :key="m.value"
                class="mood-btn cursor-pointer text-center"
                :class="{ 'mood-selected': newEntry.mood === m.value }"
                @click="newEntry.mood = m.value"
              >
                <div class="text-h3 mb-1">{{ m.emoji }}</div>
                <div class="text-caption text-capitalize">{{ m.value }}</div>
              </div>
            </div>
          </div>

          <v-textarea
            v-model="newEntry.content"
            label="Isi Jurnal"
            variant="outlined"
            rows="6"
            placeholder="Tuliskan pikiran Anda di sini..."
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showAddDialog = false">Batal</v-btn>
          <v-btn color="primary" variant="flat" @click="handleAddEntry">
            Simpan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useJournalStore } from "@/store/journalStore";
import MoodChart from "@/components/MoodChart.vue";

const journalStore = useJournalStore();
const showAddDialog = ref(false);

const newEntry = ref({
  title: "",
  content: "",
  mood: "happy",
});

const moods = [
  { value: "happy", emoji: "😊", color: "warning" },
  { value: "excited", emoji: "🤩", color: "accent" },
  { value: "calm", emoji: "😌", color: "info" },
  { value: "tired", emoji: "😴", color: "grey" },
  { value: "sad", emoji: "😢", color: "primary" },
  { value: "angry", emoji: "😠", color: "error" },
];

const getMoodColor = (moodValue) => {
  const mood = moods.find((m) => m.value === moodValue);
  return mood ? mood.color : "primary";
};

const getMoodEmoji = (moodValue) => {
  const mood = moods.find((m) => m.value === moodValue);
  return mood ? mood.emoji : "😐";
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const handleAddEntry = () => {
  if (newEntry.value.title && newEntry.value.content) {
    journalStore.addEntry(newEntry.value);
    showAddDialog.value = false;
    newEntry.value = { title: "", content: "", mood: "happy" };
  }
};
</script>

<style scoped>
.ocean-card {
  background: rgb(var(--v-theme-surface));
  border-radius: 20px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ocean-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.mood-btn {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  opacity: 0.6;
}
.mood-btn:hover {
  transform: scale(1.2);
  opacity: 1;
}
.mood-selected {
  transform: scale(1.3);
  opacity: 1;
}
</style>
