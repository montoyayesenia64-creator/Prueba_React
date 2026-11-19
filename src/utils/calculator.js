/** STL en milímetros: volumen por tetraedros con signo, ASCII o binario. */
export function parseSTL(buffer) {
  if (buffer.byteLength < 15)
    throw new Error("El archivo STL está vacío o incompleto.");
  const view = new DataView(buffer);
  const triangles = buffer.byteLength >= 84 ? view.getUint32(80, true) : 0;
  let volume = 0;
  let count = 0;
  const addTriangle = (a, b, c) => {
    if (![...a, ...b, ...c].every(Number.isFinite))
      throw new Error("El STL contiene coordenadas inválidas.");
    volume +=
      (a[0] * (b[1] * c[2] - b[2] * c[1]) +
        a[1] * (b[2] * c[0] - b[0] * c[2]) +
        a[2] * (b[0] * c[1] - b[1] * c[0])) /
      6;
    count++;
  };
  if (triangles > 0 && 84 + triangles * 50 === buffer.byteLength) {
    for (let i = 0; i < triangles; i++) {
      const offset = 84 + i * 50 + 12;
      const vertex = (n) =>
        [0, 4, 8].map((axis) => view.getFloat32(offset + n * 12 + axis, true));
      addTriangle(vertex(0), vertex(1), vertex(2));
    }
  } else {
    const source = new TextDecoder().decode(buffer);
    if (!/^\s*solid\b/i.test(source) || !/endsolid/i.test(source))
      throw new Error("El archivo no contiene un STL ASCII o binario válido.");
    const vertices = [
      ...source.matchAll(
        /vertex\s+([-+\d.eE]+)\s+([-+\d.eE]+)\s+([-+\d.eE]+)/g,
      ),
    ].map((match) => match.slice(1).map(Number));
    if (!vertices.length || vertices.length % 3 !== 0)
      throw new Error("La malla STL está incompleta.");
    for (let i = 0; i < vertices.length; i += 3)
      addTriangle(vertices[i], vertices[i + 1], vertices[i + 2]);
  }
  const volumeCm3 = Math.abs(volume) / 1000;
  if (!count || !Number.isFinite(volumeCm3) || volumeCm3 <= 0)
    throw new Error(
      "La malla no tiene volumen calculable. Usa una malla cerrada en milímetros.",
    );
  return { volumeCm3, triangles: count };
}
export function calculateQuote({
  grams = 124.5,
  price = 420,
  layer = 0.1,
  laborHours = 2.5,
  margin = 25,
}) {
  const printHours = (grams / 124.5) * (14 + 22 / 60) * (0.1 / layer);
  const material = (grams / 1000) * price;
  const machine = printHours * (18.5 / (14 + 22 / 60));
  const electricity = printHours * (3.12 / (14 + 22 / 60));
  const labor = laborHours * 35;
  const subtotal = material + machine + electricity + labor;
  const markup = (subtotal * margin) / 100;
  return {
    grams,
    printHours,
    material,
    machine,
    electricity,
    labor,
    subtotal,
    markup,
    total: subtotal + markup,
  };
}
