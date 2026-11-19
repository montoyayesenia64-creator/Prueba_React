/**
 * @file Estado de aplicación: inventario, pedidos, usuarios, ajustes e historial.
 * Las colecciones persisten con usePersistentState; el aviso temporal solo vive
 * en memoria. No realiza peticiones a un backend ni autentica usuarios.
 */
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
/**
 * Proporciona los datos compartidos y renderiza un único aviso global.
 * @param {{children: import('react').ReactNode}} props Contenido del panel.
 */
export default function AppProvider({ children }) {
  // El sufijo v1 identifica el esquema guardado; cada dominio tiene su propia clave.
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
  /** Muestra un aviso durante 4.5 segundos y cancela el temporizador del anterior. */
  const notify = (message, type = "success") => {
    clearTimeout(timer.current);
    setToast({ message, type });
    timer.current = setTimeout(() => setToast(null), 4500);
  };
  // Traduce errores de almacenamiento en un aviso y libera recursos al desmontar.
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
  /** Añade un evento al inicio y conserva como máximo las 40 entradas más recientes. */
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
  /** Formatea símbolo y decimales según las preferencias, sin convertir divisas. */
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
