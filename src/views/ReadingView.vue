<script setup>
import { useReadingStore } from "@/store/readingStore";
import { computed, ref } from "vue";

const readingStore = useReadingStore();
const searchQuery = ref("");
const showAddDialog = ref(false);

const newBook = ref({
  title: "",
  author: "",
  cover: "",
  totalPages: 0,
});

const books = computed(() => {
  if (!searchQuery.value) return readingStore.books;
  return readingStore.books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const saveBook = () => {
  if (newBook.value.title && newBook.value.author && newBook.value.totalPages) {
    readingStore.addBook({
      ...newBook.value,
      cover:
        newBook.value.cover ||
        "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80", // Default cover
    });
    showAddDialog.value = false;
    // Reset form
    newBook.value = {
      title: "",
      author: "",
      cover: "",
      totalPages: 0,
    };
  }
};
</script>

<template>
  <v-container fluid class="pa-6 bg-background h-100">
    <!-- Header -->
    <v-row align="center" class="mb-6">
      <v-col cols="12" md="4">
        <h1 class="text-h4 font-weight-bold">Daftar Bacaan</h1>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          label="Cari buku..."
          variant="outlined"
          density="compact"
          hide-details
          rounded="lg"
          bg-color="surface"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4" class="text-right">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          height="44"
          rounded="lg"
          @click="showAddDialog = true"
        >
          Tambah Buku
        </v-btn>
      </v-col>
    </v-row>

    <!-- Reading List Grid -->
    <v-row>
      <v-col v-for="book in books" :key="book.id" cols="12" md="6" lg="4">
        <v-card class="rounded-xl pa-0 d-flex" color="surface" elevation="0">
          <v-img
            :src="book.cover"
            width="100"
            height="140"
            cover
            class="rounded-s-xl"
          ></v-img>
          <div class="pa-4 flex-grow-1 d-flex flex-column justify-center">
            <div class="text-h6 font-weight-bold">{{ book.title }}</div>
            <div class="text-body-2 text-grey mb-4">{{ book.author }}</div>
            <div class="d-flex justify-space-between text-caption mb-1">
              <span>Progres</span>
              <span>{{ book.progress }}%</span>
            </div>
            <v-progress-linear
              :model-value="book.progress"
              color="primary"
              height="6"
              rounded
              bg-color="surface-variant"
            ></v-progress-linear>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add Book Dialog -->
    <v-dialog v-model="showAddDialog" max-width="500">
      <v-card class="rounded-xl pa-4">
        <v-card-title class="text-h5 font-weight-bold mb-4">
          Tambah Buku Baru
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newBook.title"
            label="Judul Buku"
            variant="outlined"
            class="mb-2"
          ></v-text-field>
          <v-text-field
            v-model="newBook.author"
            label="Penulis"
            variant="outlined"
            class="mb-2"
          ></v-text-field>
          <v-text-field
            v-model="newBook.totalPages"
            label="Total Halaman"
            type="number"
            variant="outlined"
            class="mb-2"
          ></v-text-field>
          <v-text-field
            v-model="newBook.cover"
            label="URL Cover (Opsional)"
            variant="outlined"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="showAddDialog = false">Batal</v-btn>
          <v-btn color="primary" variant="flat" @click="saveBook">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
