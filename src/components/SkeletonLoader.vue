<template>
  <div class="skeleton-loader" :class="`skeleton-${variant}`">
    <!-- Card Skeleton -->
    <div v-if="variant === 'card'" class="skeleton-card">
      <div class="skeleton-header">
        <div class="skeleton-circle"></div>
        <div class="skeleton-text skeleton-title"></div>
      </div>
      <div class="skeleton-content">
        <div class="skeleton-text skeleton-line"></div>
        <div class="skeleton-text skeleton-line short"></div>
      </div>
    </div>

    <!-- Widget Skeleton -->
    <div v-else-if="variant === 'widget'" class="skeleton-widget">
      <div class="skeleton-text skeleton-title mb-4"></div>
      <div class="skeleton-box"></div>
    </div>

    <!-- Chart Skeleton -->
    <div v-else-if="variant === 'chart'" class="skeleton-chart">
      <div class="skeleton-text skeleton-title mb-2"></div>
      <div class="skeleton-graph"></div>
    </div>

    <!-- List Skeleton -->
    <div v-else-if="variant === 'list'" class="skeleton-list">
      <div v-for="i in count" :key="i" class="skeleton-list-item">
        <div class="skeleton-circle"></div>
        <div class="skeleton-text skeleton-line flex-grow-1"></div>
      </div>
    </div>

    <!-- Avatar Skeleton -->
    <div v-else-if="variant === 'avatar'" class="skeleton-avatar">
      <div class="skeleton-circle large"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: "card",
    validator: (value) =>
      ["card", "widget", "chart", "list", "avatar"].includes(value),
  },
  count: {
    type: Number,
    default: 3,
  },
});
</script>

<style scoped>
.skeleton-loader {
  width: 100%;
  animation: pulse 1.5s ease-in-out infinite;
}

/* Skeleton Elements */
.skeleton-text {
  height: 12px;
  background: linear-gradient(
    90deg,
    rgba(var(--v-theme-on-surface), 0.08) 25%,
    rgba(var(--v-theme-on-surface), 0.12) 50%,
    rgba(var(--v-theme-on-surface), 0.08) 75%
  );
  background-size: 200% 100%;
  border-radius: 6px;
  animation: shimmer 2s infinite;
}

.skeleton-title {
  height: 20px;
  width: 60%;
  margin-bottom: 12px;
}

.skeleton-line {
  width: 100%;
  margin-bottom: 8px;
}

.skeleton-line.short {
  width: 70%;
}

.skeleton-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(
    90deg,
    rgba(var(--v-theme-on-surface), 0.08) 25%,
    rgba(var(--v-theme-on-surface), 0.12) 50%,
    rgba(var(--v-theme-on-surface), 0.08) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  flex-shrink: 0;
}

.skeleton-circle.large {
  width: 80px;
  height: 80px;
}

.skeleton-box {
  height: 120px;
  background: linear-gradient(
    90deg,
    rgba(var(--v-theme-on-surface), 0.08) 25%,
    rgba(var(--v-theme-on-surface), 0.12) 50%,
    rgba(var(--v-theme-on-surface), 0.08) 75%
  );
  background-size: 200% 100%;
  border-radius: 12px;
  animation: shimmer 2s infinite;
}

.skeleton-graph {
  height: 200px;
  background: linear-gradient(
    90deg,
    rgba(var(--v-theme-on-surface), 0.08) 25%,
    rgba(var(--v-theme-on-surface), 0.12) 50%,
    rgba(var(--v-theme-on-surface), 0.08) 75%
  );
  background-size: 200% 100%;
  border-radius: 12px;
  animation: shimmer 2s infinite;
}

/* Card Skeleton */
.skeleton-card {
  padding: 20px;
  border-radius: 16px;
  background: rgba(var(--v-theme-surface), 1);
}

.skeleton-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.skeleton-content {
  margin-top: 16px;
}

/* Widget Skeleton */
.skeleton-widget {
  padding: 20px;
  border-radius: 16px;
  background: rgba(var(--v-theme-surface), 1);
}

/* Chart Skeleton */
.skeleton-chart {
  padding: 24px;
  border-radius: 16px;
  background: rgba(var(--v-theme-surface), 1);
}

/* List Skeleton */
.skeleton-list-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  margin-bottom: 8px;
}

/* Animations */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.mb-2 {
  margin-bottom: 8px;
}

.mb-4 {
  margin-bottom: 16px;
}

.flex-grow-1 {
  flex-grow: 1;
}
</style>
