function download(content, name, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
// Evita que datos del usuario se interpreten como fórmulas al abrir el CSV.
export function csvCell(value) {
  let text = String(value ?? "");
  if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}
export function exportCSV(name, headers, rows) {
  download(
    "\ufeff" +
      [headers, ...rows].map((row) => row.map(csvCell).join(";")).join("\r\n"),
    `${name}.csv`,
    "text/csv;charset=utf-8",
  );
}
export function exportExcel(name, headers, rows) {
  const escape = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&apos;");
  const sheet = [headers, ...rows]
    .map(
      (row) =>
        `<Row>${row.map((value) => `<Cell><Data ss:Type="${typeof value === "number" ? "Number" : "String"}">${escape(value)}</Data></Cell>`).join("")}</Row>`,
    )
    .join("");
  download(
    `<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="PrintSmart 3D"><Table>${sheet}</Table></Worksheet></Workbook>`,
    `${name}.xml`,
    "application/vnd.ms-excel;charset=utf-8",
  );
}
export async function exportPDF(name, title, lines) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  const text = (value) =>
    String(value).replaceAll("•", " / ").replaceAll("—", "-");
  doc.setFillColor(92, 31, 184);
  doc.rect(0, 0, 210, 32, "F");
  doc.setTextColor(255);
  doc.setFontSize(18);
  doc.text("PrintSmart 3D", 16, 21);
  doc.setTextColor(16, 24, 40);
  doc.setFontSize(15);
  doc.text(text(title), 16, 46);
  doc.setFontSize(9);
  doc.setTextColor(110);
  doc.text(
    new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" }),
    16,
    54,
  );
  doc.setTextColor(16, 24, 40);
  doc.setFontSize(11);
  let y = 68;
  lines.forEach((line) => {
    const wrapped = doc.splitTextToSize(text(line), 176);
    wrapped.forEach((part) => {
      if (y > 276) {
        doc.addPage();
        y = 22;
      }
      doc.text(part, 16, y);
      y += 7;
    });
    y += 3;
  });
  doc.save(`${name}.pdf`);
}
