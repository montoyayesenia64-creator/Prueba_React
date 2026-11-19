import { useEffect, useState } from "react";
/** Estado serializable con recuperación segura ante datos antiguos o dañados. */
export function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(key));
      if (Array.isArray(initialValue))
        return Array.isArray(stored) ? stored : initialValue;
      return stored && typeof stored === "object"
        ? { ...initialValue, ...stored }
        : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      window.dispatchEvent(new Event("printsmart:storage-error"));
    }
  }, [key, value]);
  return [value, setValue];
}
