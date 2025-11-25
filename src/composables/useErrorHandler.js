import { ref } from "vue";

/**
 * Composable for centralized error handling
 * Usage:
 *   const { error, handleError, clearError } = useErrorHandler();
 *   handleError(new Error('Something went wrong'), { showNotification: true });
 */
export function useErrorHandler() {
  const error = ref(null);
  const errorQueue = ref([]);

  const handleError = (err, options = {}) => {
    const {
      showNotification = true,
      logToConsole = true,
      userMessage = null,
    } = options;

    // Format error
    const errorData = {
      id: Date.now(),
      message: userMessage || err.message || "Terjadi kesalahan",
      originalError: err,
      timestamp: new Date(),
      type: "error",
    };

    error.value = errorData;
    errorQueue.value.push(errorData);

    // Log for debugging
    if (logToConsole && import.meta.env.DEV) {
      console.error("[Error Handler]", err);
    }

    // Emit event for global error notification
    if (showNotification) {
      window.dispatchEvent(
        new CustomEvent("app-error", {
          detail: errorData,
        })
      );
    }

    return errorData;
  };

  const clearError = () => {
    error.value = null;
  };

  const clearErrorQueue = () => {
    errorQueue.value = [];
  };

  const removeFromQueue = (errorId) => {
    errorQueue.value = errorQueue.value.filter((e) => e.id !== errorId);
  };

  return {
    error,
    errorQueue,
    handleError,
    clearError,
    clearErrorQueue,
    removeFromQueue,
  };
}
