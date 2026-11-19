import test from "node:test";
import assert from "node:assert/strict";
import { calculateQuote, parseSTL } from "../src/utils/calculator.js";
import { csvCell } from "../src/utils/export.js";
// Tetraedro cerrado con aristas de 10 mm: volumen = 1000/6 mm³.
const faces = [
  [
    [0, 0, 0],
    [0, 10, 0],
    [10, 0, 0],
  ],
  [
    [0, 0, 0],
    [10, 0, 0],
    [0, 0, 10],
  ],
  [
    [0, 0, 0],
    [0, 0, 10],
    [0, 10, 0],
  ],
  [
    [10, 0, 0],
    [0, 10, 0],
    [0, 0, 10],
  ],
];
test("cotización de referencia: costos, recargo y total", () => {
  const quote = calculateQuote({});
  assert.equal(quote.material.toFixed(2), "52.29");
  assert.equal(quote.machine.toFixed(2), "18.50");
  assert.equal(quote.electricity.toFixed(2), "3.12");
  assert.equal(quote.labor.toFixed(2), "87.50");
  assert.equal(quote.markup.toFixed(2), "40.35");
  assert.equal(quote.total.toFixed(2), "201.76");
});
test("el peso escala costos y una capa más gruesa reduce el tiempo", () => {
  const reference = calculateQuote({});
  const heavier = calculateQuote({ grams: 249 });
  const thicker = calculateQuote({ layer: 0.2 });
  assert.equal(heavier.material, reference.material * 2);
  assert.equal(heavier.printHours, reference.printHours * 2);
  assert.equal(thicker.printHours, reference.printHours / 2);
});
test("STL ASCII: volumen conocido y número de triángulos", () => {
  const source = `solid tetra\n${faces.map((face) => `facet normal 0 0 0\nouter loop\n${face.map((vertex) => `vertex ${vertex.join(" ")}`).join("\n")}\nendloop\nendfacet`).join("\n")}\nendsolid tetra`;
  const result = parseSTL(new TextEncoder().encode(source).buffer);
  assert.equal(result.triangles, 4);
  assert.ok(Math.abs(result.volumeCm3 - 1 / 6) < 1e-9);
});
test("STL binario: volumen equivalente al ASCII", () => {
  const buffer = new ArrayBuffer(84 + faces.length * 50);
  const view = new DataView(buffer);
  view.setUint32(80, faces.length, true);
  faces.forEach((face, i) =>
    face
      .flat()
      .forEach((coordinate, j) =>
        view.setFloat32(84 + i * 50 + 12 + j * 4, coordinate, true),
      ),
  );
  assert.ok(Math.abs(parseSTL(buffer).volumeCm3 - 1 / 6) < 1e-9);
});
test("STL inválido y malla sin volumen se rechazan", () => {
  assert.throws(() => parseSTL(new ArrayBuffer(5)), /vacío|incompleto/);
  assert.throws(
    () =>
      parseSTL(
        new TextEncoder().encode("Este documento no es un archivo STL válido")
          .buffer,
      ),
    /válido/,
  );
  assert.throws(
    () =>
      parseSTL(
        new TextEncoder().encode(
          "solid x\nvertex 0 0 0\nvertex 1 0 0\nvertex 0 1 0\nendsolid x",
        ).buffer,
      ),
    /volumen/,
  );
});
test("CSV conserva comillas y neutraliza fórmulas de hojas de cálculo", () => {
  assert.equal(csvCell('Empresa "ABC"; S.A.'), '"Empresa ""ABC""; S.A."');
  assert.equal(csvCell("=1+1"), '"\'=1+1"');
  assert.equal(csvCell(" @SUM(A1)"), '"\' @SUM(A1)"');
  assert.equal(csvCell(42), '"42"');
});
