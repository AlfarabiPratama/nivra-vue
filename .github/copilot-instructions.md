# Copilot Instructions for Nivra (Vue + Vite)

## Ringkasan Arsitektur

Proyek ini menggunakan **Vue 3**, **Vite**, **Pinia** (state management), **Vue Router**, **SCSS**, serta **IndexedDB** via paket `idb` untuk penyimpanan lokal dan fitur PWA (service worker + manifest). Belum ada setup testing otomatis saat ini.

### Struktur Folder Utama

- `src/main.js` – Entry point Vite + mount aplikasi.
- `src/App.vue` – Root component.
- `src/router/` – Definisi rute (`index.js`).
- `src/store/` – Store Pinia (contoh: `userStore.js`).
- `src/db/` – Abstraksi IndexedDB (`indexeddb.js`).
- `src/components/` – Komponen reusable (misal `CalendarHeatmap.vue`).
- `src/views/` – Halaman utama (Dashboard, Habit, Finance, dsb.).
- `src/styles/` – SCSS global (`styles.scss`).
- `public/manifest.json` + ikon PWA.
- `service-worker.js` – Logika caching & offline.

## Konvensi Komponen Vue

Gunakan Single File Component (SFC) `.vue` dengan 3 blok standar:

```vue
<script setup>
// import, props (defineProps), state (ref/reactive), lifecycle
</script>

<template>
  <!-- Struktur semantik + aksesibilitas -->
</template>

<style scoped lang="scss">
/* Gunakan variabel / mixin kalau perlu, hindari style inline berlebihan */
</style>
```

### Praktik State & Data
- Simpan state global di Pinia (user, preferensi, dsb.).
- Operasi CRUD lokal: gunakan wrapper IndexedDB (`indexeddb.js`).
- Tambahkan fungsi ekspor / impor JSON untuk backup lokal (bila belum ada, dapat ditambahkan bertahap).

### Aksesibilitas
- Gunakan elemen semantik (header, main, nav, section, footer).
- Beri `aria-label` atau `aria-describedby` bila konteks tidak jelas.
- Pastikan fokus keyboard (tab) tidak terjebak; gunakan `tabindex` hanya bila diperlukan.
- Bila menambah komponen interaktif baru, pertimbangkan atribut `role` yang sesuai.

### Selektor Testing (Rencana)
Walau belum ada test, siapkan atribut `data-test="..."` untuk elemen penting agar mudah menambah E2E / unit test nanti (misal: tombol tambah habit `data-test="add-habit-button"`).

## Workflow Pengembangan

Perintah dasar:
```bash
npm install        # Pasang dependencies
npm run dev        # Jalankan dev server (port 8080 terkonfigurasi di vite.config.js)
npm run build      # Build produksi (output dist/)
```

Jika menambahkan testing di masa depan (disarankan Vitest + Vue Test Utils untuk integrasi Vite):
```bash
npm install -D vitest @vue/test-utils jsdom
```
Contoh skrip yang dapat ditambahkan:
```json
"test": "vitest" ,
"test:watch": "vitest --watch"
```

## Rencana Testing (Opsional, Belum Diimplementasi)
Target bertahap:
1. Unit test untuk utilitas IndexedDB (mock dengan in-memory / fake-indexeddb).
2. Unit test komponen (render, props, aksesibilitas dasar).
3. E2E (Playwright) untuk alur offline + sinkronisasi jika diperlukan.

### Konvensi Jika Testing Ditambahkan
- Gunakan `data-test` untuk pemilihan elemen, hindari selektor rapuh (kelas CSS).
- Asertif aksesibilitas: cek peran (`getByRole`), label, fokus.
- Mock IndexedDB bila diperlukan untuk kecepatan.

## PWA & Offline
- Pastikan `service-worker.js` terdaftar di `main.js` (jika belum, tambahkan). Contoh:
  ```js
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js');
    });
  }
  ```
- Manifest harus sinkron dengan ikon yang tersedia (icon 192x192 / 512x512).
- Simpan data (habit, todo, journal) di IndexedDB agar tetap tersedia offline.

## Style & SCSS
- Centralisasi warna / variabel di satu tempat (misal di `styles.scss`).
- Gunakan nesting SCSS sewajarnya, hindari kedalaman >3 level.
- Hindari penggunaan inline style kecuali kasus dinamis sederhana.

## Pinia Store Pola Minimal
```js
// src/store/userStore.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({ profile: null, status: 'idle' }),
  actions: {
    setProfile(p) { this.profile = p }
  }
})
```

## Praktik Kualitas Kode
- Nama file PascalCase untuk komponen (`CalendarHeatmap.vue`).
- Hindari logika berat di template; pindahkan ke computed / methods.
- Ekstrak fungsi utilitas berulang ke folder `src/utils/` (dapat dibuat bila butuh).
- Komponen besar (>300 baris) pertimbangkan refactor menjadi komponen anak.

## Ekstensi VS Code (Disarankan)
- Vue Language Features (Volar)
- ESLint
- Prettier
- Icon JSON preview
- (Opsional) GitLens

## Langkah Pengembangan Baru yang Disarankan
1. Tambah registrasi service worker (cek apakah sudah ada di `main.js`).
2. Tambah README.md menjelaskan proyek & cara jalan.
3. Putuskan setup testing (Vitest atau Jest) sebelum menulis banyak fitur baru.
4. Tambah atribut `data-test` pada elemen kritis alur utama.

## Pedoman Kontribusi Singkat
- Satu fitur per branch.
- Commit deskriptif dalam Bahasa Indonesia atau Inggris konsisten.
- Lakukan build lokal sebelum membuka PR.
- Jika menambah dependensi, jelaskan alasan di deskripsi PR.

---
Dokumen ini menggantikan versi sebelumnya yang berbasis Next.js dan menyesuaikan realitas stack saat ini. Perbarui kembali bila arsitektur berubah (misal migrasi ke TypeScript atau penambahan Vitest/Playwright).
