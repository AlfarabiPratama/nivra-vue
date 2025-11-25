<template>
  <v-dialog v-model="show" persistent max-width="400" class="level-up-dialog">
    <v-card class="ocean-card text-center pa-6 overflow-visible">
      <!-- Animated Background/Confetti Placeholder -->
      <div class="confetti-container">
        <div v-for="n in 20" :key="n" class="confetti"></div>
      </div>

      <div class="level-badge mb-4">
        <v-icon size="64" color="white" class="star-icon"
          >mdi-star-four-points</v-icon
        >
      </div>

      <h2 class="text-h4 font-weight-black text-primary mb-2">LEVEL UP!</h2>
      <p class="text-h6 font-weight-bold text-secondary mb-6">
        Anda mencapai Level {{ level }}
      </p>

      <p class="text-body-1 text-medium-emphasis mb-6">
        Luar biasa! Konsistensi Anda membuahkan hasil. Teruslah berkembang!
      </p>

      <v-btn
        color="primary"
        size="large"
        rounded="pill"
        elevation="4"
        class="px-8 font-weight-bold"
        @click="close"
      >
        Lanjutkan
      </v-btn>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: Boolean,
  level: Number,
});

const emit = defineEmits(["update:modelValue"]);

const show = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    show.value = val;
  }
);

const close = () => {
  show.value = false;
  emit("update:modelValue", false);
};
</script>

<style scoped>
.ocean-card {
  background: rgb(var(--v-theme-surface));
  border-radius: 32px;
  border: 2px solid rgba(var(--v-theme-primary), 0.2);
  box-shadow: 0 0 50px rgba(var(--v-theme-primary), 0.3);
}

.level-badge {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #ffd700, #ffa500);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: -50px auto 20px; /* Pull up */
  box-shadow: 0 10px 20px rgba(255, 165, 0, 0.4);
  position: relative;
  z-index: 10;
  animation: bounce 1s infinite alternate;
}

.star-icon {
  animation: spin 4s linear infinite;
}

@keyframes bounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-10px);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Simple CSS Confetti */
.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #f00;
  animation: fall linear forwards;
}

/* Generate random confetti positions and colors would ideally be done in JS or SCSS loop, 
   but for simplicity we'll just add a few basic styles or rely on a library later. 
   For now, just a placeholder effect. */
</style>
