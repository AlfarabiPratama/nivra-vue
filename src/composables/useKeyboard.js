import { onMounted, onBeforeUnmount } from "vue";

/**
 * Composable for keyboard shortcuts
 * Usage:
 *   const { registerShortcut, unregisterShortcut } = useKeyboard();
 *   registerShortcut('ctrl+s', () => { save(); });
 */
export function useKeyboard() {
  const shortcuts = new Map();

  const parseShortcut = (shortcut) => {
    const parts = shortcut.toLowerCase().split("+");
    return {
      ctrl: parts.includes("ctrl") || parts.includes("control"),
      alt: parts.includes("alt"),
      shift: parts.includes("shift"),
      meta: parts.includes("meta") || parts.includes("cmd"),
      key: parts[parts.length - 1],
    };
  };

  const matchesShortcut = (event, shortcutConfig) => {
    return (
      event.key.toLowerCase() === shortcutConfig.key &&
      event.ctrlKey === shortcutConfig.ctrl &&
      event.altKey === shortcutConfig.alt &&
      event.shiftKey === shortcutConfig.shift &&
      event.metaKey === shortcutConfig.meta
    );
  };

  const handleKeyDown = (event) => {
    for (const [shortcut, callback] of shortcuts.entries()) {
      const config = parseShortcut(shortcut);
      if (matchesShortcut(event, config)) {
        event.preventDefault();
        callback(event);
        break;
      }
    }
  };

  const registerShortcut = (shortcut, callback, description = "") => {
    shortcuts.set(shortcut, callback);
    // Store description for help modal
    if (description) {
      shortcuts.get(shortcut).description = description;
    }
  };

  const unregisterShortcut = (shortcut) => {
    shortcuts.delete(shortcut);
  };

  const getShortcuts = () => {
    return Array.from(shortcuts.entries()).map(([key, callback]) => ({
      shortcut: key,
      description: callback.description || "",
    }));
  };

  onMounted(() => {
    window.addEventListener("keydown", handleKeyDown);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleKeyDown);
    shortcuts.clear();
  });

  return {
    registerShortcut,
    unregisterShortcut,
    getShortcuts,
  };
}
