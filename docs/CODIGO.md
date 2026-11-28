# Guía del código por archivo

Esta guía complementa los comentarios escritos dentro de los archivos. Los bloques `/** ... */` describen funciones, componentes y parámetros; los comentarios `//` explican decisiones o reglas concretas. En CSS se usan comentarios `/* ... */` y en HTML `<!-- ... -->`.

## Por dónde empezar

1. [index.html](../index.html) declara el contenedor `root` y carga el módulo de entrada.
2. [main.jsx](../src/main.jsx) importa los estilos locales y monta React. [native.css](../src/styles/native.css) define la base de controles y utilidades; [Icon.jsx](../src/components/Icon.jsx) contiene los iconos SVG sin fuentes externas.
3. [App.jsx](../src/App.jsx) configura las rutas con `HashRouter` y el estado con `AppProvider`.
4. [Administrador.jsx](../src/Pages/Administrador/Administrador.jsx) organiza menú, barra superior, páginas y diálogos.
5. Cada archivo de `Pages` recibe la búsqueda de su sección y utiliza `useAppData()` para consultar o modificar los registros compartidos.

El recorrido de una modificación es: **formulario → validación → setter del contexto → nuevo estado → actualización de la pantalla y escritura en localStorage**.

## Entrada, estado y datos

| Archivo                                                     | Responsabilidad y puntos de lectura                                                                                                                                      |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [index.html](../index.html)                                 | Documento inicial, metadatos, favicon y contenedor de React. Los comentarios explican la relación de `root` con `main.jsx`.                                              |
| [src/main.jsx](../src/main.jsx)                             | Entrada de React, orden de estilos y uso de `StrictMode` en desarrollo.                                                                                                  |
| [src/App.jsx](../src/App.jsx)                               | Envuelve el panel con rutas y proveedor. No implementa reglas de negocio.                                                                                                |
| [AppContext.js](../src/context/AppContext.js)               | Declara el contexto y `useAppData()`. Los consumidores deben estar dentro de `AppProvider`.                                                                              |
| [AppProvider.jsx](../src/context/AppProvider.jsx)           | Inicializa materiales, pedidos, usuarios, ajustes e historial. `notify` controla avisos; `logActivity` conserva 40 eventos y `money` formatea importes.                  |
| [usePersistentState.js](../src/hooks/usePersistentState.js) | Lee JSON una vez al inicializar el estado y guarda cambios mediante un efecto. Los comentarios detallan la recuperación de datos y el evento de error de almacenamiento. |
| [initialData.js](../src/data/initialData.js)                | Documenta los campos, unidades y alcance de las semillas. También contiene la serie fija de informes.                                                                    |

`localStorage` conserva registros al cerrar y abrir el navegador. `sessionStorage` solo guarda el cierre explícito de la sesión de demostración en esa pestaña. Los diálogos, filtros y borradores usan `useState` y no se guardan por sí mismos.

## Componentes compartidos

| Archivo                                                | Qué recibe y qué hace                                                                                                                                                                          |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Sidebar.jsx](../src/components/Sidebar.jsx)           | Recibe `collapsed` y callbacks del layout. `options` relaciona rutas, etiquetas e iconos; `NavLink` detecta la ruta activa. El logo se carga desde `public/logo2.jpeg` usando la base de Vite. |
| [Topbar.jsx](../src/components/Topbar.jsx)             | Recibe usuario, sección y búsqueda. Notifica cambios mediante callbacks; no filtra registros dentro del componente.                                                                            |
| [UI.jsx](../src/components/UI.jsx)                     | Documenta `Icon`, `Button`, `PageHeader`, `StatCard`, `Badge`, `EmptyState`, `Switch` y `Modal`. Explica variantes, contenido opcional, estado controlado y foco del diálogo nativo.           |
| [ActivityList.jsx](../src/components/ActivityList.jsx) | Recibe eventos ya ordenados/filtrados y los muestra. Los tiempos son textos de los datos, no un reloj relativo automático.                                                                     |
| [BarChart.jsx](../src/components/BarChart.jsx)         | Recibe categorías y series de valores. Registra Chart.js, renderiza barras y una tabla equivalente accesible. `max` es una sugerencia de escala.                                               |
| [NewJobForm.jsx](../src/components/NewJobForm.jsx)     | Recibe `onClose` y una cotización opcional para precargar campos. Valida, convierte cantidades, genera el ID del pedido y navega a Pedidos.                                                    |

Una **prop** es un dato o función que recibe un componente. Un **callback** permite avisar al componente padre de una acción. Un **componente controlado**, como el buscador o un interruptor, recibe su valor desde React y solicita cambios mediante un callback.

## Pantallas

| Archivo                                                           | Funciones y reglas documentadas                                                                                                                                                                                                        |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Administrador.jsx](../src/Pages/Administrador/Administrador.jsx) | `readSession`, `openSection`, `signIn`, `signOut`, búsquedas por sección, menú móvil y selector de diálogo global. Distingue vista de mantenimiento y sesión de demostración de una autenticación real.                                |
| [Dashboard.jsx](../src/Pages/Dashboard.jsx)                       | Bases históricas de ejemplo, incorporación de pedidos completados, variación de stock en kg, escalado de periodos, búsqueda entre módulos y exportación PDF.                                                                           |
| [Materials.jsx](../src/Pages/Materials.jsx)                       | `materialStatus` clasifica stock; `change` actualiza el borrador; `submit` valida y guarda; `edit` carga el formulario; `exportData` descarga las filas filtradas. Renombrar también actualiza pedidos asociados.                      |
| [Orders.jsx](../src/Pages/Orders.jsx)                             | `nextStatus` describe el siguiente paso de la UI. `advance` valida material/stock y descuenta consumo al iniciar impresión. `csv` exporta el subconjunto visible. Se explica la conversión g→kg/L y el alcance local de la transición. |
| [Calculator.jsx](../src/Pages/Calculator.jsx)                     | Densidades, cálculo de peso con relleno y referencia sin STL. `valid` controla las acciones; `readFile` analiza el archivo y descarta resultados de lecturas antiguas; `pdf` genera la cotización.                                     |
| [Reports.jsx](../src/Pages/Reports.jsx)                           | Intersección de cliente, periodo y búsqueda. Los totales, barras, PDF y Excel comparten las filas filtradas; los demás indicadores conservan valores de ejemplo.                                                                       |
| [Users.jsx](../src/Pages/Users.jsx)                               | Borrador inicial, búsqueda/pestañas, creación o edición, validación del nombre, normalización del correo, duplicados e interruptores de seguridad de demostración.                                                                     |
| [Settings.jsx](../src/Pages/Settings.jsx)                         | `matches` filtra tarjetas; `saveCurrency` y `saveRegion` aplican borradores; `optimize` elimina cachés temporales propias y actualiza el medidor ilustrativo.                                                                          |

### Cómo leer la validación en Users.jsx

```js
if (!form.name.trim())
  return notify("Escribe el nombre del usuario.", "warning");
```

`form.name` es el nombre del borrador. `trim()` quita los espacios de los extremos; si solo había espacios, queda una cadena vacía. `!` comprueba ese caso y `notify` muestra el aviso. `return` termina el envío antes de construir o guardar el usuario.

En el mismo archivo:

- `editing === null` significa alta; si contiene un ID, se reemplaza ese registro.
- El correo se normaliza con `trim().toLowerCase()` antes de comprobar duplicados.
- La búsqueda de duplicados excluye el usuario editado para permitir guardar su mismo correo.
- `setUsers` crea una colección nueva para que React actualice sus consumidores.
- `logActivity` y `notify` registran el resultado y avisan al usuario.
- El formulario deshabilita el cambio de rol/estado del administrador principal; esta protección es de interfaz, no una autorización de servidor.

## Utilidades

| Archivo                                     | Contratos principales                                                                                                                                                                                                                      |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [calculator.js](../src/utils/calculator.js) | `parseSTL(ArrayBuffer)` devuelve volumen en cm³ y caras leídas o lanza un error. Explica la estructura binaria, lectura ASCII y volumen firmado. `calculateQuote` documenta unidades, valores de referencia, rubros y recargo sobre costo. |
| [export.js](../src/utils/export.js)         | `download` crea y libera una URL temporal; `csvCell` escapa celdas; `exportCSV` genera UTF-8; `exportExcel` genera SpreadsheetML `.xml`; `exportPDF` carga jsPDF bajo demanda, ajusta líneas y pagina el contenido.                        |

Las utilidades de cálculo no acceden a React ni al almacenamiento. Las de exportación usan APIs del navegador para descargar archivos, por lo que se ejecutan desde acciones de la interfaz.

## Estilos

| Archivo                                                           | Qué documenta                                                                                                                                                                                                                                                 |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [index.css](../src/index.css)                                     | Base global, tipografía, modelo de tamaño, contenedor React, herencia de fuente y foco visible.                                                                                                                                                               |
| [App.css](../src/App.css)                                         | Archivo reservado del esqueleto original; no está importado actualmente por `App.jsx`.                                                                                                                                                                        |
| [Administrador.css](../src/Pages/Administrador/Administrador.css) | Incluye comentarios por bloques: variables, layout, menú/logo, barra superior, botones, tarjetas, tablas, formularios, cada módulo, diálogos, avisos y accesibilidad. También explica las adaptaciones para escritorio, tableta, móvil y movimiento reducido. |

Para cambiar un estilo, busca primero el nombre de su clase en JSX y luego su selector CSS. `src/styles/native.css` aporta la base local de controles y utilidades; esta hoja define los estilos de PrintSmart sin modificar `node_modules`.

## Configuración y archivos auxiliares

| Archivo                                                   | Función                                                                                                                                                                                |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [vite.config.js](../vite.config.js)                       | Activa el plugin React y excluye `.qa` de la vigilancia de archivos para evitar bloqueos de los perfiles de navegador.                                                                 |
| [eslint.config.js](../eslint.config.js)                   | Documenta reglas JavaScript/React, exclusión de `dist` y variables globales de navegador frente a Node.                                                                                |
| [package.json](../package.json)                           | Manifiesto: dependencias y scripts `dev`, `build`, `preview`, `lint` y `test`. JSON no admite comentarios, por lo que su explicación se mantiene aquí y en el README.                  |
| [package-lock.json](../package-lock.json)                 | Resolución de versiones para instalaciones reproducibles con `npm ci`. Lo administra npm; no se añaden comentarios porque debe conservar su formato JSON.                              |
| [.gitignore](../.gitignore)                               | Excluye dependencias, compilación, archivos de editor y artefactos de QA del control de versiones.                                                                                     |
| [tests/business.test.js](../tests/business.test.js)       | Explica la cotización esperada, proporcionalidad de peso/capa, tetraedro de volumen conocido, codificación STL y protección CSV. Se ejecuta con `npm test`.                            |
| [scripts/browser-smoke.mjs](../scripts/browser-smoke.mjs) | Documenta conexión CDP, correlación de mensajes, espera de UI, eventos de inputs controlados, capturas, almacenamiento y comprobación de descargas. Requiere perfil de prueba aislado. |

`public/` contiene recursos que Vite sirve por ruta: logo y favicon, entre otros. `src/assets/` conserva recursos del proyecto inicial. Las imágenes, fuentes y archivos generados de `dist/` no reciben comentarios dentro de sus datos; su uso se documenta en los componentes o en esta guía.

## Documentos de apoyo

- [README.md](../README.md): instalación, ejecución, funciones, limitaciones y comandos.
- [ARQUITECTURA.md](ARQUITECTURA.md): relaciones entre módulos, fórmulas y reglas de negocio.
- [VERIFICACION.md](VERIFICACION.md): recorrido verificado y cómo repetir las pruebas.
- Este archivo: índice para localizar las explicaciones dentro del código.
