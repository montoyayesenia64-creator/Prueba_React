import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Auth } from "../../js/auth.js";

import "./css/Cliente.css";
import "./css/sidebar_toggle.css";
import "./css/variables.css";
import "./css/responsive.css";
import "./css/carrito.css";
/* ═══════════════════════════════════════════════
   HELPERS Y DATOS
═══════════════════════════════════════════════ */

const fmt = (v) => "$" + v.toLocaleString("es-CO");
const fmtCOP = (v) => fmt(v) + " COP";

const iniciales = (nombre = "") =>
  nombre
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const PLACEHOLDERS = {
  dashboard: "Buscar pedidos o facturas...",
  catalogo: "Buscar productos del catálogo...",
  realizar: "Buscar materiales o modelos...",
  pedidos: "Buscar por ID o nombre de pedido...",
  estado: "Buscar pedido por ID...",
  config: "Buscar ajustes...",
};

const PRECIOS_MATERIAL = {
  pla: 45000,
  petg: 58000,
  abs: 52000,
  tpu: 65000,
  resina: 95000,
  nylon: 120000,
};

const MATERIALES = [
  ["pla", "PLA — Estándar"],
  ["petg", "PETG — Funcional"],
  ["abs", "ABS — Resistente"],
  ["tpu", "TPU — Flexible"],
  ["resina", "Resina — Alta Resolución"],
  ["nylon", "Nylon — Industrial"],
];

const COLORES = [
  "Negro Carbón",
  "Blanco Puro",
  "Gris Acero",
  "Morado",
  "Rojo",
  "Azul",
  "Transparente",
  "Personalizado",
];

const DENSIDADES = [
  ["15", "15% — Ligero"],
  ["25", "25% — Normal"],
  ["50", "50% — Sólido"],
  ["75", "75% — Reforzado"],
  ["100", "100% — Macizo"],
];

const FILTROS = [
  ["todos", "Todos"],
  ["Industrial", "Industrial"],
  ["Decorativo", "Decorativo"],
  ["Juguete", "Juguetes"],
  ["Arte", "Arte"],
  ["Tecnología", "Tecnología"],
  ["Hogar", "Hogar"],
];

// Antes eran 31 bloques de HTML repetidos: ahora es un solo arreglo.
// img → imagen real (carpeta public/img) | icono → icono de Bootstrap Icons
const CATALOGO = [
  { nombre: "Dragon articulado", precio: 70000, cat: "Decorativo", badge: "Decorativo", sub: "Ingeniería · Alta precisión", img: "1.jpeg" },
  { nombre: "Carro personalizado", precio: 55000, cat: "Arte", badge: "Arte", sub: "Arte · Decoración", img: "Carro.jpeg" },
  { nombre: "Goku", precio: 8000, cat: "Decorativo", badge: "Decorativo", sub: "Muñecos · anime", img: "goku.jpeg" },
  { nombre: "Garfield", precio: 7000, cat: "Decorativo", badge: "Decorativo", sub: "Personajes · muñecos", img: "garfield.jpeg" },
  { nombre: "Flores en maceta", precio: 25000, cat: "Hogar", badge: "Hogar", sub: "Hogar · Jardín", img: "flores maceta.png" },
  { nombre: "Dinosaurio Articulado", precio: 40000, cat: "Juguete", badge: "Juguete", sub: "Juguetes · Colección", img: "dinosaurio articulado.png" },
  { nombre: "Joyería", precio: 25000, cat: "Arte", badge: "Arte", sub: "Moda · Accesorios", img: "aretes.png" },
  { nombre: "Llavero Personalizado", precio: 10000, cat: "Decorativo", badge: "Accesorio", sub: "Accesorios · Regalo", img: "llavero personalizado.jpeg" },
  { nombre: "Soporte play4", precio: 45000, cat: "Tecnología", badge: "Tecnología", sub: "Tech · Electrónica", img: "Soporte play.jpeg" },
  { nombre: "Soporte de Escritorio", precio: 55000, cat: "Tecnología", badge: "Oficina", sub: "Oficina · Ergonomía", img: "soporte computador.png" },
  { nombre: "Engranaje", precio: 85000, cat: "Industrial", badge: "Mecánica", sub: "Mecánica · Repuestos", img: "Engranaje.png" },
  { nombre: "Soporte de celular ajustable", precio: 18000, cat: "Tecnología", badge: "Oficina", sub: "Oficina · Accesorios", icono: "bi-phone" },
  { nombre: "Organizador de escritorio", precio: 35000, cat: "Hogar", badge: "Oficina", sub: "Oficina · Organización", icono: "bi-inboxes" },
  { nombre: "Soporte de audífonos gamer", precio: 28000, cat: "Tecnología", badge: "Gamer", sub: "Gamer · Escritorio", icono: "bi-headphones" },
  { nombre: "Base para control de consola", precio: 25000, cat: "Tecnología", badge: "Gamer", sub: "Gamer · Accesorios", icono: "bi-controller" },
  { nombre: "Porta cables y cargadores", precio: 12000, cat: "Tecnología", badge: "Oficina", sub: "Oficina · Organización", icono: "bi-plug" },
  { nombre: "Llavero con nombre personalizado", precio: 8000, cat: "Arte", badge: "Regalos", sub: "Regalos · Personalizado", icono: "bi-key" },
  { nombre: "Maceta geométrica low poly", precio: 22000, cat: "Hogar", badge: "Hogar", sub: "Hogar · Plantas", icono: "bi-flower2" },
  { nombre: "Lámpara de luna LED", precio: 45000, cat: "Hogar", badge: "Hogar", sub: "Decoración · Luminoso", icono: "bi-moon-stars" },
  { nombre: "Portarretratos calado", precio: 30000, cat: "Hogar", badge: "Hogar", sub: "Hogar · Decoración", icono: "bi-image" },
  { nombre: "Reloj de pared geométrico", precio: 55000, cat: "Decorativo", badge: "Decorativo", sub: "Hogar · Decoración", icono: "bi-clock" },
  { nombre: "Set de posavasos x4", precio: 20000, cat: "Hogar", badge: "Hogar", sub: "Hogar · Cocina", icono: "bi-cup-hot" },
  { nombre: "Porta velas hexagonal x3", precio: 24000, cat: "Decorativo", badge: "Decorativo", sub: "Decoración · Ambiente", icono: "bi-fire" },
  { nombre: "Placa decorativa con nombre", precio: 26000, cat: "Arte", badge: "Regalos", sub: "Regalos · Personalizado", icono: "bi-card-text" },
  { nombre: "Topper de torta personalizado", precio: 15000, cat: "Arte", badge: "Fiestas", sub: "Fiestas · Personalizado", icono: "bi-cake2" },
  { nombre: "Trofeo personalizado", precio: 38000, desde: true, cat: "Arte", badge: "Eventos", sub: "Eventos · Premiación", icono: "bi-trophy" },
  { nombre: "Caja de regalo grabada", precio: 32000, cat: "Arte", badge: "Regalos", sub: "Regalos · Detalle", icono: "bi-gift" },
  { nombre: "Rompecabezas 3D articulado", precio: 30000, cat: "Juguete", badge: "Educativo", sub: "Educativo · Juguete", icono: "bi-puzzle" },
  { nombre: "Modelo anatómico educativo", precio: 50000, desde: true, cat: "Industrial", badge: "Educativo", sub: "Educativo · Ciencia", icono: "bi-heart-pulse" },
  { nombre: "Carcasa para electrónica", precio: 35000, desde: true, cat: "Tecnología", badge: "Industrial", sub: "Ingeniería · Prototipado", icono: "bi-cpu" },
  { nombre: "Robot articulado para armar", precio: 48000, cat: "Juguete", badge: "Juguetes", sub: "Colección · Juguete", icono: "bi-robot" },
];

const HISTORIAL_RECIENTE = [
  { nombre: "Carcasa Sensor IoT x10", fecha: "08 Oct 2024", estado: "entregado", etiqueta: "Entregado", costo: "$42.000" },
  { nombre: "Engranaje Helicoidal 45mm", fecha: "02 Oct 2024", estado: "entregado", etiqueta: "Entregado", costo: "$60.000" },
  { nombre: "Soporte Motor Nema 17", fecha: "28 Sep 2024", estado: "error", etiqueta: "Error de Archivo", costo: "$0" },
];

const PEDIDOS_ACTIVOS = [
  {
    nombre: "Prototipo Brazo Robótico",
    id: "#SP-9824",
    material: "Resina Industrial",
    icono: "bi-printer",
    badge: { clase: "imprimiendo", texto: "Imprimiendo" },
    activo: 1,
    pasos: [
      { label: "Recibido" },
      { label: "Imprimiendo", icono: "bi-printer" },
      { label: "Finalizado" },
      { label: "Enviado" },
    ],
    pie: "Entrega estimada: 14 de Octubre",
  },
  {
    nombre: "Engranajes de Transmisión",
    id: "#SP-9827",
    material: "Nylon Carbono",
    icono: "bi-gear",
    badge: { clase: "recibido", texto: "Recibido" },
    activo: 0,
    pasos: [
      { label: "Recibido", icono: "bi-check" },
      { label: "Imprimiendo" },
      { label: "Finalizado" },
      { label: "Enviado" },
    ],
    pie: "En cola de impresión",
  },
];

const HISTORIAL_PEDIDOS = [
  { id: "#SP-9412", fecha: "22 Sep 2024", producto: "Carcasa Tablet Rugged", material: "ABS Reforzado", precio: "$125.000", estado: "entregado", etiqueta: "Entregado" },
  { id: "#SP-9388", fecha: "15 Sep 2024", producto: "Moldes Médicos Mod. A", material: "Bio-Polymer", precio: "$450.000", estado: "entregado", etiqueta: "Entregado" },
  { id: "#SP-9201", fecha: "01 Sep 2024", producto: "Soporte Motor V8 Scale", material: "Aluminio SLM", precio: "$1.200.000", estado: "cancelado", etiqueta: "Cancelado" },
];

const NOTIFICACIONES = [
  { ico: "bi-printer", texto: "Pedido #SP-9824 al 68% de impresión", tiempo: "Hace 2 min", bg: "#EDE9FE", color: "#5B21B6" },
  { ico: "bi-check-circle", texto: "Pedido #SP-9412 entregado exitosamente", tiempo: "Hace 1 hora", bg: "#DCFCE7", color: "#16A34A" },
  { ico: "bi-star", texto: "¡Evalúa tu último pedido y obtén 5% de descuento!", tiempo: "Hace 3 horas", bg: "#FEF3C7", color: "#D97706" },
  { ico: "bi-info-circle", texto: "Nuevo material disponible: Carbono SLS", tiempo: "Hace 1 día", bg: "#EFF6FF", color: "#2563EB" },
];

const TOGGLES_INICIALES = [
  { titulo: "Actualizaciones de pedido", sub: "Recibir cambios de estado por correo", on: true },
  { titulo: "Promociones y novedades", sub: "Nuevos materiales y descuentos", on: true },
  { titulo: "Recordatorios de cotización", sub: "Avisos de cotizaciones pendientes", on: false },
  { titulo: "Alertas de entrega", sub: "Notificación al salir el pedido", on: true },
];

const PEDIDO_INICIAL = {
  nombre: "",
  material: "pla",
  color: "Negro Carbón",
  cantidad: 1,
  densidad: "50",
  notas: "",
  precioFijo: null, // precio venido del catálogo (se anula si cambian material/densidad/cantidad)
};

/* ═══════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════ */

// Toasts (reemplaza mostrarToastCliente)
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const toast = useCallback((mensaje, tipo = "info") => {
    const id = nextId.current++;
    setToasts((t) => [...t, { id, mensaje, tipo, saliendo: false }]);
    setTimeout(() => {
      setToasts((t) => t.map((x) => (x.id === id ? { ...x, saliendo: true } : x)));
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 350);
    }, 3500);
  }, []);

  return { toasts, toast };
}

// Estado completo del flujo "Realizar pedido" (pasos 1-3)
function usePedidoForm(usuario, toast) {
  const [paso, setPaso] = useState(1);
  const [pedido, setPedido] = useState(PEDIDO_INICIAL);
  const [archivo, setArchivo] = useState(null); // { nombre, tipo: "img" | "stl", url, mb }
  const [envio, setEnvio] = useState({
    nombre: usuario.nombre,
    email: usuario.email,
    direccion: "",
    ciudad: "",
    codigo: "",
  });
  const [metodo, setMetodo] = useState("tarjeta");
  const [tarjeta, setTarjeta] = useState({ numero: "", venc: "", cvv: "" });
  const [idPedido, setIdPedido] = useState("#SP-0045");

  const setCampo = (campo, valor) => setPedido((p) => ({ ...p, [campo]: valor }));

  // Campos que recalculan el precio (calcularPrecio original)
  const setCampoPrecio = (campo, valor) =>
    setPedido((p) => ({ ...p, [campo]: valor, precioFijo: null }));

  // Precio derivado: ya no hace falta leerlo del DOM para el resumen
  const precio = useMemo(() => {
    if (pedido.precioFijo != null) return pedido.precioFijo;
    const base = PRECIOS_MATERIAL[pedido.material] || 45000;
    const cant = parseInt(pedido.cantidad) || 1;
    return Math.round(base * (parseInt(pedido.densidad) / 50) * cant);
  }, [pedido]);

  const iva = Math.round(precio * 0.19);
  const total = precio + iva;
  const materialTexto = MATERIALES.find(([v]) => v === pedido.material)?.[1];

  // Archivo de referencia
  const cargarArchivo = (file) => {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["png", "jpg", "jpeg", "stl"].includes(ext)) {
      toast("Solo se permiten PNG, JPG o STL", "error");
      return;
    }
    const mb = file.size / (1024 * 1024);
    if (mb > 500) {
      toast("El archivo supera los 500MB", "error");
      return;
    }
    if (archivo?.url) URL.revokeObjectURL(archivo.url);
    setArchivo({
      nombre: file.name,
      tipo: ext === "stl" ? "stl" : "img",
      url: URL.createObjectURL(file),
      mb: mb.toFixed(2),
    });
    toast(`Archivo cargado: ${file.name}`, "success");
  };

  const eliminarArchivo = () => {
    if (archivo?.url) URL.revokeObjectURL(archivo.url);
    setArchivo(null);
    toast("Archivo eliminado", "info");
  };

  // Navegación entre pasos
  const siguiente = () => {
    if (!pedido.nombre.trim()) {
      toast("Ingresa un nombre para el pedido", "error");
      return;
    }
    setPaso(2);
    toast("Proyecto guardado. Completa el envío.", "success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const anterior = () => {
    setPaso(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const finalizar = () => {
    if (!envio.nombre.trim()) return toast("Ingresa tu nombre completo", "error");
    if (!envio.email.trim().includes("@")) return toast("Ingresa un correo válido", "error");
    if (!envio.direccion.trim()) return toast("Ingresa tu dirección de entrega", "error");

    const id = "#SP-" + Math.floor(1000 + Math.random() * 9000);
    setIdPedido(id);
    setPaso(3);
    toast("¡Pedido confirmado! " + id, "success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Desde el catálogo (pedirProducto)
  const precargarProducto = (nombre, precioNum) => {
    setPedido((p) => ({ ...p, nombre, precioFijo: precioNum }));
    setPaso(1);
  };

  return {
    paso, pedido, setCampo, setCampoPrecio, precio, iva, total, materialTexto,
    archivo, cargarArchivo, eliminarArchivo,
    envio, setEnvio, metodo, setMetodo, tarjeta, setTarjeta,
    idPedido, siguiente, anterior, finalizar, precargarProducto,
  };
}

/* ═══════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════ */

export default function ClientePortal() {
  const sesion = useMemo(() => Auth.obtenerSesion(), []);

  const [seccion, setSeccion] = useState("dashboard");
  const [busqueda, setBusqueda] = useState("");
  const [notifAbiertas, setNotifAbiertas] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [perfil, setPerfil] = useState({
    nombre: sesion?.nombre || "Juan Pérez",
    email: sesion?.email || "juan@correo.com",
  });
  const [evalModal, setEvalModal] = useState(null); // { producto, id } | null

  const { toasts, toast } = useToasts();
  const form = usePedidoForm(perfil, toast);

  // Verificar sesión (Auth.protegerRuta + chequeo de rol)
  useEffect(() => {
    Auth.protegerRuta("Cliente");
    if (!sesion || sesion.rol !== "Cliente") Auth.cerrarSesion();
  }, [sesion]);

  // Sidebar oculto/visible (persistido en localStorage)
  const [sidebarOculto, setSidebarOculto] = useState(
    () => localStorage.getItem("ps3d_sidebar_oculto") === "1",
  );

  // Clase cliente-body en el <body>
  useEffect(() => {
    document.body.classList.add("cliente-body");
    return () => document.body.classList.remove("cliente-body");
  }, []);

  // Aplicar/guardar el estado del sidebar
  useEffect(() => {
    document.body.classList.toggle("sidebar-oculto", sidebarOculto);
    localStorage.setItem("ps3d_sidebar_oculto", sidebarOculto ? "1" : "0");
    return () => document.body.classList.remove("sidebar-oculto");
  }, [sidebarOculto]);

  // Cerrar notificaciones con clic fuera / ESC
  useEffect(() => {
    if (!notifAbiertas) return;
    const onClick = (e) => {
      if (!e.target.closest("#notifPanel") && !e.target.closest(".cl-topbar-btn")) {
        setNotifAbiertas(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [notifAbiertas]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setEvalModal(null);
      setNotifAbiertas(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Bloquear scroll cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = evalModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [evalModal]);

  // Liberar la URL del archivo al desmontar
  useEffect(() => () => form.archivo?.url && URL.revokeObjectURL(form.archivo.url), []); // eslint-disable-line

  if (!sesion || sesion.rol !== "Cliente") return null;

  const irA = (destino) => {
    setSeccion(destino);
    setBusqueda("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pedirProducto = (p) => {
    form.precargarProducto(p.nombre, p.precio);
    irA("realizar");
    toast("Producto añadido al formulario de pedido", "success");
  };

  const cerrarSesion = () => {
    sessionStorage.clear();
    toast("Sesión cerrada correctamente", "info");
    setTimeout(() => { window.location.href = "index.html"; }, 1200);
  };

  const guardarPerfil = ({ nombre, email }) => {
    if (!nombre.trim()) return toast("El nombre es obligatorio", "error");
    if (!email.trim().includes("@")) return toast("Ingresa un correo válido", "error");
    sessionStorage.setItem("clienteNombre", nombre.trim());
    sessionStorage.setItem("clienteEmail", email.trim());
    setPerfil({ nombre: nombre.trim(), email: email.trim() });
    toast("Perfil actualizado correctamente", "success");
  };

  const cambiarAvatar = (file) => {
    if (!file) return;
    setAvatarUrl(URL.createObjectURL(file));
    toast("Foto de perfil actualizada", "success");
  };

  const primerNombre = perfil.nombre.split(" ")[0];
  const NavItem = ({ id, icono, children }) => (
    <button
      className={`cl-nav-item ${seccion === id ? "activo" : ""}`}
      id={`nav-${id}`}
      onClick={() => irA(id)}
    >
      <i className={`bi ${icono}`}></i> {children}
    </button>
  );

  return (
    <>
      {/* SIDEBAR */}
      <aside className="cl-sidebar">
        <a className="cl-brand" href="index.html">
          <img src="/assets/logo2.jpeg" alt="Logo" className="cl-brand-logo" />
          <span className="cl-brand-txt">PrintSmart 3D</span>
        </a>

        <nav className="cl-nav">
          <NavItem id="dashboard" icono="bi-grid-1x2">Dashboard</NavItem>
          <NavItem id="catalogo" icono="bi-shop">Catálogo</NavItem>
          <NavItem id="realizar" icono="bi-cart-plus">Realizar Pedido</NavItem>
          <NavItem id="pedidos" icono="bi-clock-history">Mis Pedidos</NavItem>
          <NavItem id="estado" icono="bi-broadcast">Estado del Pedido</NavItem>
          <div className="cl-nav-sep">Cuenta</div>
          <NavItem id="config" icono="bi-gear">Configuración</NavItem>
        </nav>

        <button className="btn-nuevo-pedido" onClick={() => irA("realizar")}>
          <i className="bi bi-plus-lg"></i> Nuevo Pedido
        </button>

        <div className="cl-sidebar-footer">
          <button className="cl-nav-item peligro" onClick={cerrarSesion}>
            <i className="bi bi-box-arrow-left"></i> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* BOTÓN MOSTRAR / OCULTAR SIDEBAR (fuera del aside para que no se oculte con él) */}
      <button
        type="button"
        className="btn-toggle-sidebar"
        onClick={() => setSidebarOculto((v) => !v)}
        aria-label={sidebarOculto ? "Mostrar menú" : "Ocultar menú"}
        aria-expanded={!sidebarOculto}
        title={sidebarOculto ? "Mostrar menú" : "Ocultar menú"}
        style={{ left: sidebarOculto ? 20 : "var(--sidebar-w, 260px)" }}
      >
        <i className={`bi ${sidebarOculto ? "bi-chevron-right" : "bi-chevron-left"}`}></i>
      </button>

      {/* TOPBAR */}
      <header className="cl-topbar">
        <div className="cl-buscador">
          <i className="bi bi-search cl-buscador-ico"></i>
          <input
            type="text"
            className="cl-buscador-input"
            id="clBuscador"
            placeholder={PLACEHOLDERS[seccion] || "Buscar..."}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="cl-topbar-right">
          <button
            className="cl-topbar-btn"
            title="Notificaciones"
            onClick={() => setNotifAbiertas((v) => !v)}
          >
            <i className="bi bi-bell"></i>
            <div className="cl-notif-dot"></div>
          </button>

          <div className="cl-perfil" onClick={() => irA("config")}>
            <div className="cl-avatar" id="clAvatar">
              {avatarUrl ? <img src={avatarUrl} alt="" /> : iniciales(perfil.nombre)}
            </div>
            <div>
              <div className="cl-perfil-nombre">{perfil.nombre}</div>
              <div className="cl-perfil-rol">Cliente</div>
            </div>
          </div>
        </div>
      </header>

      {notifAbiertas && (
        <NotifPanel onCerrar={() => setNotifAbiertas(false)} toast={toast} />
      )}

      {/* CONTENIDO */}
      <main className="cl-main">
        {seccion === "dashboard" && (
          <Dashboard primerNombre={primerNombre} irA={irA} toast={toast} />
        )}
        {seccion === "catalogo" && (
          <Catalogo busqueda={busqueda} irA={irA} pedirProducto={pedirProducto} toast={toast} />
        )}
        {seccion === "realizar" && <RealizarPedido form={form} toast={toast} irA={irA} />}
        {seccion === "pedidos" && (
          <MisPedidos
            busqueda={busqueda}
            irA={irA}
            toast={toast}
            onEvaluar={(producto, id) => setEvalModal({ producto, id })}
          />
        )}
        {seccion === "estado" && <EstadoPedido perfil={perfil} irA={irA} toast={toast} />}
        {seccion === "config" && (
          <Configuracion
            perfil={perfil}
            avatarUrl={avatarUrl}
            onGuardar={guardarPerfil}
            onAvatar={cambiarAvatar}
            onCerrarSesion={cerrarSesion}
            toast={toast}
          />
        )}
      </main>

      {evalModal && (
        <ModalEvaluacion
          key={evalModal.id}
          producto={evalModal.producto}
          id={evalModal.id}
          onCerrar={() => setEvalModal(null)}
          toast={toast}
        />
      )}

      <div className="cl-toast-container" id="clToastContainer">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`cl-toast ${t.tipo}`}
            style={t.saliendo ? { opacity: 0, transition: "opacity 0.35s" } : undefined}
          >
            <span>{t.mensaje}</span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   NOTIFICACIONES
═══════════════════════════════════════════════ */

function NotifPanel({ onCerrar, toast }) {
  return (
    <div
      id="notifPanel"
      style={{
        position: "fixed", top: 66, right: 16, width: 320,
        background: "white", border: "1px solid #E5E7EB", borderRadius: 14,
        boxShadow: "0 10px 40px rgba(0,0,0,0.12)", zIndex: 500, overflow: "hidden",
        animation: "cl-toast-in 0.2s ease",
      }}
    >
      <div
        style={{
          padding: "16px 18px", borderBottom: "1px solid #F3F4F6",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 800, color: "#1F2937" }}>Notificaciones</span>
        <button
          onClick={onCerrar}
          style={{ background: "none", border: "none", fontSize: 18, color: "#9CA3AF", cursor: "pointer", lineHeight: 1 }}
        >
          ×
        </button>
      </div>

      {NOTIFICACIONES.map((n) => (
        <div
          key={n.texto}
          style={{
            padding: "12px 18px", display: "flex", alignItems: "flex-start", gap: 12,
            borderBottom: "1px solid #F9FAFB", cursor: "pointer", transition: "background 0.15s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#F9FAFB")}
          onMouseOut={(e) => (e.currentTarget.style.background = "")}
        >
          <div
            style={{
              width: 36, height: 36, borderRadius: 9, background: n.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, color: n.color, flexShrink: 0,
            }}
          >
            <i className={`bi ${n.ico}`}></i>
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1F2937", lineHeight: 1.4, marginBottom: 3 }}>
              {n.texto}
            </div>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>{n.tiempo}</div>
          </div>
        </div>
      ))}

      <div style={{ padding: "12px 18px", borderTop: "1px solid #F3F4F6", textAlign: "center" }}>
        <span
          style={{ fontSize: 12.5, color: "#5B21B6", fontWeight: 600, cursor: "pointer" }}
          onClick={() => toast("Abriendo todas las notificaciones...", "info")}
        >
          Ver todas las notificaciones →
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECCIÓN: DASHBOARD
═══════════════════════════════════════════════ */

function Dashboard({ primerNombre, irA, toast }) {
  return (
    <section id="sec-dashboard">
      <div className="cl-sec-header">
        <div>
          <h1 className="cl-sec-titulo">¡Hola, {primerNombre}!</h1>
          <p className="cl-sec-sub">Bienvenido a tu panel de control de impresión 3D.</p>
        </div>
        <button className="cl-btn-p" onClick={() => irA("realizar")}>
          <i className="bi bi-rocket-takeoff"></i> Realizar Nuevo Pedido
        </button>
      </div>

      {/* Pedido en curso */}
      <div className="cl-pedido-curso">
        <div className="cl-pedido-curso-tag">
          <div className="cl-pedido-curso-tag-dot"></div>
          Pedido en Curso
        </div>

        <div className="cl-pedido-curso-inner">
          <div>
            <div className="cl-pedido-nombre">Prototipo Brazo Robótico V2</div>
            <div className="cl-pedido-fecha">
              <i className="bi bi-calendar3"></i> Estimado: 14 de Octubre, 17:30
            </div>

            <div className="cl-progreso-label">
              <span>Progreso de Impresión</span>
              <span className="cl-progreso-pct">68%</span>
            </div>
            <div className="cl-barra-wrap">
              <div className="cl-barra-fill" style={{ width: "68%" }}></div>
            </div>

            <div className="cl-pedido-chips">
              <div className="cl-pedido-chip">
                <div className="cl-chip-label">Material</div>
                <div className="cl-chip-valor">Resina Industrial High-Temp</div>
              </div>
              <div className="cl-pedido-chip">
                <div className="cl-chip-label">Máquina</div>
                <div className="cl-chip-valor">Formlabs 3B+ (Unit 4)</div>
              </div>
            </div>
          </div>

          <div className="cl-pedido-preview">
            <div className="cl-pedido-preview-ph">
              <i className="bi bi-robot"></i>
            </div>
            <button
              className="cl-live-btn"
              onClick={() => toast("Conectando con cámara en vivo...", "info")}
            >
              <i className="bi bi-camera-video"></i> Vista en vivo de cámara
            </button>
          </div>
        </div>

        <div className="cl-pedido-footer">
          <span>Actualizado hace 2 minutos</span>
          <span className="cl-link-morado" onClick={() => irA("estado")}>
            Ver detalles completos →
          </span>
        </div>
      </div>

      {/* Historial + cards laterales */}
      <div className="cl-grid-3-1" style={{ gap: 16 }}>
        <div className="cl-card">
          <div className="cl-card-titulo">Historial Reciente</div>
          <div className="cl-card-sub" style={{ marginBottom: 14 }}>
            Tus últimas 3 transacciones
          </div>
          <table className="cl-tabla">
            <thead>
              <tr>
                <th>Nombre del Proyecto</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Costo</th>
              </tr>
            </thead>
            <tbody>
              {HISTORIAL_RECIENTE.map((h) => (
                <tr key={h.nombre} onClick={() => irA("estado")} style={{ cursor: "pointer" }}>
                  <td className="fw-700">{h.nombre}</td>
                  <td>{h.fecha}</td>
                  <td><span className={`cl-badge ${h.estado}`}>{h.etiqueta}</span></td>
                  <td className={`fw-700 ${h.estado === "entregado" ? "text-morado" : ""}`}>{h.costo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="cl-tip-card">
            <div className="cl-tip-tag">Guía de Preparación</div>
            <div className="cl-tip-titulo">Optimiza tus archivos STL</div>
            <div className="cl-tip-item">
              <i className="bi bi-check-circle"></i> Verifica que el modelo sea &quot;manifold&quot; (estanco).
            </div>
            <div className="cl-tip-item">
              <i className="bi bi-check-circle"></i> Espesor mínimo de pared: 0.8mm.
            </div>
            <div className="cl-tip-item">
              <i className="bi bi-check-circle"></i> Usa formatos .STEP para mayor precisión.
            </div>
            <button className="cl-tip-btn" onClick={() => toast("Abriendo centro de ayuda...", "info")}>
              Ver Centro de Ayuda
            </button>
          </div>

          <div className="cl-nueva-tec-card">
            <div className="cl-nueva-tec-tag">Nueva Tecnología</div>
            <div className="cl-nueva-tec-titulo">Impresión SLS de Carbono</div>
            <div className="cl-nueva-tec-desc">
              Resistencia mecánica extrema con nuestra nueva serie de materiales compuestos.
            </div>
            <button className="cl-btn-o cl-btn-sm" style={{ marginTop: 12 }} onClick={() => irA("catalogo")}>
              <i className="bi bi-arrow-right-circle"></i> Ver en catálogo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECCIÓN: CATÁLOGO
═══════════════════════════════════════════════ */

function Catalogo({ busqueda, irA, pedirProducto, toast }) {
  const [filtro, setFiltro] = useState("todos");

  // Filtro por categoría + buscador del topbar, combinados
  const visibles = useMemo(() => {
    const term = busqueda.toLowerCase().trim();
    return CATALOGO.filter(
      (p) =>
        (filtro === "todos" || p.cat === filtro) &&
        (!term || p.nombre.toLowerCase().includes(term)),
    );
  }, [filtro, busqueda]);

  const elegirFiltro = (valor) => {
    setFiltro(valor);
    const total = CATALOGO.filter((p) => valor === "todos" || p.cat === valor).length;
    toast(`Mostrando ${total} producto${total !== 1 ? "s" : ""}`, "info");
  };

  return (
    <section id="sec-catalogo">
      <div className="cl-sec-header">
        <div>
          <h1 className="cl-sec-titulo">Catálogo</h1>
          <p className="cl-sec-sub">Escoge el modelo que necesitas o sube uno personalizado.</p>
        </div>
        <button className="cl-btn-p" onClick={() => irA("realizar")}>
          <i className="bi bi-upload"></i> Subir mi diseño
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
        {FILTROS.map(([valor, etiqueta]) => (
          <button
            key={valor}
            className={`${filtro === valor ? "cl-btn-p" : "cl-btn-o"} cl-btn-sm`}
            onClick={() => elegirFiltro(valor)}
          >
            {etiqueta}
          </button>
        ))}
      </div>

      <div className="cl-cat-grid" id="catalogoGrid">
        {visibles.map((p) => (
          <div key={p.nombre} className="cl-cat-card" data-cat={p.cat} onClick={() => pedirProducto(p)}>
            <div className="cl-cat-img">
              {p.img ? (
                <img src={`/img/${p.img}`} alt={p.nombre} style={{ width: "100%", height: "100%" }} />
              ) : (
                <i className={`bi ${p.icono}`}></i>
              )}
              <span className="cl-cat-badge">{p.badge}</span>
            </div>
            <div className="cl-cat-body">
              <div className="cl-cat-nombre">{p.nombre}</div>
              <div className="cl-cat-categoria">{p.sub}</div>
              <div className="cl-cat-footer">
                <div className="cl-cat-precio">
                  {p.desde ? "Desde " : ""}
                  {fmt(p.precio)}
                </div>
                <button
                  className="cl-cat-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    pedirProducto(p);
                  }}
                >
                  Pedir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECCIÓN: REALIZAR PEDIDO
═══════════════════════════════════════════════ */

function RealizarPedido({ form, toast, irA }) {
  const { paso } = form;
  const pasos = ["Proyecto", "Pedido", "Review"];

  return (
    <section id="sec-realizar">
      <div className="cl-sec-header">
        <div>
          <h1 className="cl-sec-titulo">Realizar Pedido</h1>
          <p className="cl-sec-sub">Completa los detalles de tu impresión personalizada.</p>
        </div>
      </div>

      <div className="cl-stepper" id="stepper">
        {pasos.map((lbl, i) => {
          const n = i + 1;
          const clase = n < paso ? "completado" : n === paso ? "activo" : "";
          return (
            <div key={lbl} className={`cl-step-item ${clase}`} id={`step${n}`}>
              <div className="cl-step-num">{n}</div>
              <div className="cl-step-lbl">{lbl}</div>
            </div>
          );
        })}
      </div>

      {paso === 1 && <Paso1 form={form} toast={toast} />}
      {paso === 2 && <Paso2 form={form} />}
      {paso === 3 && <Paso3 idPedido={form.idPedido} irA={irA} />}
    </section>
  );
}

function Paso1({ form }) {
  const { pedido, setCampo, setCampoPrecio, precio, archivo } = form;
  const fileInput = useRef(null);
  const [arrastrando, setArrastrando] = useState(false);

  const onDrop = (e) => {
    e.preventDefault();
    setArrastrando(false);
    form.cargarArchivo(e.dataTransfer.files[0]);
  };

  return (
    <div id="paso1">
      <div className="cl-grid-2" style={{ alignItems: "start" }}>
        <div>
          <div className="cl-card">
            <div className="cl-card-titulo">
              <i className="bi bi-pencil-square text-morado" style={{ marginRight: 8 }}></i>
              Detalles del Proyecto
            </div>
            <div className="cl-card-sub">Cuéntanos qué necesitas imprimir.</div>

            <div className="cl-form-group">
              <label className="cl-form-label">Nombre del Pedido</label>
              <input
                type="text"
                className="cl-form-input"
                placeholder="Ej: Prototipo Carcasa V2"
                value={pedido.nombre}
                onChange={(e) => setCampo("nombre", e.target.value)}
              />
            </div>

            <div className="cl-grid-2" style={{ gap: 12 }}>
              <div className="cl-form-group">
                <label className="cl-form-label">Material</label>
                <select
                  className="cl-form-select"
                  value={pedido.material}
                  onChange={(e) => setCampoPrecio("material", e.target.value)}
                >
                  {MATERIALES.map(([v, t]) => (
                    <option key={v} value={v}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="cl-form-group">
                <label className="cl-form-label">Color</label>
                <select
                  className="cl-form-select"
                  value={pedido.color}
                  onChange={(e) => setCampo("color", e.target.value)}
                >
                  {COLORES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="cl-grid-2" style={{ gap: 12 }}>
              <div className="cl-form-group">
                <label className="cl-form-label">Cantidad</label>
                <input
                  type="number"
                  className="cl-form-input"
                  min="1"
                  max="999"
                  value={pedido.cantidad}
                  onChange={(e) => setCampoPrecio("cantidad", e.target.value)}
                />
              </div>
              <div className="cl-form-group">
                <label className="cl-form-label">Densidad de Relleno</label>
                <select
                  className="cl-form-select"
                  value={pedido.densidad}
                  onChange={(e) => setCampoPrecio("densidad", e.target.value)}
                >
                  {DENSIDADES.map(([v, t]) => (
                    <option key={v} value={v}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="cl-form-group">
              <label className="cl-form-label">Notas adicionales (opcional)</label>
              <textarea
                className="cl-form-input"
                rows="3"
                style={{ resize: "vertical" }}
                placeholder="Tolerancias especiales, acabado, ensamblaje..."
                value={pedido.notas}
                onChange={(e) => setCampo("notas", e.target.value)}
              ></textarea>
            </div>
          </div>

          {/* Zona de carga */}
          <div className="cl-card" style={{ marginTop: 16 }}>
            <div className="cl-card-titulo">
              <i className="bi bi-cloud-upload text-morado" style={{ marginRight: 8 }}></i>
              Carga tu referencia
            </div>
            <div className="cl-card-sub">Sube una imagen PNG/JPG o archivo STL de referencia.</div>

            {!archivo && (
              <div
                className={`cl-upload-zone ${arrastrando ? "dragover" : ""}`}
                id="uploadZone"
                onClick={() => fileInput.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setArrastrando(true); }}
                onDragLeave={(e) => { e.preventDefault(); setArrastrando(false); }}
                onDrop={onDrop}
              >
                <div className="cl-upload-ico">
                  <i className="bi bi-image"></i>
                </div>
                <div className="cl-upload-titulo">Carga tu referencia (PNG / JPG / STL)</div>
                <div className="cl-upload-desc">
                  Sube una imagen de referencia para que nuestro equipo
                  <br />
                  técnico pueda procesar tu solicitud.
                </div>
                <button
                  className="cl-btn-p"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInput.current?.click();
                  }}
                >
                  <i className="bi bi-folder2-open"></i> Seleccionar Archivo
                </button>
              </div>
            )}

            {/* El input vive siempre en el DOM para poder reabrirlo */}
            <input
              type="file"
              ref={fileInput}
              accept=".png,.jpg,.jpeg,.stl"
              style={{ display: "none" }}
              onChange={(e) => {
                form.cargarArchivo(e.target.files[0]);
                e.target.value = "";
              }}
            />

            {archivo && (
              <div className="cl-upload-preview" id="uploadPreview" style={{ display: "block" }}>
                {archivo.tipo === "img" && <img src={archivo.url} alt="Preview" />}
                <div className="cl-upload-preview-bar">
                  <span className="cl-preview-nombre">{archivo.nombre}</span>
                  <button className="cl-btn-o cl-btn-sm" onClick={form.eliminarArchivo}>
                    <i className="bi bi-trash"></i> Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel derecho */}
        <div>
          <div className="cl-inversion-card">
            <div className="cl-inversion-label">Inversión Estimada</div>
            <div>
              <span className="cl-inversion-valor">{fmt(precio)}</span>{" "}
              <span className="cl-inversion-usd">COP</span>
            </div>
            <div className="cl-inversion-desc">
              Precio total basado en material y parámetros seleccionados. Sin cargos ocultos.
            </div>
          </div>

          <div className="cl-preview-ref-card">
            <div className="cl-preview-ref-header">
              <i className="bi bi-eye" style={{ fontSize: 14 }}></i> Vista Previa de Referencia
            </div>
            <div className="cl-preview-ref-body" id="previewRefBody">
              {!archivo && (
                <>
                  <i className="bi bi-image-fill"></i>
                  <span>Sin imagen cargada</span>
                </>
              )}
              {archivo?.tipo === "img" && (
                <img
                  src={archivo.url}
                  alt=""
                  style={{ width: "100%", maxHeight: 200, objectFit: "contain", display: "block" }}
                />
              )}
              {archivo?.tipo === "stl" && (
                <>
                  <i className="bi bi-file-earmark-code" style={{ fontSize: 40, color: "#8B5CF6", opacity: 0.7 }}></i>
                  <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>{archivo.nombre}</span>
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>{archivo.mb} MB · Archivo STL</span>
                </>
              )}
            </div>
          </div>

          <button className="btn-confirmar" onClick={form.siguiente}>
            Confirmar Pedido &nbsp;<i className="bi bi-arrow-right"></i>
          </button>
          <div className="cl-seguro-txt">
            <i className="bi bi-shield-lock-fill text-morado"></i> Pago seguro y entrega garantizada
          </div>
        </div>
      </div>
    </div>
  );
}

function Paso2({ form }) {
  const { envio, setEnvio, metodo, setMetodo, tarjeta, setTarjeta, pedido, precio, iva, total, materialTexto } = form;

  const setEnv = (campo) => (e) => setEnvio((v) => ({ ...v, [campo]: e.target.value }));

  const formatearTarjeta = (valor) =>
    valor.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatearVenc = (valor) => {
    let v = valor.replace(/\D/g, "").slice(0, 4);
    if (v.length >= 2) v = v.slice(0, 2) + "/" + v.slice(2);
    return v;
  };

  return (
    <div id="paso2">
      <div className="cl-grid-2" style={{ alignItems: "start", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Envío */}
          <div className="cl-card">
            <div className="cl-card-titulo">
              <i className="bi bi-truck text-morado" style={{ marginRight: 8 }}></i>
              Información de Envío
            </div>
            <div className="cl-grid-2" style={{ gap: 12 }}>
              <div className="cl-form-group">
                <label className="cl-form-label">Nombre Completo</label>
                <input type="text" className="cl-form-input" placeholder="Juan Pérez"
                  value={envio.nombre} onChange={setEnv("nombre")} />
              </div>
              <div className="cl-form-group">
                <label className="cl-form-label">Correo Electrónico</label>
                <input type="email" className="cl-form-input" placeholder="juan@ejemplo.com"
                  value={envio.email} onChange={setEnv("email")} />
              </div>
            </div>
            <div className="cl-form-group">
              <label className="cl-form-label">Dirección de Entrega</label>
              <input type="text" className="cl-form-input" placeholder="Calle Principal #123, Bogotá"
                value={envio.direccion} onChange={setEnv("direccion")} />
            </div>
            <div className="cl-grid-2" style={{ gap: 12 }}>
              <div className="cl-form-group">
                <label className="cl-form-label">Ciudad</label>
                <input type="text" className="cl-form-input" placeholder="Bogotá"
                  value={envio.ciudad} onChange={setEnv("ciudad")} />
              </div>
              <div className="cl-form-group">
                <label className="cl-form-label">Código Postal</label>
                <input type="text" className="cl-form-input" placeholder="110111"
                  value={envio.codigo} onChange={setEnv("codigo")} />
              </div>
            </div>
          </div>

          {/* Pago */}
          <div className="cl-card">
            <div className="cl-card-titulo">
              <i className="bi bi-credit-card text-morado" style={{ marginRight: 8 }}></i>
              Método de Pago
            </div>

            <div className="cl-metodo-pago">
              <div
                className={`cl-metodo-btn ${metodo === "tarjeta" ? "activo" : ""}`}
                onClick={() => setMetodo("tarjeta")}
              >
                <i className="bi bi-credit-card" style={{ fontSize: 22, color: "#5b21b6" }}></i>
                <div>
                  <div className="cl-metodo-nombre">Tarjeta Débito/Crédito</div>
                  <div className="cl-metodo-sub">Visa, Mastercard, AMEX</div>
                </div>
                <div className="cl-radio"></div>
              </div>
              <div
                className={`cl-metodo-btn ${metodo === "transferencia" ? "activo" : ""}`}
                onClick={() => setMetodo("transferencia")}
              >
                <i className="bi bi-bank" style={{ fontSize: 22, color: "#6b7280" }}></i>
                <div>
                  <div className="cl-metodo-nombre">Transferencia</div>
                  <div className="cl-metodo-sub">PSE / Banco</div>
                </div>
                <div className="cl-radio"></div>
              </div>
            </div>

            {metodo === "tarjeta" ? (
              <div>
                <div className="cl-form-group">
                  <label className="cl-form-label">Número de Tarjeta</label>
                  <div style={{ position: "relative" }}>
                    <i
                      className="bi bi-credit-card"
                      style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}
                    ></i>
                    <input
                      type="text"
                      className="cl-form-input"
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      style={{ paddingLeft: 38 }}
                      value={tarjeta.numero}
                      onChange={(e) => setTarjeta((t) => ({ ...t, numero: formatearTarjeta(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className="cl-grid-2" style={{ gap: 12 }}>
                  <div className="cl-form-group">
                    <label className="cl-form-label">Vencimiento</label>
                    <input
                      type="text"
                      className="cl-form-input"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={tarjeta.venc}
                      onChange={(e) => setTarjeta((t) => ({ ...t, venc: formatearVenc(e.target.value) }))}
                    />
                  </div>
                  <div className="cl-form-group">
                    <label className="cl-form-label">CVV</label>
                    <input
                      type="text"
                      className="cl-form-input"
                      placeholder="123"
                      maxLength={4}
                      value={tarjeta.cvv}
                      onChange={(e) => setTarjeta((t) => ({ ...t, cvv: e.target.value.replace(/\D/g, "") }))}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="cl-form-group">
                  <label className="cl-form-label">Banco</label>
                  <select className="cl-form-select">
                    <option>Bancolombia</option>
                    <option>Davivienda</option>
                    <option>BBVA Colombia</option>
                    <option>Banco de Bogotá</option>
                    <option>Nequi / PSE</option>
                  </select>
                </div>
                <div className="cl-form-group">
                  <label className="cl-form-label">Tipo de Cuenta</label>
                  <select className="cl-form-select">
                    <option>Ahorros</option>
                    <option>Corriente</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button className="cl-btn-o" onClick={form.anterior}>
              <i className="bi bi-arrow-left"></i> Anterior
            </button>
            <button className="btn-confirmar" style={{ flex: 1 }} onClick={form.finalizar}>
              <i className="bi bi-check-circle"></i> Finalizar Pedido →
            </button>
          </div>
          <div className="cl-seguro-txt">
            <i className="bi bi-shield-lock-fill text-morado"></i> Secure SSL &nbsp;·&nbsp;
            <i className="bi bi-credit-card-2-back text-morado"></i> PCI Compliant
          </div>
        </div>

        {/* Resumen */}
        <div className="cl-card" style={{ position: "sticky", top: 78 }}>
          <div className="cl-card-titulo">Resumen del Pedido</div>

          <div className="cl-resumen-item">
            <div className="cl-resumen-img">
              <i className="bi bi-box"></i>
            </div>
            <div>
              <div className="cl-resumen-nombre">{pedido.nombre || "Mi Pedido 3D"}</div>
              <div className="cl-resumen-mat">{materialTexto}</div>
            </div>
            <div className="cl-resumen-precio">{fmtCOP(precio)}</div>
          </div>

          <hr className="cl-divisor" />

          <div className="cl-resumen-fila">
            <span>Subtotal</span>
            <span>{fmtCOP(precio)}</span>
          </div>
          <div className="cl-resumen-fila">
            <span>Envío</span>
            <span className="text-success fw-700">Gratis</span>
          </div>
          <div className="cl-resumen-fila">
            <span>IVA (19%)</span>
            <span>{fmtCOP(iva)}</span>
          </div>
          <div className="cl-resumen-total">
            <span>Total</span>
            <span className="cl-resumen-total-precio">{fmtCOP(total)}</span>
          </div>

          <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", marginTop: 12 }}>
            Al hacer clic, aceptas nuestros{" "}
            <a href="#" style={{ color: "#7c3aed" }}>Términos de Servicio</a> y{" "}
            <a href="#" style={{ color: "#7c3aed" }}>Políticas de Privacidad</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

function Paso3({ idPedido, irA }) {
  return (
    <div id="paso3">
      <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center", padding: "50px 0" }}>
        <div
          style={{
            width: 90, height: 90, background: "#dcfce7", border: "3px solid #22c55e",
            borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 40, color: "#22c55e", margin: "0 auto 24px",
          }}
        >
          ✓
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: "#1f2937", marginBottom: 10 }}>
          ¡Pedido Confirmado!
        </h2>
        <p style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.7, marginBottom: 10 }}>
          Tu pedido <strong className="text-morado">{idPedido}</strong> ha sido recibido exitosamente.
        </p>
        <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 30 }}>
          Recibirás actualizaciones por correo en cada etapa del proceso.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="cl-btn-p" onClick={() => irA("estado")}>
            <i className="bi bi-broadcast"></i> Ver Estado del Pedido
          </button>
          <button className="cl-btn-o" onClick={() => irA("pedidos")}>
            <i className="bi bi-clock-history"></i> Mis Pedidos
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECCIÓN: MIS PEDIDOS
═══════════════════════════════════════════════ */

function Tracker({ pasos, activo }) {
  return (
    <div className="cl-tracker">
      {pasos.map((p, i) => {
        const clase = i < activo ? "completado" : i === activo ? "activo" : "";
        const contenido =
          i < activo ? <i className="bi bi-check"></i>
          : i === activo && p.icono ? <i className={`bi ${p.icono}`}></i>
          : i + 1;
        return (
          <div key={p.label} className={`cl-tracker-step ${clase}`}>
            <div className="cl-tracker-circulo">{contenido}</div>
            <div className="cl-tracker-label">{p.label}</div>
          </div>
        );
      })}
    </div>
  );
}

function MisPedidos({ busqueda, irA, toast, onEvaluar }) {
  const [pagina, setPagina] = useState(1);

  const filas = useMemo(() => {
    const term = busqueda.toLowerCase().trim();
    return HISTORIAL_PEDIDOS.filter(
      (p) => !term || Object.values(p).join(" ").toLowerCase().includes(term),
    );
  }, [busqueda]);

  return (
    <section id="sec-pedidos">
      <div className="cl-sec-header">
        <div>
          <h1 className="cl-sec-titulo">Mis Pedidos</h1>
        </div>
        <button className="cl-btn-p" onClick={() => irA("realizar")}>
          <i className="bi bi-plus-lg"></i> Nuevo Pedido
        </button>
      </div>

      <h2 style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 12 }}>Pedidos Activos</h2>

      <div className="cl-grid-2" style={{ marginBottom: 24 }}>
        {PEDIDOS_ACTIVOS.map((p) => (
          <div key={p.id} className="cl-pedido-activo-card">
            <div className="cl-pedido-activo-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="cl-pedido-activo-ico">
                  <i className={`bi ${p.icono}`}></i>
                </div>
                <div>
                  <div className="cl-pedido-activo-nombre">{p.nombre}</div>
                  <div className="cl-pedido-activo-id">
                    ID: {p.id} · Material: {p.material}
                  </div>
                </div>
              </div>
              <span className={`cl-badge ${p.badge.clase}`}>{p.badge.texto}</span>
            </div>

            <Tracker pasos={p.pasos} activo={p.activo} />

            <div className="cl-pedido-activo-footer">
              <span>{p.pie}</span>
              <span className="cl-link-morado" onClick={() => irA("estado")}>
                Ver detalles →
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="cl-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div className="cl-card-titulo">Historial de Pedidos</div>
        </div>

        <table className="cl-tabla">
          <thead>
            <tr>
              <th>Pedido ID</th>
              <th>Fecha</th>
              <th>Producto</th>
              <th>Material</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((p) => (
              <tr key={p.id}>
                <td className="fw-700">{p.id}</td>
                <td>{p.fecha}</td>
                <td>{p.producto}</td>
                <td>{p.material}</td>
                <td className="fw-700">{p.precio}</td>
                <td><span className={`cl-badge ${p.estado}`}>{p.etiqueta}</span></td>
                <td>
                  {p.estado === "entregado" ? (
                    <button className="cl-tabla-accion" onClick={() => onEvaluar(p.producto, p.id)}>
                      <i className="bi bi-star"></i> Evaluar
                    </button>
                  ) : (
                    <button className="cl-tabla-accion" onClick={() => toast("Reintentando pedido...", "info")}>
                      <i className="bi bi-arrow-clockwise"></i> Reintentar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="cl-tabla-footer">
          <span>Mostrando 1–{filas.length} de 24 pedidos</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button className="cl-btn-pag">‹</button>
            {[1, 2].map((n) => (
              <button
                key={n}
                className={`cl-btn-pag ${pagina === n ? "activo" : ""}`}
                onClick={() => setPagina(n)}
              >
                {n}
              </button>
            ))}
            <button className="cl-btn-pag">›</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECCIÓN: ESTADO DEL PEDIDO
═══════════════════════════════════════════════ */

const FLUJO = [
  { estado: "done", nombre: "Pedido Recibido", hora: "12 Oct · 09:15", icono: "bi-check-lg" },
  { estado: "active", nombre: "En Proceso", hora: "En curso (45%)", icono: "bi-printer" },
  { estado: "", nombre: "Finalizado", hora: "Pendiente", icono: "bi-check2-all" },
  { estado: "", nombre: "Enviado", hora: "Por confirmar", icono: "bi-truck" },
];

const ACTUALIZACIONES = [
  { texto: "Capa 1.240 / 3.200 completada", tiempo: "Hace 2 minutos", color: null },
  { texto: "Verificación de calidad inicial aprobada", tiempo: "Hace 1 hora", color: "#22c55e" },
  { texto: "Pedido asignado a máquina Formlabs 3B+", tiempo: "Hace 3 horas", color: "#3b82f6" },
];

const etiquetaMini = {
  fontSize: 10, fontWeight: 700, textTransform: "uppercase",
  letterSpacing: 1, color: "#9ca3af", marginBottom: 4,
};

function EstadoPedido({ perfil, irA, toast }) {
  return (
    <section id="sec-estado">
      <div className="cl-breadcrumb">
        <a onClick={() => irA("pedidos")}>Mis Pedidos</a>
        <span className="cl-breadcrumb-sep">›</span>
        <span className="cl-breadcrumb-actual">PED-0045</span>
      </div>

      <div className="cl-sec-header">
        <div>
          <h1 className="cl-sec-titulo">Detalles del Seguimiento</h1>
        </div>
        <span className="cl-badge imprimiendo" style={{ fontSize: 13, padding: "7px 16px" }}>
          Imprimiendo ahora
        </span>
      </div>

      <div className="cl-grid-2" style={{ alignItems: "start", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="cl-flujo-card">
            <div className="cl-flujo-header">
              <div className="cl-flujo-titulo">Flujo de Producción</div>
              <div className="cl-flujo-fecha">Iniciado: 12 Oct, 2024</div>
            </div>

            <div className="cl-flujo-steps">
              {FLUJO.map((f) => (
                <div key={f.nombre} className={`cl-flujo-step ${f.estado}`}>
                  <div className="cl-flujo-circulo">
                    <i className={`bi ${f.icono}`}></i>
                  </div>
                  <div className="cl-flujo-nombre">{f.nombre}</div>
                  <div className="cl-flujo-hora">{f.hora}</div>
                </div>
              ))}
            </div>

            <div className="cl-card-titulo" style={{ marginBottom: 12 }}>Actualizaciones en tiempo real</div>
            {ACTUALIZACIONES.map((a) => (
              <div key={a.texto} className="cl-update-item">
                <div className="cl-update-dot" style={a.color ? { background: a.color } : undefined}></div>
                <div>
                  <div className="cl-update-txt">{a.texto}</div>
                  <div className="cl-update-tiempo">{a.tiempo}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="cl-grid-2" style={{ gap: 12 }}>
            <div className="cl-detalle-card">
              <div className="cl-detalle-titulo">
                <i className="bi bi-geo-alt text-morado"></i> Destino de Envío
              </div>
              <div className="cl-detalle-fila">
                <strong>{perfil.nombre}</strong>
                <br />
                Calle de la Innovación, 42
                <br />
                Bogotá, Colombia
              </div>
            </div>
            <div className="cl-detalle-card">
              <div className="cl-detalle-titulo">
                <i className="bi bi-credit-card text-morado"></i> Método de Pago
              </div>
              <div className="cl-detalle-fila">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div
                    style={{
                      background: "#1a1f71", color: "white", borderRadius: 4,
                      padding: "2px 7px", fontSize: 11, fontWeight: 800,
                    }}
                  >
                    VISA
                  </div>
                  Tarjeta Crédito **** 4242
                </div>
                Pagado el 12/10/2024
              </div>
            </div>
            <div className="cl-detalle-card">
              <div className="cl-detalle-titulo">
                <i className="bi bi-headset text-morado"></i> ¿Necesitas ayuda?
              </div>
              <div className="cl-detalle-fila">
                Contacta con soporte técnico
                <br />
                <strong>000 - 000 - 0000</strong>
              </div>
            </div>
            <div className="cl-entrega-card">
              <div>
                <div className="cl-entrega-label">
                  <i className="bi bi-calendar3"></i> Entrega Estimada
                </div>
                <div className="cl-entrega-fecha">18 Oct, 2024</div>
              </div>
              <i className="bi bi-clock" style={{ fontSize: 28, opacity: 0.6 }}></i>
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="cl-card">
            <div
              style={{
                height: 200, background: "#f3f4f6", borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 60, color: "#c4b5fd", marginBottom: 14,
                position: "relative", overflow: "hidden",
              }}
            >
              <i className="bi bi-robot"></i>
              <button
                onClick={() => toast("Abriendo vista ampliada...", "info")}
                style={{
                  position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.5)",
                  border: "none", borderRadius: 8, color: "white", padding: "5px 9px",
                  cursor: "pointer", fontSize: 14,
                }}
              >
                <i className="bi bi-zoom-in"></i>
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#1f2937" }}>Prototipo Epsilon-7</div>
                <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 3 }}>Referencia: ENG-2024-X1</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#5b21b6" }}>$50.000</div>
                <div style={{ fontSize: 10.5, color: "#9ca3af" }}>IVA Incluido</div>
              </div>
            </div>

            <hr className="cl-divisor" />

            <div className="cl-grid-2">
              <div>
                <div style={etiquetaMini}>Material</div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#374151" }}>PLA</div>
              </div>
              <div>
                <div style={etiquetaMini}>Resolución</div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#374151" }}>0.1mm Detalle alto</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECCIÓN: CONFIGURACIÓN
═══════════════════════════════════════════════ */

function Configuracion({ perfil, avatarUrl, onGuardar, onAvatar, onCerrarSesion, toast }) {
  const [draft, setDraft] = useState({ nombre: perfil.nombre, email: perfil.email, telefono: "", empresa: "" });
  const [toggles, setToggles] = useState(TOGGLES_INICIALES);
  const avatarInput = useRef(null);

  const setD = (campo) => (e) => setDraft((d) => ({ ...d, [campo]: e.target.value }));

  return (
    <section id="sec-config">
      <div className="cl-sec-header">
        <div>
          <h1 className="cl-sec-titulo">Configuración</h1>
          <p className="cl-sec-sub">Gestiona tu perfil y preferencias de cuenta.</p>
        </div>
      </div>

      <div className="cl-config-grid" style={{ gap: 16 }}>
        {/* Perfil */}
        <div className="cl-card">
          <div className="cl-card-titulo" style={{ marginBottom: 20 }}>Mi Perfil</div>

          <div className="cl-perfil-big">
            <div className="cl-avatar-big" id="avatarBig">
              {avatarUrl ? <img src={avatarUrl} alt="" /> : iniciales(perfil.nombre)}
              <div className="cl-avatar-overlay" onClick={() => avatarInput.current?.click()}>
                <i className="bi bi-camera"></i>
              </div>
            </div>
            <input
              type="file"
              ref={avatarInput}
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => onAvatar(e.target.files[0])}
            />
            <div>
              <div className="cl-perfil-big-nombre">{perfil.nombre}</div>
              <div className="cl-perfil-big-email">{perfil.email}</div>
              <div className="cl-perfil-big-badge">
                <i className="bi bi-star-fill"></i> Cliente Premium
              </div>
            </div>
          </div>

          <div className="cl-form-group">
            <label className="cl-form-label">Nombre Completo</label>
            <input type="text" className="cl-form-input" placeholder="Tu nombre completo"
              value={draft.nombre} onChange={setD("nombre")} />
          </div>
          <div className="cl-form-group">
            <label className="cl-form-label">Correo Electrónico</label>
            <input type="email" className="cl-form-input" placeholder="tu@correo.com"
              value={draft.email} onChange={setD("email")} />
          </div>
          <div className="cl-form-group">
            <label className="cl-form-label">Teléfono</label>
            <input type="tel" className="cl-form-input" placeholder="300 000 0000"
              value={draft.telefono} onChange={setD("telefono")} />
          </div>
          <div className="cl-form-group">
            <label className="cl-form-label">Empresa (opcional)</label>
            <input type="text" className="cl-form-input" placeholder="ML Mecanizados SAS"
              value={draft.empresa} onChange={setD("empresa")} />
          </div>
          <button className="cl-btn-p" onClick={() => onGuardar(draft)}>
            <i className="bi bi-floppy"></i> Guardar Cambios
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Seguridad */}
          <div className="cl-card">
            <div className="cl-card-titulo" style={{ marginBottom: 16 }}>Seguridad</div>
            <div className="cl-form-group">
              <label className="cl-form-label">Contraseña actual</label>
              <input type="password" className="cl-form-input" placeholder="••••••••" />
            </div>
            <div className="cl-form-group">
              <label className="cl-form-label">Nueva contraseña</label>
              <input type="password" className="cl-form-input" placeholder="Mínimo 6 caracteres" />
            </div>
            <div className="cl-form-group">
              <label className="cl-form-label">Confirmar contraseña</label>
              <input type="password" className="cl-form-input" placeholder="Repite la contraseña" />
            </div>
            <button
              className="cl-btn-o"
              onClick={() => toast("Contraseña actualizada correctamente", "success")}
            >
              <i className="bi bi-shield-lock"></i> Cambiar Contraseña
            </button>
          </div>

          {/* Notificaciones */}
          <div className="cl-card">
            <div className="cl-card-titulo" style={{ marginBottom: 14 }}>Notificaciones</div>
            {toggles.map((t, i) => (
              <div key={t.titulo} className="cl-toggle-row">
                <div>
                  <div className="cl-toggle-titulo">{t.titulo}</div>
                  <div className="cl-toggle-sub">{t.sub}</div>
                </div>
                <div
                  className={`cl-toggle ${t.on ? "on" : ""}`}
                  onClick={() =>
                    setToggles((arr) => arr.map((x, j) => (j === i ? { ...x, on: !x.on } : x)))
                  }
                ></div>
              </div>
            ))}
          </div>

          <button
            className="cl-btn-o"
            style={{ color: "#ef4444", borderColor: "#ef4444", justifyContent: "center" }}
            onClick={onCerrarSesion}
          >
            <i className="bi bi-box-arrow-left"></i> Cerrar Sesión
          </button>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   MODAL: EVALUACIÓN DEL SERVICIO
═══════════════════════════════════════════════ */

function Estrellas({ valor, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="cl-stars" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`cl-star ${n <= valor ? "activa" : ""}`}
          style={hover ? { color: n <= hover ? "#F59E0B" : "#E5E7EB" } : undefined}
          onMouseOver={() => setHover(n)}
          onClick={() => onChange(n)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function ModalEvaluacion({ producto, id, onCerrar, toast }) {
  const [calidad, setCalidad] = useState(0);
  const [tiempo, setTiempo] = useState(0);
  const [comentario, setComentario] = useState("");

  const enviar = () => {
    if (calidad === 0 || tiempo === 0) {
      toast("Por favor califica ambos criterios", "error");
      return;
    }
    const promedio = ((calidad + tiempo) / 2).toFixed(1);
    toast(`Evaluación enviada. Promedio: ${promedio}/5 — ¡Gracias!`, "success");
    setTimeout(onCerrar, 1500);
  };

  return (
    <div
      className="cl-modal-ov abierto"
      id="modalEval"
      onClick={(e) => e.target === e.currentTarget && onCerrar()}
    >
      <div className="cl-modal-box">
        <button className="cl-modal-close" onClick={onCerrar}>
          <i className="bi bi-x"></i>
        </button>

        <div className="cl-breadcrumb" style={{ marginBottom: 14 }}>
          <span>← </span>
          <span className="cl-link-morado" onClick={onCerrar} style={{ cursor: "pointer" }}>
            Volver a Mis Pedidos
          </span>
        </div>

        <div className="cl-modal-titulo">PrintSmart 3D — Evaluar Servicio</div>
        <div className="cl-modal-sub">
          Tu opinión sobre el pedido <strong className="text-morado">{id}</strong> es vital para
          nuestra precisión industrial.
        </div>

        <div
          style={{
            display: "flex", alignItems: "center", gap: 12, padding: 14,
            background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 50, height: 50, background: "#ede9fe", borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, color: "#7c3aed", flexShrink: 0,
            }}
          >
            <i className="bi bi-box"></i>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{producto}</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>Material: Nylon PA12 Carbon Fiber</div>
            <span className="cl-badge entregado" style={{ marginTop: 4, display: "inline-flex" }}>
              Entregado
            </span>
          </div>
        </div>

        <div className="cl-eval-pregunta">1. Calidad del Producto</div>
        <div className="cl-eval-sub">
          ¿Cómo calificaría la precisión técnica y el acabado final de la pieza impresa?
        </div>
        <Estrellas valor={calidad} onChange={setCalidad} />

        <div className="cl-eval-pregunta" style={{ marginTop: 16 }}>2. Tiempo de Entrega</div>
        <div className="cl-eval-sub">
          ¿El pedido llegó dentro de los plazos establecidos y con seguimiento adecuado?
        </div>
        <Estrellas valor={tiempo} onChange={setTiempo} />

        <div className="cl-eval-pregunta" style={{ marginTop: 16 }}>3. Comentarios Detallados</div>
        <div className="cl-eval-sub">
          Sus observaciones nos permiten ajustar nuestros procesos de manufactura.
        </div>
        <textarea
          className="cl-form-input"
          rows="4"
          placeholder="Escribe aquí tu experiencia, sugerencias o cualquier detalle técnico relevante..."
          style={{ resize: "vertical", marginBottom: 16 }}
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        ></textarea>

        <button
          className="cl-btn-p"
          style={{ width: "100%", justifyContent: "center", padding: 13 }}
          onClick={enviar}
        >
          <i className="bi bi-send"></i> Enviar Evaluación
        </button>
        <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", marginTop: 10 }}>
          Al enviar, confirmas que esta es una opinión genuina basada en tu pedido.
        </p>

        <div className="cl-por-que-card" style={{ marginTop: 16 }}>
          <div className="cl-card-titulo" style={{ marginBottom: 12 }}>¿Por qué evaluarnos?</div>
          <div className="cl-por-que-item">
            <i className="bi bi-check-circle-fill"></i>
            Optimizamos la calibración de nuestras impresoras según tu feedback.
          </div>
          <div className="cl-por-que-item">
            <i className="bi bi-check-circle-fill"></i>
            Ajustamos las rutas de logística para reducir los tiempos de entrega.
          </div>
          <div className="cl-por-que-item">
            <i className="bi bi-check-circle-fill"></i>
            Recibe un cupón del 5% de descuento en tu próximo pedido al completar esta encuesta.
          </div>
        </div>
      </div>
    </div>
  );
}