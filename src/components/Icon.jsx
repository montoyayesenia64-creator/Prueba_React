/** Iconos vectoriales propios: no cargan fuentes, imágenes ni paquetes externos. */
const circle = "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z";
const file = "M6 3h8l4 4v14H6ZM14 3v5h4";
const paths = {
  "grid-1x2": "M3 3h7v8H3ZM14 3h7v5h-7ZM3 15h7v6H3ZM14 12h7v9h-7Z",
  "box-seam": "m3 7 9-4 9 4v10l-9 4-9-4Zm0 0 9 4 9-4M12 11v10M7.5 5l9 4",
  cart3: "M2 4h3l2 12h12l2-9H6M10 21h.01M18 21h.01",
  calculator: "M5 2h14v20H5ZM8 5h8v4H8ZM8 13h1M15 13h1M8 17h1M15 17h1",
  "bar-chart-line": "M3 3v18h18M7 16v-4M12 16V8M17 16V5",
  people: "M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20v-2a6 6 0 0 1 12 0v2M16 4a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4v2",
  gear: "m10 3 .5-1h3l.5 3 2 .8 2.5-1.3 2 2-1.3 2.5.8 2 3 .5v3l-3 .5-.8 2 1.3 2.5-2 2-2.5-1.3-2 .8-.5 3h-3l-.5-3-2-.8-2.5 1.3-2-2L5.8 16 5 14l-3-.5v-3L5 10l.8-2-1.3-2.5 2-2L9 4.8l2-.8M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  "chevron-right": "m9 5 7 7-7 7",
  "chevron-left": "m15 5-7 7 7 7",
  "plus-lg": "M12 4v16M4 12h16",
  "question-circle": `${circle}M9 9a3 3 0 1 1 5 2c-1.5 1-2 1.5-2 3M12 17h.01`,
  "box-arrow-left": "M10 4h10v16H10M3 12h12M7 8l-4 4 4 4",
  "box-arrow-in-right": "M14 4h7v16h-7M3 12h13M12 8l4 4-4 4",
  "box-arrow-in-down": "M4 14v7h16v-7M12 3v13M8 12l4 4 4-4",
  list: "M4 6h16M4 12h16M4 18h16",
  search: "M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0ZM15 15l6 6",
  bell: "M5 17h14l-2-3V9a5 5 0 0 0-10 0v5ZM10 21h4M12 2v2",
  "clock-history": "M3 4v5h5M3 9a9 9 0 1 1 1 9M12 6v6l4 2",
  calendar3: "M4 5h16v16H4ZM8 2v6M16 2v6M4 10h16M8 14h1M15 14h1M8 18h1M15 18h1",
  download: "M12 3v13M7 11l5 5 5-5M4 16v5h16v-5",
  upload: "M12 16V3M7 8l5-5 5 5M4 16v5h16v-5",
  "currency-dollar": "M12 2v20M18 6H9a4 4 0 0 0 0 8h6a3 3 0 0 1 0 6H6",
  printer: "M7 8V3h10v5M7 17H3V9h18v8h-4M7 14h10v7H7ZM17 11h.01",
  "shield-check": "m12 2 8 3v6c0 5-4 8-8 11-4-3-8-6-8-11V5ZM8 11l3 3 5-6",
  tools: "m14 5 5-3-1 5-4 2-4 10-4 1 1-4 7-7ZM3 3l4 1 13 15-2 2L5 6Z",
  "file-earmark-binary": `${file}M9 12h2v5H9ZM14 12h1v5M13 17h3`,
  "file-earmark-check": `${file}m8 14 3 3 5-5`,
  "file-earmark-text": `${file}M9 12h6M9 15h6M9 18h4`,
  "file-earmark-excel": `${file}m9 12 6 6M15 12l-6 6`,
  "file-earmark-pdf": `${file}M9 18v-6h3a2 2 0 0 1 0 4H9`,
  "arrow-repeat": "M4 9a8 8 0 0 1 14-4l2 3M20 3v5h-5M20 15a8 8 0 0 1-14 4l-2-3M4 21v-5h5",
  "arrow-clockwise": "M20 9a8 8 0 1 0 0 6M20 3v6h-6",
  "bag-plus": "M5 7h14l2 14H3ZM8 7V5a4 4 0 0 1 8 0v2M12 11v6M9 14h6",
  "gear-wide-connected": "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM12 3v4M12 17v4M3 12h4M17 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3",
  funnel: "M3 4h18l-7 8v7l-4 2v-9Z",
  clock: `${circle}M12 6v6l4 2`,
  "cursor-fill": "m4 3 16 10-7 1-3 7Z",
  "x-lg": "m5 5 14 14M19 5 5 19",
  "check2-circle": `${circle}m7 12 3 3 7-7`,
  "check-circle": `${circle}m7 12 3 3 7-7`,
  "x-circle": `${circle}m8 8 8 8M16 8l-8 8`,
  "exclamation-triangle": "m12 3 10 18H2ZM12 9v5M12 17h.01",
  "exclamation-circle": `${circle}M12 6v7M12 17h.01`,
  floppy: "M3 3h15l3 3v15H3ZM7 3v7h10V3M7 21v-7h10v7M14 6v1",
  save: "M3 3h15l3 3v15H3ZM7 3v7h10V3M7 21v-7h10v7M14 6v1",
  pencil: "m3 21 2-7L17 2l5 5L10 19ZM14 5l5 5M5 14l5 5",
  "person-plus": "M8 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM1 21v-3a7 7 0 0 1 14 0v3M19 8v8M15 12h8",
  "lightning-charge": "m13 2-9 12h7l-1 8 10-13h-8Z",
  "shield-exclamation": "m12 2 8 3v6c0 5-4 8-8 11-4-3-8-6-8-11V5ZM12 7v6M12 17h.01",
  "three-dots-vertical": "M12 4h.01M12 12h.01M12 20h.01",
  globe: `${circle}M3 12h18M5 6h14M5 18h14M12 3a20 20 0 0 1 0 18 20 20 0 0 1 0-18Z`,
  "device-hdd": "M5 3h14l3 13v5H2v-5ZM2 16h20M6 19h.01M10 19h.01",
  trash3: "M3 6h18M8 6V3h8v3M5 6l1 15h12l1-15M10 10v7M14 10v7",
  speedometer2: "M4 19a10 10 0 1 1 16 0ZM12 14l5-7M5 12h1M7 6l1 1M12 3v2M18 12h1",
};

/** Decorativo: el botón o enlace contenedor conserva el nombre accesible. */
export default function Icon({ name, className = "" }) {
  const path = Object.hasOwn(paths, name) ? paths[name] : paths["question-circle"];
  return (
    <svg
      className={`app-icon ${className}`}
      data-icon={name}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={path} />
    </svg>
  );
}
