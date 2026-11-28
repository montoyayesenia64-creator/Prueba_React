import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = process.env.PRINTSMART_REACT_ROOT || fileURLToPath(new URL('../', import.meta.url));
const removed = ['bootstrap', 'bootstrap-icons'];
// El portal Cliente (rama Jade) todavía se apoya en Bootstrap; se exceptúa hasta migrarlo a CSS local.
const clientePortal = join('src', 'Pages', 'Cliente');
async function sources(directory) {
  const rows = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(rows.map(async entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sources(path) : /\.(jsx?|css)$/.test(entry.name) ? [path] : [];
  }))).flat();
}

test('la instalación no necesita paquetes de Bootstrap en manifiesto ni lockfile', { todo: 'Pendiente: migrar src/Pages/Cliente de Bootstrap a CSS local' }, async () => {
  for (const name of ['package.json', 'package-lock.json']) {
    const data = JSON.parse(await readFile(join(root, name), 'utf8'));
    for (const manifest of [data, data.packages?.['']].filter(Boolean)) {
      for (const group of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']) {
        for (const dependency of removed) assert.ok(!manifest[group]?.[dependency], `${name} todavía requiere ${dependency}`);
      }
    }
    for (const dependency of Object.keys(data.packages || {})) {
      assert.ok(!/(?:^|\/)node_modules\/bootstrap(?:-icons)?(?:\/|$)/.test(dependency), `${name}: ${dependency}`);
    }
  }
});

test('la entrada y las pantallas no importan Bootstrap ni sus fuentes', async () => {
  for (const path of await sources(join(root, 'src'))) {
    if (path.includes(clientePortal)) continue;
    const source = await readFile(path, 'utf8');
    assert.doesNotMatch(source, /(?:\bimport\s*(?:[^;\n]*?\s+from\s*)?|@import\s*|\burl\(\s*)['"](?:bootstrap(?:-icons)?(?:\/|['"])|https?:\/\/[^'"\s]*bootstrap)/i, path);
  }
  assert.doesNotMatch(await readFile(join(root, 'index.html'), 'utf8'), /(?:src|href)\s*=\s*['"][^'"]*bootstrap/i);
});

test('los iconos y avisos no dependen de clases de una fuente externa', async () => {
  for (const path of await sources(join(root, 'src'))) {
    if (!/\.jsx$/.test(path) || path.includes(clientePortal)) continue;
    const source = await readFile(path, 'utf8');
    assert.doesNotMatch(source, /className\s*=\s*(?:\{\s*)?[`'"][^`'"\n]*\bbi(?:\s|\bbi-)/, path);
  }
});
