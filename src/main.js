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

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/src/service-worker.js") // Note: In production, this path might change depending on build
      .then((reg) => console.log("SW registered!", reg))
      .catch((err) => console.log("SW registration failed", err));
  });
}

// Request Notification Permission
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}
