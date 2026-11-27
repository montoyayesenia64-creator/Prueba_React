
import "./Navbar.css";

// Componente que contiene la barra de navegación
function Navbar() {

    return (

        // Barra principal de navegación
        <nav className="navbar">

            {/* Logo de PrintSmart 3D */}
            <div className="logo">

            {/* Imagen del logo de PrintSmart 3D */}
            <img
                src="/Imagenes/logo.jpeg"
                alt="Logo PrintSmart 3D"
                className="imagen-logo"
            />

                <h2>
                    PrintSmart <span>3D</span>
                </h2>

            </div>

            {/* Menú de navegación */}
            <ul className="menu">

                {/* Enlace a la página de inicio */}
                <li>
                    <a href="#inicio">Inicio</a>
                </li>

                {/* Enlace al catálogo de productos */}
                <li>
                    <a href="#catalogo">Catálogo</a>
                </li>

                {/* Enlace a la información de la empresa */}
                <li>
                    <a href="#nosotros">Nosotros</a>
                </li>

                {/* Enlace a la sección de contacto */}
                <li>
                    <a href="#contacto">Contacto</a>
                </li>

            </ul>

            {/* Botones de acceso al sistema */}
            <div className="botones-navbar">

                {/* Botón para iniciar sesión */}
                <a href="#login" className="btn-login">
                    Iniciar sesión
                </a>

                {/* Botón para crear una cuenta */}
                <a href="#registro" className="btn-registro">
                    Crear cuenta
                </a>

            </div>

        </nav>

    );

}

// Exportamos el componente para utilizarlo en App.jsx
export default Navbar;
