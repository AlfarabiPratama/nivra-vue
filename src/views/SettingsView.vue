<template>
  <div class="view-container">
    <h2>Pengaturan</h2>

    <div class="card">
      <h3>Tampilan</h3>
      <div class="setting-item">
        <label class="setting-label">
          <input type="checkbox" v-model="darkMode" @change="toggleTheme" />
          <span>Mode Gelap</span>
        </label>
      </div>
    </div>

    <div class="card">
      <h3>Navigasi</h3>
      <div class="setting-item">
        <label class="setting-label">
          <span>Ukuran Sidebar (Desktop)</span>
        </label>
        <p class="setting-desc">
          Klik tombol « di tepi sidebar untuk menyembunyikan/menampilkan
        </p>
      </div>

      <div class="setting-item">
        <label class="setting-label">
          <span>Item Navigasi Bawah (Mobile)</span>
        </label>
        <div class="nav-size-options">
          <button
            v-for="size in [4, 5, 6]"
            :key="size"
            class="size-btn"
            :class="{ active: bottomNavSize === size }"
            @click="setBottomNavSize(size)"
          >
            {{ size }} item
          </button>
        </div>
      </div>
    </div>

    <div class="card">
      <h3>Tentang</h3>
      <p><strong>Nivra</strong> - PWA Produktivitas Pribadi</p>
      <p style="color: #666; font-size: 0.9rem">Versi 0.1.0</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();
const darkMode = ref(false);
const bottomNavSize = ref(5);

const toggleTheme = () => {
  theme.global.name.value = darkMode.value ? "dark" : "light";
  localStorage.setItem("darkMode", darkMode.value);
};

const setBottomNavSize = (size) => {
  bottomNavSize.value = size;
  localStorage.setItem("bottomNavSize", size);
};

onMounted(() => {
  const savedTheme = localStorage.getItem("darkMode");
  if (savedTheme === "true") {
    darkMode.value = true;
    theme.global.name.value = "dark";
  }

  const savedNavSize = localStorage.getItem("bottomNavSize");
  if (savedNavSize) {
    bottomNavSize.value = parseInt(savedNavSize);
  }
});
</script>

<style scoped>
.card h3 {
  margin-top: 0;
  margin-bottom: 16px;
  color: var(--primary);
  font-size: 1.1rem;
}

.setting-item {
  margin-bottom: 20px;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-weight: 500;
}

.setting-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.setting-desc {
  margin: 8px 0 0 0;
  font-size: 0.85rem;
  color: #666;
}

.nav-size-options {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.size-btn {
  padding: 8px 16px;
  border: 2px solid var(--primary);
  background: transparent;
  color: var(--primary);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.size-btn:hover {
  background: rgba(155, 137, 179, 0.1);
}

.size-btn.active {
  background: var(--primary);
  color: white;
}
</style>
