// Vitest setup file
// Provide fake IndexedDB for idb usage in tests
import "fake-indexeddb/auto";

// jsdom doesn't implement matchMedia by default; stub if needed by components
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
  });
}
