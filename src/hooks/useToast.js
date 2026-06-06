import { useState } from "react";

/**
 * Custom hook for managing toast notifications.
 * @returns {{ toasts: Array, add: Function, remove: Function }}
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const add = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3500
    );
  };

  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return { toasts, add, remove };
}
