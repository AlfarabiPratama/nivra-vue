import { onMounted, onBeforeUnmount, ref } from "vue";

/**
 * Composable for focus trap in modals
 * Usage:
 *   const { trapFocus, releaseFocus } = useFocusTrap(modalRef);
 *   trapFocus(); // when modal opens
 *   releaseFocus(); // when modal closes
 */
export function useFocusTrap(elementRef) {
  const previouslyFocusedElement = ref(null);
  const focusableElements = ref([]);

  const FOCUSABLE_SELECTORS = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");

  const updateFocusableElements = () => {
    if (!elementRef.value) return;
    focusableElements.value = Array.from(
      elementRef.value.querySelectorAll(FOCUSABLE_SELECTORS)
    );
  };

  const handleTabKey = (event) => {
    if (event.key !== "Tab" || !focusableElements.value.length) return;

    const firstElement = focusableElements.value[0];
    const lastElement =
      focusableElements.value[focusableElements.value.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  const handleEscapeKey = (event) => {
    if (event.key === "Escape") {
      releaseFocus();
    }
  };

  const trapFocus = () => {
    previouslyFocusedElement.value = document.activeElement;
    updateFocusableElements();

    // Focus first focusable element
    if (focusableElements.value.length > 0) {
      setTimeout(() => {
        focusableElements.value[0].focus();
      }, 100);
    }

    document.addEventListener("keydown", handleTabKey);
    document.addEventListener("keydown", handleEscapeKey);
  };

  const releaseFocus = () => {
    document.removeEventListener("keydown", handleTabKey);
    document.removeEventListener("keydown", handleEscapeKey);

    // Return focus to previously focused element
    if (previouslyFocusedElement.value) {
      previouslyFocusedElement.value.focus();
      previouslyFocusedElement.value = null;
    }
  };

  onBeforeUnmount(() => {
    releaseFocus();
  });

  return {
    trapFocus,
    releaseFocus,
  };
}
