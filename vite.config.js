import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig } from "vite";
import vuetify from "vite-plugin-vuetify";

export default defineConfig({
  base: "/nivra-vue/", // GitHub Pages base path (repo name)
  plugins: [
    vue(),
    vuetify({ autoImport: true }), // Enabled by default
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8080,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core vendor chunks
          vendor: ["vue", "vue-router", "pinia"],
          vuetify: ["vuetify"],

          // Chart libraries (heavy)
          chartjs: ["chart.js", "vue-chartjs"],

          // Date utilities (used across multiple views)
          "date-utils": ["date-fns"],

          // Persistence
          persistence: ["dexie", "idb", "pinia-plugin-persistedstate"],
        },
      },
    },
    // Optimize chunk sizes
    chunkSizeWarningLimit: 600,
    // Enable minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true,
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.js"],
    coverage: {
      reporter: ["text", "html"],
      include: ["src/**/*.{js,vue}"],
      exclude: ["src/main.js"],
    },
  },
});
