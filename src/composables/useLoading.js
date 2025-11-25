import { ref } from "vue";

/**
 * Composable for managing loading states
 * Usage:
 *   const { isLoading, startLoading, stopLoading, withLoading } = useLoading();
 *   await withLoading(async () => { ... });
 */
export function useLoading(initialState = false) {
  const isLoading = ref(initialState);
  const loadingOperations = ref(new Set());

  const startLoading = (operationId = "default") => {
    loadingOperations.value.add(operationId);
    isLoading.value = true;
  };

  const stopLoading = (operationId = "default") => {
    loadingOperations.value.delete(operationId);
    if (loadingOperations.value.size === 0) {
      isLoading.value = false;
    }
  };

  const withLoading = async (fn, operationId = "default") => {
    startLoading(operationId);
    try {
      const result = await fn();
      return result;
    } finally {
      stopLoading(operationId);
    }
  };

  const reset = () => {
    loadingOperations.value.clear();
    isLoading.value = false;
  };

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
    reset,
  };
}
