import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./styles/styles.scss";

// Import Vuetify
import vuetify from "./plugins/vuetify";

import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);
app.use(vuetify); // Use Vuetify

app.mount("#app");

// Enhanced Service Worker Registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js", {
        scope: "/",
      })
      .then((reg) => {
        console.log("[App] Service Worker registered successfully:", reg);

        // Check for updates periodically
        setInterval(() => {
          reg.update();
        }, 60000); // Check every 60 seconds
      })
      .catch((err) => {
        console.error("[App] Service Worker registration failed:", err);
      });
  });
}

// Request Notification Permission (for future notifications feature)
if ("Notification" in window && Notification.permission !== "granted") {
  // Don't ask immediately, wait for user interaction
  // Notification.requestPermission();
}
