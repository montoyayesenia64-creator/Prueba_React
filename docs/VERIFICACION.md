# Verificación de PrintSmart 3D

La historia verificada es: un administrador registra un material, crea o cotiza un trabajo, aprueba sus revisiones, inicia impresión con descuento de stock y completa el pedido; los cambios se reflejan en las pantallas y sobreviven a una recarga.

## Verificación realizada

| Comprobación                          | Resultado                                                                                                                                                      
| Compilación Vite de producción        | Correcta, genera `dist/`.                                                                                                                                                  |
| Pruebas de negocio con Node           | 6 pruebas correctas: cotización de referencia, efecto de peso/capa, volumen STL ASCII y binario, archivo inválido y escapado CSV.                                          |
| Siete rutas en escritorio, 1348 × 700 | Renderizan sin desbordamiento horizontal.                                                                                                                                  |
| Siete rutas en móvil, 390 × 844       | Renderizan sin desbordamiento de página; menú lateral abre.                                                                                                                |
| Materiales                            | Registro, búsqueda, filtro de críticos, persistencia local y renombrado con actualización de pedidos asociados.                                                            |
| Pedidos                               | Alta desde el menú, selección, aprobación técnica/financiera, impresión, descuento de stock y finalización; conversión de resina a litros y bloqueo de stock insuficiente. |
| Usuarios                              | Alta y filtro por pestañas.                                                                                                                                                |
| Calculadora                           | Cotización inicial 201,76, variación al cambiar de capa, rechazo de extensión incorrecta y posterior carga real de un STL.                                                 |
| Descargas                             | CSV de pedidos, cotización PDF, informe PDF y Excel XML; se comprobó el encabezado `%PDF` del archivo de cotización.                                                       |
| Informes                              | Cambiar cliente modifica el agregado y la exportación.                                                                                                                     |
| Configuración                         | Guardado de símbolo, mantenimiento y su vista de visitante, retorno al administrador, optimización.                                                                        |
| Sesión y almacenamiento               | Cierre/reentrada de demostración; los registros sobreviven a recarga.                                                                                                      |
| Consola del navegador                 | Sin excepciones JavaScript ni errores de consola durante el recorrido.                                                                                                     |

Las capturas y el resultado JSON de la ejecución se guardan en `.qa/`, excluido de Git. Se utilizó Microsoft Edge sin interfaz, con un perfil de prueba independiente. La verificación es local; no se realizó despliegue ni pruebas contra un backend, porque el proyecto no incluye uno. Las capturas se inspeccionaron visualmente; no se afirma equivalencia píxel a píxel con las imágenes de referencia.

## Repetir las pruebas

```bash
npm test
npm run build
```

Para las pruebas de navegador, inicia Vite en una terminal:

```bash
npm run dev -- --host 127.0.0.1
```

En otra terminal inicia Edge o Chrome con **un perfil exclusivo de prueba** y depuración remota en el puerto 9222. Ejemplo en PowerShell para Edge:

```powershell
$qaProfile = Join-Path (Get-Location) '.qa\edge-profile'
Start-Process -FilePath 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe' -WindowStyle Hidden -ArgumentList @('--headless=new', '--disable-gpu', '--no-first-run', '--remote-debugging-port=9222', "--user-data-dir=$qaProfile", 'about:blank')
node scripts/browser-smoke.mjs
```

En este entorno de ejecución aislado fue necesario iniciar el navegador con `--disable-software-rasterizer` y `--no-sandbox` por un fallo del proceso GPU de Edge. Esos parámetros no son requisitos de la aplicación.

El script requiere Node.js 22 o posterior y un navegador que exponga CDP. Se pueden pasar las direcciones de Vite y del depurador como argumentos. **El script restablece las claves `printsmart.*` del origen de prueba** y crea registros QA; no debe ejecutarse usando datos personales. No afecta el perfil normal del navegador.

```bash
node scripts/browser-smoke.mjs http://127.0.0.1:5173 http://127.0.0.1:9222
```

## Comprobaciones manuales adicionales

- Editar y renombrar un material; comprobar que sus pedidos siguen apuntando al nombre actualizado.
- Agotar un material y comprobar que el inicio de impresión queda bloqueado sin alterar el pedido.
- Intentar registrar correos o nombres de material repetidos; comprobar el aviso.
- Cargar un archivo incorrecto o sin volumen; comprobar el error y seleccionar después uno válido.
- Guardar moneda y preferencias regionales, cambiar de sección y recargar.
- Abrir/cerrar diálogos con teclado, Escape y recorrido de foco.

Los gráficos de telemetría, ROI y almacenamiento no representan servicios externos y no se verificaron como tales. Los PDF y hojas de cálculo se verificaron como archivos descargables; no se automatizó Microsoft Excel ni un lector PDF externo.
