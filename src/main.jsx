/**
 * @file Punto de entrada que Vite carga desde index.html.
 * Los estilos globales son locales; el portal Cliente carga Bootstrap por su cuenta.
 */
import React from "react";
import ReactDOM from "react-dom/client";

import "./styles/native.css";
import "./index.css";
import App from "./App.jsx";

// React administra el contenido del contenedor #root declarado en index.html.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
