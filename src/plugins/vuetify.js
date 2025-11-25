// src/plugins/vuetify.js

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  icons: {
    defaultSet: "mdi", // This is already the default value - only for display purposes
  },
  theme: {
    defaultTheme: "ocean",
    themes: {
      ocean: {
        dark: false,
        colors: {
          background: "#F0F4F8",
          surface: "#FFFFFF",
          "surface-soft": "#F7F9FB",
          "surface-light": "#F8FAFC",
          "surface-variant": "#E2E8F0",
          primary: "#202238", // Dark Navy
          secondary: "#EC7E39", // Fox Orange
          accent: "#EC7E39", // Fox Orange
          error: "#EF4444",
          info: "#202238", // Dark Navy
          success: "#10B981",
          warning: "#F59E0B",
          "on-background": "#1E293B",
          "on-surface": "#334155",
          "on-primary": "#FFFFFF",
        },
      },
      forest: {
        dark: false,
        colors: {
          background: "#F1F8F4",
          surface: "#FFFFFF",
          "surface-soft": "#F6FBF8",
          "surface-light": "#E8F5E9",
          "surface-variant": "#C8E6C9",
          primary: "#2E7D32", // Forest Green
          secondary: "#8D6E63", // Earthy Brown
          accent: "#FFD54F", // Sunlight Yellow
          error: "#D32F2F",
          info: "#0288D1",
          success: "#388E3C",
          warning: "#FBC02D",
          "on-background": "#1B5E20",
          "on-surface": "#2E7D32",
          "on-primary": "#FFFFFF",
        },
      },
      sunset: {
        dark: false,
        colors: {
          background: "#FFF3E0",
          surface: "#FFFFFF",
          "surface-soft": "#FFF8E1",
          "surface-light": "#FFE0B2",
          "surface-variant": "#FFCC80",
          primary: "#E64A19", // Deep Orange
          secondary: "#FBC02D", // Sunset Yellow
          accent: "#5D4037", // Warm Brown
          error: "#C62828",
          info: "#1976D2",
          success: "#388E3C",
          warning: "#FFA000",
          "on-background": "#BF360C",
          "on-surface": "#E64A19",
          "on-primary": "#FFFFFF",
        },
      },
      midnight: {
        dark: true,
        colors: {
          background: "#0F172A",
          surface: "#1E293B",
          "surface-soft": "#334155",
          "surface-light": "#475569",
          "surface-variant": "#64748B",
          primary: "#60A5FA",
          secondary: "#5FAF8B",
          accent: "#FBBF24",
          error: "#F87171",
          info: "#60A5FA",
          success: "#34D399",
          warning: "#FBBF24",
          "on-background": "#F1F5F9",
          "on-surface": "#E2E8F0",
          "on-primary": "#0F172A",
        },
      },
    },
  },
});
