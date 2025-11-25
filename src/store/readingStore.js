import { defineStore } from "pinia";
import { ref } from "vue";

export const useReadingStore = defineStore(
  "reading",
  () => {
    const books = ref([
      {
        id: 1,
        title: "Atomic Habits",
        author: "James Clear",
        cover:
          "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        progress: 60,
        totalPages: 320,
        currentPage: 192,
      },
      {
        id: 2,
        title: "Dune",
        author: "Frank Herbert",
        cover:
          "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        progress: 25,
        totalPages: 412,
        currentPage: 103,
      },
    ]);

    const addBook = (book) => {
      books.value.push({
        id: Date.now(),
        progress: 0,
        currentPage: 0,
        ...book,
      });
    };

    const deleteBook = (id) => {
      books.value = books.value.filter((book) => book.id !== id);
    };

    const updateProgress = (id, currentPage) => {
      const book = books.value.find((b) => b.id === id);
      if (book) {
        book.currentPage = currentPage;
        book.progress = Math.round((currentPage / book.totalPages) * 100);
      }
    };

    return {
      books,
      addBook,
      deleteBook,
      updateProgress,
    };
  },
  {
    persist: true,
  }
);
