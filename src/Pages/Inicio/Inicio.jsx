
import { useState } from "react";
import "./Inicio.css";

// ==========================================
// LISTA DE PRODUCTOS DE PRINTSMART 3D
// ==========================================

const productos = [

    // Producto 1: Caricaturas coleccionables
    {
        id: 1,
        nombre: "Caricatura coleccionable",
        descripcion: "Figura decorativa impresa en 3D.",
        precio: 35000,

        // Fotografías del carrusel
        imagenes: [
            "/Imagenes/Caricatura Coleccionable.jpeg",
            "/Imagenes/Caricatura Coleccionable 2.jpeg",
            "/Imagenes/Caricatura Coleccionable 3.jpeg",
            "/Imagenes/Caricatura Coleccionable 4.jpeg",
            "/Imagenes/Caricatura Coleccionable 5.jpeg",
            "/Imagenes/Caricatura Coleccionable 6.jpeg",
            "/Imagenes/Caricatura Coleccionable 7.jpeg",
            "/Imagenes/Caricatura Coleccionable 8.jpeg",
            "/Imagenes/Caricatura Coleccionable 9.jpeg",
            "/Imagenes/Caricatura Coleccionable 10.jpeg"
        ]
    },

    // Producto 2: Miniaturas de animales
    {
        id: 2,
        nombre: "Miniaturas de animales",
        descripcion: "Figuras de animales elaboradas en impresión 3D.",
        precio: 18000,

        imagenes: [
            "/Imagenes/Figuras miniaturas de animales.jpeg",
            "/Imagenes/Figura miniatura animales 2.jpeg",
            "/Imagenes/Figura miniatura animales 3.jpeg",
            "/Imagenes/Figura miniatura animales 4.jpeg",
            "/Imagenes/Figura miniatura animales 5.jpeg",
            "/Imagenes/Figura miniatura animales 6.jpeg"
        ]
    },

    // Producto 3: Llaveros de caricaturas
    {
        id: 3,
        nombre: "Llaveros caricatura",
        descripcion: "Llaveros decorativos con diseños de caricaturas.",
        precio: 8000,

        imagenes: [
            "/Imagenes/Llavero caricatura.jpeg",
            "/Imagenes/Llavero Caricatura 2.jpeg",
            "/Imagenes/Llavero Caricatura 3.jpeg"
        ]
    },

    // Producto 4: Piezas mecánicas
    {
        id: 4,
        nombre: "Piezas mecánicas",
        descripcion: "Piezas realizadas mediante impresión 3D.",
        precio: 25000,

        imagenes: [
            "/Imagenes/Pieza mecanica.jpeg",
            "/Imagenes/Pieza mecanica 2.jpeg",
            "/Imagenes/Pieza Mecanica 3.jpeg"
        ]
    },

    // Producto 5: Soportes para controles
    {
        id: 5,
        nombre: "Soporte para control",
        descripcion: "Soportes para organizar controles de videojuegos.",
        precio: 40000,

        imagenes: [
            "/Imagenes/Soporte Control game.jpeg",
            "/Imagenes/Soporte Contro game frente.jpeg",
            "/Imagenes/Soporte Control garras.jpeg",
            "/Imagenes/Soporte Control garras frente.jpeg"
        ]
    },

    // Producto 6: Lámparas decorativas
    {
        id: 6,
        nombre: "Lámparas decorativas",
        descripcion: "Lámparas con diseños decorativos impresos en 3D.",
        precio: 55000,

        imagenes: [
            "/Imagenes/Lampara de Minnie.jpeg",
            "/Imagenes/Lampara Hello kitty.jpeg",
            "/Imagenes/Animal Luminoso.jpeg"
        ]
    },

    // Producto 7: Figuras articuladas
    {
        id: 7,
        nombre: "Figuras articuladas",
        descripcion: "Figuras y modelos articulados impresos en 3D.",
        precio: 30000,

        imagenes: [
            "/Imagenes/Reptil Articulado.jpeg",
            "/Imagenes/Dragon Espinozo.jpeg"
        ]
    },

    // Producto 8: Llaveros articulados
    {
        id: 8,
        nombre: "Llaveros articulados",
        descripcion: "Llaveros en miniatura con diseños articulados.",
        precio: 12000,

        imagenes: [
            "/Imagenes/Llavero miniatura articulado.jpeg",
            "/Imagenes/Llaveros miniatura articulados.jpeg"
        ]
    }

];


// ==========================================
// COMPONENTE DE CADA TARJETA DE PRODUCTO
// ==========================================

function TarjetaProducto({ producto }) {

    // Guarda cuál fotografía se está mostrando
    const [imagenActual, setImagenActual] = useState(0);

    // Muestra la siguiente fotografía
    const siguienteImagen = () => {

        // Si estamos en la última, volvemos a la primera
        if (imagenActual === producto.imagenes.length - 1) {

            setImagenActual(0);

        } else {

            setImagenActual(imagenActual + 1);

        }

    };

    // Muestra la fotografía anterior
    const anteriorImagen = () => {

        // Si estamos en la primera, vamos a la última
        if (imagenActual === 0) {

            setImagenActual(producto.imagenes.length - 1);

        } else {

            setImagenActual(imagenActual - 1);

        }

    };

    // ==========================================
    // BOTÓN AGREGAR AL CARRITO
    // ==========================================

    const agregarCarrito = () => {

        // Función temporal mientras creamos el carrito
        alert(
            producto.nombre +
            ": pronto podrás agregar este producto al carrito."
        );

    };

    // ==========================================
    // BOTÓN COMPRAR AHORA
    // ==========================================

    const comprarProducto = () => {

        // Mensaje temporal mientras creamos el Login
        alert("Para comprar debes iniciar sesión.");

    };

    return (

        // Contenedor principal de la tarjeta
        <div className="tarjeta-producto">

            {/* Carrusel de fotografías */}
            <div className="carrusel-producto">

                {/* Fotografía seleccionada */}
                <img
                    src={producto.imagenes[imagenActual]}
                    alt={producto.nombre}
                />

                {/* Flechas visibles cuando hay varias fotos */}
                {producto.imagenes.length > 1 && (

                    <div className="controles-carrusel">

                        {/* Fotografía anterior */}
                        <button
                            type="button"
                            onClick={anteriorImagen}
                            aria-label="Imagen anterior"
                        >
                            ❮
                        </button>

                        {/* Contador de fotografías */}
                        <span>
                            {imagenActual + 1} / {producto.imagenes.length}
                        </span>

                        {/* Fotografía siguiente */}
                        <button
                            type="button"
                            onClick={siguienteImagen}
                            aria-label="Imagen siguiente"
                        >
                            ❯
                        </button>

                    </div>

                )}

            </div>

            {/* Información del producto */}
            <div className="informacion-producto">

                {/* Nombre */}
                <h3>{producto.nombre}</h3>

                {/* Descripción */}
                <p>{producto.descripcion}</p>

                {/* Precio en pesos colombianos */}
                <h4>
                    ${producto.precio.toLocaleString("es-CO")}
                </h4>

                {/* Contenedor de los dos botones */}
                <div className="botones-producto">

                    {/* Agregar al carrito */}
                    <button
                        type="button"
                        className="btn-carrito"
                        onClick={agregarCarrito}
                    >
                        🛒 Agregar
                    </button>

                    {/* Comprar ahora */}
                    <button
                        type="button"
                        className="btn-comprar"
                        onClick={comprarProducto}
                    >
                        Comprar ahora
                    </button>

                </div>

            </div>

        </div>

    );

}


// ==========================================
// COMPONENTE PRINCIPAL DE INICIO
// ==========================================

function Inicio() {

    return (

        // Contenedor general de la página
        <div className="pagina-inicio">

            {/* ==================================
                PRESENTACIÓN DE PRINTSMART 3D
            ================================== */}

            <section id="inicio" className="presentacion">

                {/* Información de bienvenida */}
                <div className="informacion-inicio">

                    {/* Título principal */}
                    <h1>
                        Bienvenido a
                        <span> PrintSmart 3D</span>
                    </h1>

                    {/* Eslogan */}
                    <h2>
                        Imagina, Diseña e Imprime
                    </h2>

                    {/* Descripción */}
                    <p>
                        En PrintSmart 3D transformamos tus
                        ideas en realidad mediante la
                        tecnología de impresión 3D.

                        Conoce nuestros productos,
                        diseños personalizados y
                        materiales de impresión.
                    </p>

                    {/* Botón para ir al catálogo */}
                    <a
                        href="#catalogo"
                        className="btn-catalogo"
                    >
                        Explorar catálogo
                    </a>

                </div>

                {/* Logo de la empresa */}
                <div className="imagen-presentacion">

                    <img
                        src="/Imagenes/logo.jpeg"
                        alt="Logo PrintSmart 3D"
                    />

                </div>

            </section>


            {/* ==================================
                CATÁLOGO DE PRODUCTOS
            ================================== */}

            <section id="catalogo" className="catalogo">

                {/* Título */}
                <h2>Nuestro catálogo</h2>

                {/* Descripción */}
                <p>
                    Descubre nuestros productos y diseños
                    realizados mediante impresión 3D.
                </p>

                {/* Contenedor de las tarjetas */}
                <div className="productos">

                    {/* Creamos una tarjeta por cada producto */}
                    {productos.map((producto) => (

                        <TarjetaProducto
                            key={producto.id}
                            producto={producto}
                        />

                    ))}

                </div>

            </section>


            {/* ==================================
                INFORMACIÓN DE LA EMPRESA
            ================================== */}

            <section id="nosotros" className="nosotros">

                <h2>¿Quiénes somos?</h2>

                <p>
                    PrintSmart 3D es un proyecto dedicado
                    a ofrecer soluciones de impresión 3D,
                    permitiendo crear figuras, prototipos
                    y diseños personalizados.
                </p>

            </section>


            {/* ==================================
                CONTACTO
            ================================== */}

            <section id="contacto" className="contacto">

                <h2>Contáctanos</h2>

                <p>
                    ¿Tienes una idea para imprimir en 3D?
                    Explora nuestro catálogo y conoce
                    nuestros productos.
                </p>

            </section>

        </div>

    );

}

// Exportamos Inicio para utilizarlo en App.jsx
export default Inicio;
