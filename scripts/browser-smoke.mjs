// QA sin dependencias adicionales: usa un Edge/Chrome con CDP y perfil aislado.
// node scripts/browser-smoke.mjs [URL de Vite] [URL de depuración]
import assert from 'node:assert/strict';
import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const base = process.argv[2] || 'http://127.0.0.1:5173';
const debug = process.argv[3] || 'http://127.0.0.1:9222';
const output = resolve('.qa');
await mkdir(resolve(output, 'downloads'), { recursive: true });
const expectedDownloads = ['pedidos-printsmart.csv', 'cotizacion-printsmart.pdf', 'analisis-printsmart.xml', 'analisis-printsmart.pdf'];
for (const file of expectedDownloads) await unlink(resolve(output, 'downloads', file)).catch(error => { if (error.code !== 'ENOENT') throw error; });
const targets = await (await fetch(`${debug}/json/list`)).json();
const target = targets.find(item => item.type === 'page' && !item.url.startsWith('chrome-extension:'));
assert.ok(target, 'Falta una pestaña de prueba en el navegador');
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
let id = 0;
const pending = new Map();
const errors = [];
ws.onmessage = event => {
  const message = JSON.parse(event.data);
  if (message.id) { const entry = pending.get(message.id); if (!entry) return; pending.delete(message.id); message.error ? entry.reject(message.error) : entry.resolve(message.result); }
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
  if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') errors.push(message.params.args.map(arg => arg.value || arg.description).join(' '));
};
const cdp = (method, params = {}) => new Promise((res, rej) => { const current = ++id; pending.set(current, { resolve: res, reject: rej }); ws.send(JSON.stringify({ id: current, method, params })); });
const pause = ms => new Promise(res => setTimeout(res, ms));
async function evaluate(expression) {
  const result = await cdp('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
}
async function until(expression, message) {
  for (let i = 0; i < 50; i++) { if (await evaluate(`Boolean(${expression})`)) return; await pause(100); }
  throw new Error(`Espera agotada: ${message}`);
}
const click = async text => { await evaluate(`(() => { const el = [...document.querySelectorAll('button')].find(el => el.textContent.trim() === ${JSON.stringify(text)}); if (!el) throw new Error('Botón no encontrado: ' + ${JSON.stringify(text)}); el.click(); })()`); await pause(120); };
const selectorClick = async selector => { await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`); await pause(100); };
const input = async (selector, value) => { await evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) throw new Error('Campo no encontrado'); const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, ${JSON.stringify(String(value))}); el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true })); })()`); await pause(80); };
const route = async (path, title) => { await evaluate(`location.hash = '#/${path}'`); await until(`document.querySelector('h1')?.textContent === ${JSON.stringify(title)}`, title); await pause(150); };
const screenshot = async name => { const result = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }); await writeFile(resolve(output, `${name}.png`), Buffer.from(result.data, 'base64')); };
const stored = key => evaluate(`JSON.parse(localStorage.getItem(${JSON.stringify(`printsmart.${key}.v1`)}))`);
try {
  await cdp('Runtime.enable'); await cdp('Page.enable');
  await cdp('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: resolve(output, 'downloads') });
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1348, height: 700, deviceScaleFactor: 1, mobile: false });
  await cdp('Page.navigate', { url: base });
  await until(`document.querySelector('h1')`, 'Carga inicial');
  // Nunca borrar datos de un navegador personal: se exige un perfil de QA.
  await evaluate(`Object.keys(localStorage).filter(key => key.startsWith('printsmart.')).forEach(key => localStorage.removeItem(key)); sessionStorage.removeItem('printsmart.signedout'); location.reload()`);
  await until(`document.querySelector('h1')?.textContent === 'Dashboard Ejecutivo'`, 'Dashboard');
  await pause(600);
  const pages = [['dashboard', 'Dashboard Ejecutivo'], ['materiales', 'Gestión Maestra de Materiales'], ['pedidos', 'Gestión de Pedidos'], ['calculos', 'Calculadora de Costos de Impresión'], ['reportes', 'Análisis de Desempeño'], ['usuarios', 'Gestión de Usuarios'], ['configuracion', 'Configuración General']];
  for (const [path, title] of pages) { await route(path, title); await screenshot(path); assert.equal(await evaluate('document.documentElement.scrollWidth <= window.innerWidth'), true, `Overflow en ${path}`); }
  console.log('PASS: siete rutas de escritorio, sin desbordamiento horizontal');

  await route('materiales', 'Gestión Maestra de Materiales');
  await input('[name="name"]', 'QA PLA Test'); await input('[name="supplier"]', 'Proveedor QA');
  await input('[name="stock"]', '10'); await input('[name="price"]', '45'); await click('Registrar Material');
  await until(`document.querySelector('.inventory-table').textContent.includes('QA PLA Test')`, 'Registro de material');
  assert.ok((await stored('materials')).some(item => item.name === 'QA PLA Test'));
  await input('input[type="search"]', 'QA PLA Test');
  assert.equal(await evaluate('document.querySelectorAll(".inventory-table tbody tr").length'), 1);
  await input('input[type="search"]', '');
  await click('Filtros'); await input('dialog select', 'Crítico'); await click('Ver resultados');
  assert.equal(await evaluate('document.querySelectorAll(".inventory-table tbody tr").length'), 3);
  await click('Filtros •'); await click('Restablecer'); await click('Ver resultados');
  await evaluate(`[...document.querySelectorAll('.material-link')].find(el => el.textContent.includes('PLA Carbon Fiber')).click()`); await pause(100);
  await click('Editar material'); await input('[name="name"]', 'PLA Carbon Fiber QA'); await click('Guardar Material');
  assert.equal((await stored('orders'))[0].material, 'PLA Carbon Fiber QA');
  console.log('PASS: registro, búsqueda, filtros y persistencia de materiales');

  await click('Nuevo Trabajo de Impresión');
  await input('dialog [name="client"]', 'Cliente QA'); await input('dialog [name="model"]', 'Modelo QA'); await input('dialog [name="amount"]', '201.76'); await click('Crear trabajo');
  await until(`document.querySelector('.orders-table')?.textContent.includes('Cliente QA')`, 'Creación de pedido');
  const created = (await stored('orders')).find(item => item.client === 'Cliente QA');
  await click(`#${created.id}`);
  await click('Aprobar revisión técnica');
  const before = (await stored('materials')).find(item => item.name === created.material).stock;
  await click('Aprobar e iniciar impresión');
  const after = (await stored('materials')).find(item => item.name === created.material).stock;
  assert.ok(Math.abs(before - after - created.weight / 1000) < 1e-8);
  await click('Completar trabajo');
  assert.equal((await stored('orders')).find(item => item.id === created.id).status, 'Completado');
  await click('Exportar CSV');
  // Resina: el consumo en gramos se convierte a litros antes del descuento.
  await click('#PP-9383');
  const resinBefore = (await stored('materials')).find(item => item.type === 'Resina').stock;
  await click('Aprobar e iniciar impresión');
  const resinAfter = (await stored('materials')).find(item => item.type === 'Resina').stock;
  assert.ok(Math.abs(resinBefore - resinAfter - 86 / 1100) < 1e-8);
  // Falta de stock: el pedido debe conservar el estado financiero.
  await route('materiales', 'Gestión Maestra de Materiales');
  await evaluate(`[...document.querySelectorAll('.material-link')].find(el => el.textContent.includes('PLA Carbon Fiber QA')).click()`); await pause(100);
  await click('Editar material'); await input('[name="stock"]', '0'); await click('Guardar Material');
  await route('pedidos', 'Gestión de Pedidos'); await click('#PP-9382'); await click('Aprobar revisión técnica'); await click('Aprobar e iniciar impresión');
  assert.equal((await stored('orders')).find(item => item.id === 'PP-9382').status, 'Pendiente finanzas');
  assert.equal((await stored('materials')).find(item => item.name === 'PLA Carbon Fiber QA').stock, 0);
  console.log('PASS: crear, aprobar, descontar stock, completar pedido y exportar CSV');

  await route('usuarios', 'Gestión de Usuarios'); await click('Añadir Usuario');
  await input('dialog input:not([type])', 'Usuario QA'); await input('dialog input[type="email"]', 'qa@example.com'); await click('Guardar usuario');
  assert.ok((await stored('users')).some(item => item.email === 'qa@example.com'));
  await click('Clientes'); assert.equal(await evaluate('document.querySelectorAll(".users-table tbody tr").length'), 1); await click('Todos');
  console.log('PASS: registro y pestañas de usuarios');

  await route('calculos', 'Calculadora de Costos de Impresión');
  const firstQuote = await evaluate('document.querySelector(".quote-total strong").textContent');
  assert.ok(firstQuote.includes('201,76'));
  await click('0.20');
  assert.notEqual(await evaluate('document.querySelector(".quote-total strong").textContent'), firstQuote);
  await click('0.10'); await click('GENERAR COTIZACIÓN OFICIAL');
  const stl = 'solid tetra\nfacet normal 0 0 0\nouter loop\nvertex 10 0 0\nvertex 0 10 0\nvertex 0 0 10\nendloop\nendfacet\nendsolid tetra';
  await writeFile(resolve(output, 'tetra.stl'), stl);
  await writeFile(resolve(output, 'invalid.txt'), 'archivo incorrecto');
  const dom = await cdp('DOM.getDocument'); const fileNode = await cdp('DOM.querySelector', { nodeId: dom.root.nodeId, selector: 'input[type=file]' });
  await cdp('DOM.setFileInputFiles', { nodeId: fileNode.nodeId, files: [resolve(output, 'invalid.txt')] });
  await until(`document.querySelector('[role=alert]')?.textContent.includes('.stl')`, 'Validación de extensión');
  await cdp('DOM.setFileInputFiles', { nodeId: fileNode.nodeId, files: [resolve(output, 'tetra.stl')] });
  await until(`document.querySelector('.drop-zone').textContent.includes('tetra.stl')`, 'Carga de STL');
  console.log('PASS: recálculo de cotización, PDF y carga real de STL');

  await route('reportes', 'Análisis de Desempeño');
  const revenue = await evaluate('document.querySelector(".stat-value").textContent');
  await input('.client-select', 'BioLab Medical'); assert.notEqual(await evaluate('document.querySelector(".stat-value").textContent'), revenue);
  await click('Excel'); await click('Reporte PDF');

  await route('configuracion', 'Configuración General');
  await input('.currency-card input', 'US$'); await click('Guardar Cambios');
  assert.equal((await stored('settings')).symbol, 'US$');
  await input('.currency-card input', '$'); await click('Guardar Cambios');
  await selectorClick('.maintenance-card input[type=checkbox]'); await click('Ver como visitante');
  assert.equal(await evaluate('document.querySelector("h1").textContent'), 'Estamos en mantenimiento');
  await click('Volver a la vista de administrador'); await selectorClick('.maintenance-card input[type=checkbox]');
  await click('Optimizar Almacenamiento'); await pause(300);
  assert.equal((await stored('settings')).optimized, true);
  await cdp('Page.reload'); await until(`document.querySelector('h1')`, 'Recarga');
  assert.ok((await stored('materials')).some(item => item.name === 'QA PLA Test'));
  await click('Cerrar Sesión'); await click('Cerrar sesión');
  assert.equal(await evaluate('document.querySelector("h1").textContent'), 'PrintSmart 3D');
  await click('Entrar a la demostración');
  await evaluate(`document.querySelector('[aria-label="Cerrar aviso"]')?.click()`);
  console.log('PASS: filtros de reportes, Excel, mantenimiento, optimización, recarga y sesión');

  await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  for (const [path, title] of pages) { await route(path, title); assert.equal(await evaluate('document.documentElement.scrollWidth <= window.innerWidth'), true, `Overflow móvil: ${path}`); }
  await route('dashboard', 'Dashboard Ejecutivo'); await screenshot('mobile');
  await selectorClick('.mobile-menu'); assert.equal(await evaluate('document.querySelector(".admin-layout").classList.contains("mobile-open")'), true);
  console.log('PASS: siete pantallas móviles y apertura del menú');
  await pause(700);
  const downloads = await readdir(resolve(output, 'downloads'));
  for (const file of expectedDownloads) assert.ok(downloads.includes(file), `Descarga pendiente: ${file}`);
  assert.equal((await readFile(resolve(output, 'downloads/cotizacion-printsmart.pdf'))).subarray(0, 4).toString(), '%PDF');
  assert.equal(errors.length, 0, errors.join('\n'));
  await writeFile(resolve(output, 'result.json'), JSON.stringify({ status: 'passed', checks: ['7 desktop routes', '7 mobile routes', 'material create/search/filter', 'order workflow/stock', 'user create/tabs', 'quote/STL', 'CSV/PDF/Excel downloads', 'report filters', 'maintenance', 'persistence', 'session'], downloads, consoleErrors: errors }, null, 2));
  console.log('PASS: cuatro archivos descargados y cero errores de consola');
} finally { ws.close(); }
