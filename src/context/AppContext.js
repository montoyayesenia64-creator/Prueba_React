/**
 * @file Contrato de acceso al estado compartido del panel.
 * Se separa de AppProvider.jsx para distinguir el contexto de su implementación.
 */
import { createContext, useContext } from "react";
/** Contexto sin valor predeterminado: sus consumidores necesitan AppProvider. */
export const AppContext = createContext(null);
/**
 * Expone registros, setters, preferencias y utilidades del proveedor más cercano.
 * Debe llamarse dentro de un componente descendiente de AppProvider.
 */
export function useAppData() {
  return useContext(AppContext);
}
