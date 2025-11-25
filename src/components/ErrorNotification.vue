<template>
  <v-snackbar
    v-model="visible"
    :timeout="timeout"
    :color="color"
    location="top"
    rounded="pill"
    class="error-notification mt-4"
    multi-line
  >
    <div class="d-flex align-center">
      <v-icon :icon="icon" class="mr-3" size="24"></v-icon>
      <div class="flex-grow-1">
        <div class="font-weight-bold text-subtitle-2">{{ title }}</div>
        <div class="text-caption mt-1">{{ message }}</div>
      </div>
    </div>

    <template v-slot:actions>
      <v-btn
        v-if="showRetry"
        variant="text"
        size="small"
        @click="onRetry"
        class="mr-2"
      >
        <v-icon icon="mdi-refresh" class="mr-1"></v-icon>
        Retry
      </v-btn>
      <v-btn
        variant="text"
        size="small"
        icon="mdi-close"
        @click="visible = false"
      ></v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: "Terjadi kesalahan",
  },
  type: {
    type: String,
    default: "error",
    validator: (value) =>
      ["error", "warning", "info", "success"].includes(value),
  },
  timeout: {
    type: Number,
    default: 6000,
  },
  showRetry: {
    type: Boolean,
    default: false,
  },
  onRetryCallback: {
    type: Function,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue", "retry"]);

const visible = ref(props.modelValue);
const errorQueue = ref([]);

const color = computed(() => {
  switch (props.type) {
    case "error":
      return "error";
    case "warning":
      return "warning";
    case "info":
      return "info";
    case "success":
      return "success";
    default:
      return "error";
  }
});

const icon = computed(() => {
  switch (props.type) {
    case "error":
      return "mdi-alert-circle";
    case "warning":
      return "mdi-alert";
    case "info":
      return "mdi-information";
    case "success":
      return "mdi-check-circle";
    default:
      return "mdi-alert-circle";
  }
});

const title = computed(() => {
  switch (props.type) {
    case "error":
      return "Error";
    case "warning":
      return "Peringatan";
    case "info":
      return "Informasi";
    case "success":
      return "Sukses";
    default:
      return "Notifikasi";
  }
});

const onRetry = () => {
  if (props.onRetryCallback) {
    props.onRetryCallback();
  }
  emit("retry");
  visible.value = false;
};

watch(visible, (newVal) => {
  emit("update:modelValue", newVal);
});

watch(
  () => props.modelValue,
  (newVal) => {
    visible.value = newVal;
  }
);

// Listen for global error events
const handleGlobalError = (event) => {
  const errorData = event.detail;
  errorQueue.value.push(errorData);
  visible.value = true;
};

onMounted(() => {
  window.addEventListener("app-error", handleGlobalError);
});

onBeforeUnmount(() => {
  window.removeEventListener("app-error", handleGlobalError);
});
</script>

<style scoped>
.error-notification {
  z-index: 9999;
}

.error-notification :deep(.v-snackbar__content) {
  padding: 16px 20px;
}
</style>
