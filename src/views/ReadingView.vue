<script setup>
import { ref } from "vue";

const searchQuery = ref("");

// Mock data for reading list
const books = ref([
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    cover:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    progress: 60,
  },
  {
    id: 2,
    title: "Dune",
    author: "Frank Herbert",
    cover:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    progress: 25,
  },
]);
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
        <v-btn color="primary" prepend-icon="mdi-plus" height="44" rounded="lg">
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
  </v-container>
</template>
