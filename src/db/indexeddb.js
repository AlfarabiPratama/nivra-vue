import Dexie from "dexie";

// Initialize Dexie database
export const db = new Dexie("nivra-db");

// Define database schema
db.version(1).stores({
  habits: "++id, title, type, createdAt, xp, frequency, icon",
  transactions: "++id, date, type, category, amount, description",
  todos: "++id, title, status, priority, dueDate, createdAt",
  journals: "++id, &date, mood, content, createdAt",
  books: "++id, title, author, status, progress, startDate, finishDate",
  meta: "", // Key-value store for user stats (XP, level, badges, streak)
});

// Helper functions for common operations
export const dbHelpers = {
  // ==================== HABITS ====================
  async getAllHabits() {
    return await db.habits.toArray();
  },

  async getHabitById(id) {
    return await db.habits.get(id);
  },

  async addHabit(habit) {
    return await db.habits.add({
      ...habit,
      createdAt: habit.createdAt || new Date(),
      completedDates: habit.completedDates || [],
    });
  },

  async updateHabit(id, updates) {
    return await db.habits.update(id, updates);
  },

  async deleteHabit(id) {
    return await db.habits.delete(id);
  },

  async getHabitsByFrequency(frequency) {
    return await db.habits.where("frequency").equals(frequency).toArray();
  },

  // ==================== TRANSACTIONS ====================
  async getAllTransactions() {
    return await db.transactions.orderBy("date").reverse().toArray();
  },

  async getTransactionsByDateRange(startDate, endDate) {
    return await db.transactions
      .where("date")
      .between(startDate, endDate, true, true)
      .toArray();
  },

  async getTransactionsByType(type) {
    return await db.transactions.where("type").equals(type).toArray();
  },

  async addTransaction(transaction) {
    return await db.transactions.add({
      ...transaction,
      date: transaction.date || new Date(),
    });
  },

  async updateTransaction(id, updates) {
    return await db.transactions.update(id, updates);
  },

  async deleteTransaction(id) {
    return await db.transactions.delete(id);
  },

  async getTotalByType(type) {
    const transactions = await db.transactions
      .where("type")
      .equals(type)
      .toArray();
    return transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
  },

  // ==================== TODOS ====================
  async getAllTodos() {
    return await db.todos.toArray();
  },

  async getTodosByStatus(status) {
    return await db.todos.where("status").equals(status).toArray();
  },

  async addTodo(todo) {
    return await db.todos.add({
      ...todo,
      createdAt: todo.createdAt || new Date(),
      status: todo.status || "pending",
    });
  },

  async updateTodo(id, updates) {
    return await db.todos.update(id, updates);
  },

  async deleteTodo(id) {
    return await db.todos.delete(id);
  },

  async toggleTodoStatus(id) {
    const todo = await db.todos.get(id);
    if (todo) {
      const newStatus = todo.status === "completed" ? "pending" : "completed";
      return await db.todos.update(id, { status: newStatus });
    }
  },

  // ==================== JOURNALS ====================
  async getAllJournals() {
    return await db.journals.orderBy("date").reverse().toArray();
  },

  async getJournalByDate(date) {
    // Expects ISO date string (YYYY-MM-DD)
    return await db.journals.get({ date });
  },

  async addJournal(journal) {
    return await db.journals.add({
      ...journal,
      createdAt: journal.createdAt || new Date(),
    });
  },

  async updateJournal(id, updates) {
    return await db.journals.update(id, updates);
  },

  async deleteJournal(id) {
    return await db.journals.delete(id);
  },

  // ==================== BOOKS (Reading Tracker) ====================
  async getAllBooks() {
    return await db.books.toArray();
  },

  async getBooksByStatus(status) {
    return await db.books.where("status").equals(status).toArray();
  },

  async addBook(book) {
    return await db.books.add({
      ...book,
      progress: book.progress || 0,
      status: book.status || "want-to-read",
    });
  },

  async updateBook(id, updates) {
    return await db.books.update(id, updates);
  },

  async deleteBook(id) {
    return await db.books.delete(id);
  },

  // ==================== META (User Stats) ====================
  async getMeta(key) {
    return await db.meta.get(key);
  },

  async setMeta(key, value) {
    return await db.meta.put({ key, value }, key);
  },

  async deleteMeta(key) {
    return await db.meta.delete(key);
  },

  async getAllMeta() {
    return await db.meta.toArray();
  },

  // ==================== BACKUP & RESTORE ====================
  async exportData() {
    const data = {
      habits: await db.habits.toArray(),
      transactions: await db.transactions.toArray(),
      todos: await db.todos.toArray(),
      journals: await db.journals.toArray(),
      books: await db.books.toArray(),
      meta: await db.meta.toArray(),
      exportDate: new Date().toISOString(),
      version: db.verno,
    };
    return data;
  },

  async importData(data) {
    // Clear existing data
    await db.habits.clear();
    await db.transactions.clear();
    await db.todos.clear();
    await db.journals.clear();
    await db.books.clear();
    await db.meta.clear();

    // Import new data
    if (data.habits) await db.habits.bulkAdd(data.habits);
    if (data.transactions) await db.transactions.bulkAdd(data.transactions);
    if (data.todos) await db.todos.bulkAdd(data.todos);
    if (data.journals) await db.journals.bulkAdd(data.journals);
    if (data.books) await db.books.bulkAdd(data.books);
    if (data.meta) await db.meta.bulkAdd(data.meta);

    return true;
  },

  async clearAllData() {
    await db.habits.clear();
    await db.transactions.clear();
    await db.todos.clear();
    await db.journals.clear();
    await db.books.clear();
    await db.meta.clear();
  },
};
