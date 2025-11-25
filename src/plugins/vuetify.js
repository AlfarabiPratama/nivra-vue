// src/plugins/vuetify.js

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi", // This is already the default value - only for display purposes
  },
  theme: {
    defaultTheme: "dark",
    themes: {
      light: {
        dark: false,
        colors: {
          // Ocean Mist Light Theme - Refined
          background: "#F0F4F8", // Soft cool gray-blue
          surface: "#FFFFFF", // Pure white for crisp contrast
          "surface-soft": "#F7F9FB", // Softer white for cards
          "surface-light": "#F8FAFC", // Very light blue-gray
          "surface-variant": "#E2E8F0", // Borders/Dividers
          primary: "#3B82F6", // Ocean Blue for primary actions
          secondary: "#5FAF8B", // Mint Green (Ocean Mist)
          accent: "#F59E0B", // Warm Gold for gamification
          error: "#EF4444",
          info: "#3B82F6",
          success: "#10B981", // Vibrant Green
          warning: "#F59E0B",
          // Text colors
          "on-background": "#1E293B", // Slate 800
          "on-surface": "#334155", // Slate 700
          "on-primary": "#FFFFFF",
        },
      },
      dark: {
        dark: true,
        colors: {
          // Ocean Mist Dark Theme - Refined
          background: "#0F172A", // Deep Ocean
          surface: "#1E293B", // Slate 800
          "surface-light": "#334155", // Slate 700
          "surface-variant": "#475569", // Slate 600
          primary: "#60A5FA", // Lighter Blue
          secondary: "#5FAF8B", // Mint Green
          accent: "#FBBF24", // Bright Amber
          error: "#F87171",
          info: "#60A5FA",
          success: "#34D399",
          warning: "#FBBF24",
          // Text colors
          "on-background": "#F1F5F9", // Slate 100
          "on-surface": "#E2E8F0", // Slate 200
          "on-primary": "#0F172A",
        },
      },
    },
  },
});
