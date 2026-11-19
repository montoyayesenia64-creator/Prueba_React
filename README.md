# PrintSmart 3D

Panel de administración de impresión 3D construido con **React + Vite + Bootstrap 5**, siguiendo las siete capturas de referencia. Incluye navegación, formularios, inventario, pedidos, cotizaciones, gráficos y exportaciones. La aplicación y sus datos funcionan localmente en el navegador.

## Ejecutar el proyecto

Requiere Node.js 22.12 o posterior. Se verificó con Node.js 24.

```bash
npm ci
npm run dev
```

Abre la dirección que indique Vite, normalmente `http://localhost:5173`. En PowerShell, si la política de ejecución bloquea `npm.ps1`, utiliza `npm.cmd ci` y `npm.cmd run dev`; no necesitas cambiar la política del equipo.

```bash
npm run build     # Compilación de producción en dist/
npm run preview   # Servir la compilación localmente
npm test          # Pruebas de cotización, STL y protección del CSV
```

Las dependencias ya utilizadas por el proyecto se conservaron. Bootstrap y Bootstrap Icons se importan en `src/main.jsx`; los componentes interactivos usan estado de React y diálogos nativos, sin manejadores HTML en cadenas de texto ni manipulación de Bootstrap JS sobre el DOM de React.

## Pantallas y funciones

| Pantalla | Ruta | Funciones |
| --- | --- | --- |
| Panel de Control | `/#/dashboard` | Indicadores, gráfico con tooltips, periodos de 7/30/90 días, búsqueda de pedidos/materiales/actividad, historial y PDF. |
| Materiales | `/#/materiales` | Registrar y editar materiales, color, proveedor, stock, precio, unidad, re-pedido y caducidad; filtrar por estado/tipo, buscar y exportar CSV. Selecciona el nombre de un material para editarlo. |
| Pedidos | `/#/pedidos` | Seleccionar detalle, filtrar, buscar, aprobar revisión técnica/financiera, iniciar impresión, completar o rechazar; exportar CSV. |
| Cálculos | `/#/calculos` | Cargar o arrastrar STL ASCII/binario, modelo de referencia, material, relleno, capa, horas de mano de obra, recargo, desglose, PDF y creación de pedido con la cotización. |
| Informes | `/#/reportes` | Gráfico de ingresos/gastos, filtro por cliente/periodo, búsqueda, ROI de ejemplo, PDF y hoja Excel XML. Los totales y exportaciones respetan los filtros. |
| Usuarios | `/#/usuarios` | Añadir y editar usuarios, roles, estado, búsqueda, pestañas de operadores/clientes y preferencias de seguridad. El administrador principal conserva su rol y estado. |
| Configuración | `/#/configuracion` | Moneda/símbolo, formato regional, zona horaria, modo mantenimiento con vista de visitante y limpieza de cachés temporales de PrintSmart. |

La barra superior permite buscar dentro del módulo, consultar notificaciones, historial y perfil. El menú se puede contraer en escritorio y abrir como panel en móvil. El botón **Nuevo Trabajo de Impresión** abre un formulario desde cualquier pantalla. Cerrar sesión muestra la entrada a la demostración y conserva los registros.

## Recorrido de uso

1. En **Materiales**, registra un suministro o selecciona uno existente para actualizarlo.
2. En **Cálculos**, utiliza el modelo inicial o carga un STL en milímetros. Ajusta los parámetros; el precio se recalcula inmediatamente.
3. Descarga la cotización PDF o pulsa **Crear pedido con esta cotización** y completa el cliente.
4. En **Pedidos**, selecciona el ID: **aprobar revisión técnica → aprobar e iniciar impresión → completar trabajo**.
5. Al iniciar la impresión se comprueba el stock y se descuenta el consumo estimado una sola vez. Si falta stock, repón el material y vuelve a aprobar. Para resina se usa una densidad estimada de 1.1 g/ml para convertir gramos a litros.
6. Revisa los cambios en el inventario y en el historial; recarga para comprobar la persistencia.

## Datos y alcance

- Los registros se guardan con claves `printsmart.*.v1` en `localStorage`. La sesión de demostración usa `sessionStorage`. No se necesita configurar un `.env`.
- Los datos pertenecen a **ese navegador y origen**; `localhost` y `127.0.0.1`, o puertos diferentes, tienen almacenamientos distintos. No se sincronizan entre dispositivos ni pestañas abiertas.
- Las capturas contienen cifras agregadas e históricas. Se conservaron como datos de demostración cuando no dependen de los registros visibles: telemetría, variaciones porcentuales, ROI, eficiencia, consumo proyectado y capacidad del servidor. El inventario, las alertas, el estado de pedidos y los totales de informes sí se calculan desde sus registros. Los valores pueden diferir de las capturas para conservar coherencia con los datos.
- El dashboard parte de un agregado histórico de ingresos, 25 trabajos previos y stock base. Incorpora los pedidos completados y variaciones de inventario de esta demostración. El selector de días escala la serie de ejemplo proporcionalmente; no consulta una API histórica.
- **No hay backend ni autenticación real.** Usuarios, roles, 2FA y lista de IP son gestión y preferencias de demostración; no implementan autorización, MFA ni restricciones de red. El mantenimiento ofrece una vista previa para visitantes; no bloquea un servidor público.
- La moneda cambia denominación y símbolo, sin convertir los importes. El idioma regional cambia formatos numéricos y de fechas; la interfaz permanece en español. La zona horaria se usa en la fecha del pie; los PDF llevan fecha de Bogotá.
- Los medidores de almacenamiento en GB son ilustrativos. Optimizar revisa y elimina únicamente cachés cuyo nombre empiece por `printsmart-temp-`; no libera una base de datos remota ni elimina registros. El medidor temporal simula el resultado.

Para operar con usuarios reales se necesita añadir API, base de datos, autenticación y autorización en servidor. El descuento de stock y el cambio de estado deben ejecutarse juntos en una transacción del backend.

## Cotizaciones y archivos

La referencia inicial reproduce el desglose de la imagen: material **52.29**, máquina **18.50**, electricidad **3.12**, mano de obra **87.50**, recargo del 25% **40.35**, total **201.76** (con formato colombiano se muestra `201,76`). El porcentaje es un **recargo sobre costo**, no margen de utilidad sobre ventas.

El STL se analiza en el navegador; no se sube a ningún servicio. Debe estar expresado en **milímetros**, tener orientación consistente y ser una malla cerrada. El volumen se calcula por tetraedros con signo, con conversión de mm³ a cm³. Esto no comprueba por completo la integridad de la malla ni sustituye un laminador. El relleno considera 15% de paredes y 85% de volumen interior; tiempos, densidades y tarifas son estimaciones de demostración. El modelo de biblioteca es una referencia de cálculo, sin un archivo 3D descargable.

El límite aceptado es 500 MB; los archivos grandes pueden consumir mucha memoria y tardar en procesarse. Se recomienda usar mallas pequeñas para la demostración. El archivo original no se conserva al cambiar de módulo o recargar; los pedidos guardan sus valores de cotización.

Las descargas funcionan sin servidor:

- **PDF:** documentos generados con jsPDF, con salto de página para contenido extenso.
- **CSV:** UTF-8 con BOM y separador `;`, escapado de comillas y protección frente a fórmulas introducidas en campos de texto.
- **Excel:** SpreadsheetML 2003 **`.xml`**, un formato de hoja de cálculo que Excel puede abrir. No es un archivo `.xlsx` renombrado. Importes numéricos y texto se guardan con tipos separados.

## Código y verificación

Consulta [la arquitectura y reglas de negocio](docs/ARQUITECTURA.md) y [el registro de verificación y su reproducción](docs/VERIFICACION.md).

Los estilos de las capturas están centralizados en `src/Pages/Administrador/Administrador.css`. Los colores, el ancho del menú y la altura de la barra superior se ajustan mediante variables CSS al principio del archivo. Las páginas se apilan en pantallas pequeñas y las tablas tienen desplazamiento propio; no expanden el ancho de la página.

Para volver a los ejemplos iniciales, elimina **solo** las claves `printsmart.*` del almacenamiento de este sitio desde las herramientas de desarrollo del navegador y recarga. Esta acción borra los registros locales de PrintSmart.
