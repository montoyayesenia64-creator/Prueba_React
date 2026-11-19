import { createContext, useContext } from "react";
export const AppContext = createContext(null);
export function useAppData() {
  return useContext(AppContext);
}
