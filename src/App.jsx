
import Navbar from "./Components/Navbar/Navbar";
import Inicio from "./Pages/Inicio/Inicio";
import "./App.css";

// Componente principal de PrintSmart 3D
function App() {

    return (

        // Contenedor principal de la aplicación
        <div>

            {/* Barra de navegación */}
            <Navbar />

            {/* Página principal de PrintSmart 3D */}
            <Inicio />

        </div>

    );

}

// Exportamos el componente principal
export default App;
