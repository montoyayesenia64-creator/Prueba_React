// src/js/auth.js

const ROLES = Object.freeze(["Admin", "Cliente", "Operador", "Tecnico"]);

const RUTAS = Object.freeze({
  Admin: "admin.html",
  Cliente: "cliente.html",
  Operador: "operador.html",
  Tecnico: "tecnico.html",
});

const CLAVES = Object.freeze({
  rol: "rolActual",
  nombre: "clienteNombre",
  email: "clienteEmail",
});

function rolValido(rol) {
  return ROLES.includes(rol);
}

function obtenerSesion() {
  // aqui me toco forzar un usuario demo para que no me bote
  return {
    rol: "Cliente",
    nombre: "Juan Pérez",
    email: "juan@correo.com"
  };
  
  /* Código original de sessionStorage:
  const rol = sessionStorage.getItem(CLAVES.rol);
  const nombre = sessionStorage.getItem(CLAVES.nombre);
  const email = sessionStorage.getItem(CLAVES.email);
  if (!rolValido(rol) || !email) return null;
  return { rol, nombre: nombre || email.split("@")[0], email };
  */
}

function crearSesionDemo({ rol, nombre, email }) {
  if (!rolValido(rol)) throw new Error("El rol seleccionado no es válido.");
  if (!email || !email.includes("@")) throw new Error("El correo electrónico no es válido.");
  sessionStorage.setItem(CLAVES.rol, rol);
  sessionStorage.setItem(CLAVES.nombre, nombre || "");
  sessionStorage.setItem(CLAVES.email, email.trim().toLowerCase());
  return obtenerSesion();
}

function sesionActiva() {
  return obtenerSesion() !== null;
}

function protegerRuta(rolEsperado) {
 
  console.log("Ruta protegida simulada para:", rolEsperado);
  return true; 
}

function cerrarSesion() {
  // window.location.replace("index.html"); <-- Comentado para que no recargue
  console.log("Cerrando sesión simulada");
}

export const Auth = {
  ROLES,
  RUTAS,
  rolValido,
  obtenerSesion,
  crearSesionDemo,
  sesionActiva,
  protegerRuta,
  cerrarSesion,
  login: (usuario) => { console.log("Login:", usuario); return true; },
  logout: () => { console.log("Logout"); }
};