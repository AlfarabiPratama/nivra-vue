<template>
  <div class="image-loader" :class="{ 'is-loading': !loaded }">
    <!-- Placeholder/Loading State -->
    <div v-if="!loaded" class="image-placeholder" :style="placeholderStyle">
      <div class="spinner"></div>
    </div>

    <!-- Actual Image -->
    <picture v-show="loaded">
      <!-- WebP Source (if supported) -->
      <source v-if="webpSrc" :srcset="webpSrc" type="image/webp" />

      <!-- Fallback Image -->
      <img
        ref="imageRef"
        :data-src="src"
        :alt="alt"
        :class="imgClass"
        :style="imgStyle"
        @load="onImageLoad"
        @error="onImageError"
      />
    </picture>

    <!-- Error State -->
    <div v-if="error" class="image-error" :style="placeholderStyle">
      <v-icon icon="mdi-image-broken" size="large" color="error"></v-icon>
      <p class="text-caption mt-2">Failed to load image</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: "Image",
  },
  webpSrc: {
    type: String,
    default: null,
  },
  lazy: {
    type: Boolean,
    default: true,
  },
  imgClass: {
    type: String,
    default: "",
  },
  imgStyle: {
    type: [String, Object],
    default: "",
  },
  placeholderHeight: {
    type: String,
    default: "200px",
  },
  placeholderBackground: {
    type: String,
    default: "rgba(var(--v-theme-on-surface), 0.05)",
  },
});

const imageRef = ref(null);
const loaded = ref(false);
const error = ref(false);
const observer = ref(null);

const placeholderStyle = computed(() => ({
  height: props.placeholderHeight,
  background: props.placeholderBackground,
  borderRadius: "12px",
}));

const loadImage = () => {
  if (imageRef.value && !loaded.value) {
    const img = imageRef.value;
    const src = img.getAttribute("data-src");

    if (src) {
      img.src = src;
    }
  }
};

const onImageLoad = () => {
  loaded.value = true;
  error.value = false;
};

const onImageError = () => {
  loaded.value = true;
  error.value = true;
};

const setupIntersectionObserver = () => {
  if (!props.lazy || !("IntersectionObserver" in window)) {
    // If lazy loading disabled or not supported, load immediately
    loadImage();
    return;
  }

  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadImage();
          if (observer.value && imageRef.value) {
            observer.value.unobserve(imageRef.value);
          }
        }
      });
    },
    {
      rootMargin: "50px", // Start loading 50px before entering viewport
      threshold: 0.01,
    }
  );

  if (imageRef.value) {
    observer.value.observe(imageRef.value);
  }
};

onMounted(() => {
  setupIntersectionObserver();
});

onBeforeUnmount(() => {
  if (observer.value && imageRef.value) {
    observer.value.unobserve(imageRef.value);
    observer.value.disconnect();
  }
});
</script>

<style scoped>
.image-loader {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(var(--v-theme-primary), 0.1);
  border-top-color: rgb(var(--v-theme-primary));
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: rgb(var(--v-theme-error));
}

picture,
img {
  width: 100%;
  height: 100%;
  display: block;
}

.is-loading {
  min-height: 100px;
}

/* Fade in animation when image loads */
picture {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
