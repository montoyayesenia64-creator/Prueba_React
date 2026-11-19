/**
 * @file Componente raíz de PrintSmart 3D.
 * HashRouter interpreta las rutas después de # y AppProvider comparte los datos
 * con todas las pantallas. Este orden permite usar navegación dentro del proveedor.
 */
import Administrador from "./Pages/Administrador/Administrador.jsx";
import { HashRouter } from "react-router-dom";
import AppProvider from "./context/AppProvider";

/** Monta las dependencias globales y la interfaz del administrador. */
function App() {
  return (
    <HashRouter>
      <AppProvider>
        <Administrador />
      </AppProvider>
    </HashRouter>
  );
}

export default App;
