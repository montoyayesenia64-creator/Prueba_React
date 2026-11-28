/**
 * @file Componente raíz de PrintSmart 3D: une el trabajo de todo el equipo.
 *
 *   /            -> Inicio + catálogo público (Eilin)
 *   /cliente     -> Portal del cliente (Jade)
 *   /operario    -> Dashboard operativo (Yesenia)
 *   /dashboard, /materiales, /pedidos, /calculos, /reportes, /usuarios, ...
 *                -> Panel del administrador (Camilo)
 *
 * HashRouter interpreta las rutas después de # y AppProvider comparte los datos
 * del panel de administrador con todas las pantallas.
 */
import { lazy, Suspense } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import AppProvider from "./context/AppProvider";
import Navbar from "./Components/Navbar/Navbar";
import Inicio from "./Pages/Inicio/Inicio";
import Operario from "./Pages/Operario/Operario";
import Administrador from "./Pages/Administrador/Administrador.jsx";

// El portal Cliente usa Bootstrap; se carga solo cuando se visita /cliente.
const Cliente = lazy(() => import("./Pages/Cliente/Cliente.jsx"));

/** Página pública: barra de navegación y catálogo. */
function PaginaInicio() {
  return (
    <div className="pagina-inicio">
      <Navbar />
      <Inicio />
    </div>
  );
}

/** Monta las dependencias globales y las rutas de cada módulo. */
function App() {
  return (
    <HashRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<PaginaInicio />} />
          <Route
            path="/cliente"
            element={
              <Suspense fallback={null}>
                <Cliente />
              </Suspense>
            }
          />
          <Route path="/operario" element={<Operario />} />
          <Route path="/*" element={<Administrador />} />
        </Routes>
      </AppProvider>
    </HashRouter>
  );
}

export default App;
