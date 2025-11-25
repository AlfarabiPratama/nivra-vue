/**
 * Data Export/Import Utilities
 * Handle backup and restore of all user data
 */

import { useUserStore } from "@/store/userStore";
import { useHabitStore } from "@/store/habitStore";
import { useTodoStore } from "@/store/todoStore";
import { useFinanceStore } from "@/store/financeStore";
import { useJournalStore } from "@/store/journalStore";
import { useFocusStore } from "@/store/focusStore";

/**
 * Export all application data to JSON
 * @returns {Object} Complete data export
 */
export const exportAllData = () => {
  const userStore = useUserStore();
  const habitStore = useHabitStore();
  const todoStore = useTodoStore();
  const financeStore = useFinanceStore();
  const journalStore = useJournalStore();
  const focusStore = useFocusStore();

  const exportData = {
    version: "1.0.0",
    exportDate: new Date().toISOString(),
    appName: "Nivra",

    // User data
    user: userStore.getUserData(),

    // Feature data
    habits: habitStore.getUserData(),
    todos: todoStore.getUserData(),
    finance: financeStore.getUserData(),
    journal: journalStore.getUserData(),
    focus: focusStore.getUserData(),
  };

  return exportData;
};

/**
 * Download data as JSON file
 * @param {Object} data - Data to export
 * @param {string} filename - Optional filename
 */
export const downloadJSON = (data, filename = null) => {
  const defaultFilename = `nivra-backup-${
    new Date().toISOString().split("T")[0]
  }.json`;
  const finalFilename = filename || defaultFilename;

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = finalFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

/**
 * Validate imported data structure
 * @param {Object} data - Imported data
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export const validateImportData = (data) => {
  const errors = [];

  // Check required fields
  if (!data.version) errors.push("Missing version field");
  if (!data.appName || data.appName !== "Nivra")
    errors.push("Invalid app data");
  if (!data.exportDate) errors.push("Missing export date");

  // Check data sections exist
  if (!data.user) errors.push("Missing user data");
  if (!data.habits) errors.push("Missing habits data");
  if (!data.todos) errors.push("Missing todos data");
  if (!data.finance) errors.push("Missing finance data");
  if (!data.journal) errors.push("Missing journal data");
  if (!data.focus) errors.push("Missing focus data");

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Import and restore all data
 * @param {Object} data - Import data
 * @returns {Promise<boolean>} Success status
 */
export const importAllData = async (data) => {
  // Validate first
  const validation = validateImportData(data);
  if (!validation.valid) {
    throw new Error(`Invalid data: ${validation.errors.join(", ")}`);
  }

  try {
    const userStore = useUserStore();
    const habitStore = useHabitStore();
    const todoStore = useTodoStore();
    const financeStore = useFinanceStore();
    const journalStore = useJournalStore();
    const focusStore = useFocusStore();

    // Restore each store
    if (data.user) userStore.loadUserData(data.user);
    if (data.habits) habitStore.loadUserData(data.habits);
    if (data.todos) todoStore.loadUserData(data.todos);
    if (data.finance) financeStore.loadUserData(data.finance);
    if (data.journal) journalStore.loadUserData(data.journal);
    if (data.focus) focusStore.loadUserData(data.focus);

    return true;
  } catch (error) {
    console.error("Import failed:", error);
    throw error;
  }
};

/**
 * Read JSON file from input
 * @param {File} file - File object
 * @returns {Promise<Object>} Parsed JSON data
 */
export const readJSONFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (error) {
        reject(new Error("Invalid JSON file"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
};
