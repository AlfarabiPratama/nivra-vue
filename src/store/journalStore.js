import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useUserStore } from "./userStore";

export const useJournalStore = defineStore(
  "journal",
  () => {
    // State
    const entries = ref([
      {
        id: 1,
        date: new Date().toISOString(),
        title: "Awal yang Produktif!",
        content:
          "Hari ini saya berhasil menyelesaikan semua tugas pagi saya. Rasanya sangat memuaskan bisa mencoret semua hal dari daftar tugas.",
        mood: "happy",
      },
      {
        id: 2,
        date: new Date(Date.now() - 86400000).toISOString(),
        title: "Sedikit Lelah tapi Bahagia",
        content:
          "Bekerja keras pada proyek baru. Cukup melelahkan, tapi kemajuannya terlihat nyata.",
        mood: "tired",
      },
      {
        id: 3,
        date: new Date(Date.now() - 172800000).toISOString(),
        title: "Ide Proyek Baru",
        content:
          "Mencetuskan beberapa ide untuk fitur aplikasi baru. Bersemangat untuk mulai coding.",
        mood: "excited",
      },
    ]);

    // Getters
    const sortedEntries = computed(() => {
      return [...entries.value].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    });

    // Actions
    function addEntry(entry) {
      entries.value.push({
        id: Date.now(),
        date: new Date().toISOString(),
        ...entry,
      });

      // Award XP for journaling
      const userStore = useUserStore();
      userStore.addXP(20); // 20 XP for self-reflection
    }

    function deleteEntry(id) {
      entries.value = entries.value.filter((e) => e.id !== id);
    }

    return {
      entries,
      sortedEntries,
      addEntry,
      deleteEntry,
    };
  },
  {
    persist: true,
  }
);
