/**
 * @file Punto de entrada que Vite carga desde index.html.
 * Los estilos de Bootstrap se importan antes que index.css para permitir ajustes
 * propios. StrictMode ayuda a detectar efectos sin limpieza durante el desarrollo.
 */
import React from "react";
import ReactDOM from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./index.css";
import App from "./App.jsx";

// React administra el contenido del contenedor #root declarado en index.html.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
