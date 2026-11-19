import { useEffect, useRef, useState } from "react";
import { AppContext } from "./AppContext";
import { usePersistentState } from "../hooks/usePersistentState";
import {
  initialActivity,
  initialMaterials,
  initialOrders,
  initialSettings,
  initialUsers,
} from "../data/initialData";
export default function AppProvider({ children }) {
  const [materials, setMaterials] = usePersistentState(
    "printsmart.materials.v1",
    initialMaterials,
  );
  const [orders, setOrders] = usePersistentState(
    "printsmart.orders.v1",
    initialOrders,
  );
  const [users, setUsers] = usePersistentState(
    "printsmart.users.v1",
    initialUsers,
  );
  const [settings, setSettings] = usePersistentState(
    "printsmart.settings.v1",
    initialSettings,
  );
  const [activity, setActivity] = usePersistentState(
    "printsmart.activity.v1",
    initialActivity,
  );
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  const notify = (message, type = "success") => {
    clearTimeout(timer.current);
    setToast({ message, type });
    timer.current = setTimeout(() => setToast(null), 4500);
  };
  useEffect(() => {
    const handleError = () =>
      setToast({
        type: "warning",
        message:
          "No se pudo guardar en este navegador. Verifica el espacio disponible o los permisos de almacenamiento.",
      });
    window.addEventListener("printsmart:storage-error", handleError);
    return () => {
      clearTimeout(timer.current);
      window.removeEventListener("printsmart:storage-error", handleError);
    };
  }, []);
  const logActivity = (
    title,
    description,
    icon = "check-circle",
    tone = "green",
  ) => {
    setActivity((previous) =>
      [
        {
          id: crypto.randomUUID(),
          title,
          description,
          time: "Ahora mismo",
          icon,
          tone,
        },
        ...previous,
      ].slice(0, 40),
    );
  };
  const money = (value, digits = 2) =>
    `${settings.symbol} ${new Intl.NumberFormat(settings.language, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value)}`;
  return (
    <AppContext.Provider
      value={{
        materials,
        setMaterials,
        orders,
        setOrders,
        users,
        setUsers,
        settings,
        setSettings,
        activity,
        logActivity,
        money,
        notify,
      }}
    >
      {children}
      {toast && (
        <div className={`app-toast ${toast.type}`} role="status">
          <i
            className={`bi bi-${toast.type === "success" ? "check-circle" : "exclamation-circle"}`}
            aria-hidden="true"
          />
          <span>{toast.message}</span>
          <button
            type="button"
            aria-label="Cerrar aviso"
            onClick={() => setToast(null)}
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>
      )}
    </AppContext.Provider>
  );
}
