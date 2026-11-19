# Arquitectura y reglas de negocio

## Organización

```text
src/
  App.jsx                          HashRouter y proveedor de datos
  main.jsx                         React, Bootstrap e iconos
  index.css                        Normalización y tipografía
  components/
    Sidebar.jsx                    Navegación y menú adaptable
    Topbar.jsx                     Búsqueda, actividad y perfil
    UI.jsx                         Botones, tarjetas, estados, switches y diálogos
    BarChart.jsx                   Chart.js y tabla accesible equivalente
    ActivityList.jsx               Lista compartida de actividad
    NewJobForm.jsx                 Alta de pedidos desde menú/cotización
  context/
    AppContext.js                  Contexto y hook de acceso
    AppProvider.jsx                Estado compartido, moneda, avisos e historial
  hooks/usePersistentState.js      Inicialización y escritura en localStorage
  data/initialData.js              Semillas y serie histórica
  utils/
    calculator.js                  Funciones puras de volumen y cotización
    export.js                      PDF, CSV y SpreadsheetML
  Pages/
    Administrador/
      Administrador.jsx            Layout, rutas, sesión y diálogos globales
      Administrador.css            Sistema visual y puntos de adaptación
    Dashboard.jsx
    Materials.jsx
    Orders.jsx
    Calculator.jsx
    Reports.jsx
    Users.jsx
    Settings.jsx
tests/business.test.js             Pruebas de cálculo, STL y CSV
scripts/browser-smoke.mjs          Verificación con navegador mediante CDP
```

## Flujo de estado

`Formulario → validación → AppProvider → React + localStorage → tablas / indicadores / historial`.

Las páginas comparten materiales, pedidos, usuarios, configuración e historial mediante contexto. Búsquedas, pestañas y diálogos son estado de interfaz. Los filtros y búsquedas se aplican a los registros que también se exportan. HashRouter permite recargar una sección y utilizar atrás/adelante sin configurar reglas de reescritura en el servidor estático.

`usePersistentState` recupera datos serializados al iniciar; un JSON ilegible o de tipo principal incorrecto recupera la semilla. Si el navegador rechaza una escritura se muestra un aviso. No existe migración de esquemas de registros ni validación exhaustiva de valores modificados manualmente en DevTools. Las claves v1 distinguen este esquema de futuras versiones.

El historial conserva los 40 eventos más recientes; sus textos relativos iniciales son de ejemplo. Los eventos nuevos se etiquetan “Ahora mismo”. Los originales STL se mantienen únicamente en memoria mientras está montada la calculadora.

## Materiales

- Stock en kg o L; cantidades de re-pedido en la misma unidad.
- `stock < re-pedido`: crítico.
- `re-pedido <= stock <= 2 × re-pedido`: suficiente.
- `stock > 2 × re-pedido`: óptimo.
- Valor del inventario: suma de `stock × precio por unidad`.
- Caducidad: lotes vencidos o con fecha dentro de los próximos 30 días.
- Nombres únicos sin distinguir mayúsculas. Renombrar actualiza la referencia textual del material en pedidos existentes.

## Pedidos

```text
Pendiente técnico → Pendiente finanzas → En producción → Completado
          ↘ Rechazado          ↘ Rechazado
```

El inicio de producción valida disponibilidad y descuenta gramos/1000 para materiales en kg; en resina usa gramos/1100 para obtener litros. Si el consumo supera el stock, conserva el estado y avisa. Solo se muestra el siguiente paso válido. Los pedidos en producción no se pueden rechazar con este flujo, por lo que no se requiere reponer material por una cancelación posterior. Rechazar antes de imprimir requiere confirmación y no toca el inventario.

La columna “Margen” conserva el nombre de la referencia; en pedidos originados en la calculadora representa el recargo sobre costo. Un pedido completado suma su importe al agregado de ingresos de demostración.

## Cálculos

Para un STL válido:

```text
volumen cm³ = abs(suma del volumen firmado de cada triángulo) / 1000
peso g = volumen cm³ × densidad g/cm³ × (0.15 + 0.85 × relleno/100)
material = peso g / 1000 × precio por kg
horas impresión = (peso / 124.5) × (14 + 22/60) × (0.1 / capa mm)
máquina = horas × [18.50 / (14 + 22/60)]
electricidad = horas × [3.12 / (14 + 22/60)]
mano de obra = horas postproceso × 35
subtotal = material + máquina + electricidad + mano de obra
recargo = subtotal × porcentaje / 100
total = subtotal + recargo
```

Los precios por litro se convierten a una tarifa equivalente por masa usando la densidad. Sin STL se utiliza el modelo de referencia, calibrado a 124.5 g con Onyx al 45%. No incluye soportes, desperdicio, impuestos ni envío. Densidades, tarifas y tiempo son supuestos editables en el código; no proceden de una impresora. Un STL abierto o mal orientado puede producir un volumen erróneo aunque pase las comprobaciones básicas.

## Accesibilidad y componentes

Los diálogos usan `<dialog>` y `showModal()`, contienen el foco, cierran con Escape y devuelven el foco al control de origen. Los formularios tienen etiquetas, restricciones nativas y validaciones de negocio. Los botones de iconos llevan nombres accesibles. La navegación indica la ruta activa. Los gráficos incluyen una tabla equivalente para lectores de pantalla; los switches y barras de progreso exponen su estado. Se respeta `prefers-reduced-motion`.

## Integración futura

Para sustituir la demostración por datos reales, conserva los componentes y reemplaza las lecturas/escrituras del proveedor por una capa de servicios. Mueve al servidor la validación de roles, MFA, IP, transiciones y transacciones de stock. Añade identificadores relacionales de material, auditoría con fechas reales y separación por organización/cliente. Los agregados de dashboard e informes deben provenir de consultas sobre el periodo solicitado. Los medidores y la optimización deben conectarse al almacenamiento real.
