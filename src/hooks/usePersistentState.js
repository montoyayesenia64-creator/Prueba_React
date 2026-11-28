/** @file Hook que conecta un estado de React con localStorage del navegador. */
import { useEffect, useState } from "react";
/**
 * Recupera una colección o un objeto y escribe sus cambios como JSON.
 * En objetos combina los campos guardados con los valores iniciales; en arrays
 * conserva el array guardado. Comprueba el tipo principal, no cada registro.
 * Un JSON ilegible recupera la semilla; un fallo de escritura emite un evento
 * que AppProvider transforma en aviso. La clave debe permanecer estable.
 * @template T
 * @param {string} key Clave de almacenamiento, por ejemplo printsmart.orders.v1.
 * @param {T} initialValue Objeto o colección que se utiliza al iniciar sin datos.
 * @returns {[T, import('react').Dispatch<import('react').SetStateAction<T>>]} Estado y setter.
 */
export function usePersistentState(key, initialValue) {
  // La inicialización diferida evita leer localStorage en cada renderizado.
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
  // Persiste después del renderizado cuando cambia el valor o su clave.
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      window.dispatchEvent(new Event("printsmart:storage-error"));
    }
  }, [key, value]);
  return [value, setValue];
}
