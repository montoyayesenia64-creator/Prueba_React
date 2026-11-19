import { useRef, useState } from "react";
import { useAppData } from "../context/AppContext";
import {
  PageHeader,
  Badge,
  Button,
  Icon,
  Modal,
  EmptyState,
} from "../components/UI";
import { calculateQuote, parseSTL } from "../utils/calculator";
import { exportPDF } from "../utils/export";
import NewJobForm from "../components/NewJobForm";

export default function Calculator({ search }) {
  const { materials, money, notify, logActivity, settings } = useAppData();
  const [materialId, setMaterialId] = useState(
    () =>
      materials.find((item) => item.type === "Onyx")?.id ||
      materials[0]?.id ||
      "",
  );
  const [infill, setInfill] = useState(45);
  const [layer, setLayer] = useState(0.1);
  const [laborHours, setLaborHours] = useState(2.5);
  const [margin, setMargin] = useState(25);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [newJob, setNewJob] = useState(false);
  const input = useRef(null);
  const loadId = useRef(0);
  const material =
    materials.find((item) => item.id === materialId) || materials[0];
  const density =
    { PLA: 1.24, PETG: 1.27, ABS: 1.04, Resina: 1.1, Onyx: 1.2, Nylon: 1.14 }[
      material?.type
    ] || 1.24;
  const grams = file
    ? file.volumeCm3 * density * (0.15 + (0.85 * infill) / 100)
    : (((124.5 * (0.15 + (0.85 * infill) / 100)) / 0.5325) * density) / 1.2;
  const quote = calculateQuote({
    grams,
    price:
      material?.unit === "L" ? material.price / density : material?.price || 0,
    layer,
    laborHours: Number(laborHours),
    margin: Number(margin),
  });
  const valid =
    !!material &&
    !loading &&
    !error &&
    laborHours !== "" &&
    margin !== "" &&
    Number.isFinite(quote.total) &&
    Number(laborHours) >= 0 &&
    Number(laborHours) <= 1000 &&
    Number(margin) >= 0 &&
    Number(margin) <= 100;
  const readFile = async (selected) => {
    if (!selected) return;
    const currentLoad = ++loadId.current;
    setError("");
    setLoading(false);
    if (!selected.name.toLowerCase().endsWith(".stl")) {
      setError("Selecciona un archivo con extensión .stl.");
      return;
    }
    if (selected.size > 500 * 1024 * 1024) {
      setError("El archivo supera el tamaño máximo de 500 MB.");
      return;
    }
    setLoading(true);
    try {
      // Permite pintar el estado de carga antes de analizar la malla.
      const buffer = await selected.arrayBuffer();
      const parsed = parseSTL(buffer);
      if (loadId.current === currentLoad) {
        setFile({ name: selected.name, ...parsed });
        notify("STL cargado. La cotización se recalculó con su volumen.");
      }
    } catch (failure) {
      if (loadId.current === currentLoad) {
        setFile(null);
        setError(failure.message);
      }
    } finally {
      if (loadId.current === currentLoad) setLoading(false);
      if (input.current) input.current.value = "";
    }
  };
  const pdf = async () => {
    if (!valid) return;
    setExporting(true);
    try {
      await exportPDF("cotizacion-printsmart", "Cotización de impresión 3D", [
        `Proyecto: ${file?.name || "Modelo de referencia"}`,
        `Material: ${material.name}`,
        `Moneda: ${settings.currency} (sin conversión automática)`,
        `Peso estimado: ${grams.toFixed(2)} g / Relleno: ${infill}% / Capa: ${layer} mm`,
        `Impresión estimada: ${quote.printHours.toFixed(2)} h`,
        `Material: ${money(quote.material)}`,
        `Desgaste de máquina: ${money(quote.machine)}`,
        `Electricidad: ${money(quote.electricity)}`,
        `Mano de obra (${laborHours} h): ${money(quote.labor)}`,
        `Recargo sobre costo (${margin}%): ${money(quote.markup)}`,
        `TOTAL ESTIMADO: ${money(quote.total)}`,
        "Estimación orientativa. Validar en un laminador antes de fabricar. Validez: 15 días.",
      ]);
      logActivity(
        "Cotización generada",
        `${file?.name || "Modelo de referencia"} • ${money(quote.total)}`,
        "file-earmark-text",
        "purple",
      );
      notify("Cotización PDF descargada.");
    } catch {
      notify("No fue posible generar el PDF.", "warning");
    } finally {
      setExporting(false);
    }
  };
  const options = materials.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <PageHeader
        title="Calculadora de Costos de Impresión"
        subtitle="Configure los parámetros técnicos para una cotización industrial precisa."
      />
      <div className="calculator-grid">
        <div>
          <section className="surface upload-card">
            <div className="card-heading">
              <span className="icon-tile purple">
                <Icon name="file-earmark-binary" />
              </span>
              <Badge tone={loading ? "yellow" : error ? "red" : "green"}>
                {loading ? "ANALIZANDO" : error ? "REVISAR" : "LISTO"}
              </Badge>
            </div>
            <p className="eyebrow">Selección de archivo STL</p>
            <input
              ref={input}
              type="file"
              accept=".stl"
              className="visually-hidden"
              aria-label="Seleccionar archivo STL"
              onChange={(event) => readFile(event.target.files[0])}
            />
            <div
              className={`drop-zone ${dragging ? "dragging" : ""}`}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                readFile(event.dataTransfer.files[0]);
              }}
            >
              <button
                type="button"
                className="upload-icon"
                aria-label="Cargar archivo STL"
                onClick={() => input.current.click()}
              >
                <Icon name={file ? "file-earmark-check" : "arrow-repeat"} />
              </button>
              <p>
                {file ? file.name : "Arrastre el archivo STL o"}{" "}
                {!file && (
                  <button
                    className="text-button underlined"
                    onClick={() => setLibraryOpen(true)}
                  >
                    Explore la Biblioteca
                  </button>
                )}
              </p>
              <small>
                {file
                  ? `${file.triangles.toLocaleString()} triángulos • ${file.volumeCm3.toFixed(2)} cm³`
                  : "Tamaño máximo: 500MB"}
              </small>
              <button
                className="text-button upload-link"
                onClick={() => input.current.click()}
              >
                {file ? "Cambiar archivo" : "Seleccionar desde el equipo"}
              </button>
            </div>
            {error && (
              <p role="alert" className="text-danger mt-2 mb-0">
                {error}
              </p>
            )}
          </section>
          <div className="calculator-options">
            <section className="surface">
              <h2 className="eyebrow">Configuración de material</h2>
              <label className="mt-3 d-block">
                Tipo de Material
                <select
                  className="form-select"
                  value={material?.id || ""}
                  onChange={(event) => setMaterialId(event.target.value)}
                >
                  {options.map((item) => (
                    <option value={item.id} key={item.id}>
                      {item.name}
                    </option>
                  ))}
                  {material &&
                    !options.some((item) => item.id === material.id) && (
                      <option value={material.id}>{material.name}</option>
                    )}
                </select>
              </label>
              {search && (
                <small className="field-help">
                  {options.length} materiales coinciden con la búsqueda.
                </small>
              )}
              <label className="range-label">
                Densidad de Relleno <strong>{infill}%</strong>
                <input
                  className="form-range"
                  type="range"
                  min="5"
                  max="100"
                  step="1"
                  value={infill}
                  onChange={(event) => setInfill(Number(event.target.value))}
                />
              </label>
              <div className="range-extremes">
                <span>Ligero</span>
                <span>Sólido</span>
              </div>
              <p className="field-help mt-3 mb-0">
                Peso estimado: <strong>{grams.toFixed(1)} g</strong>
                <br />
                Densidad: {density} g/cm³
              </p>
            </section>
            <section className="surface">
              <h2 className="eyebrow">Especificaciones técnicas</h2>
              <fieldset className="mt-3">
                <legend>Altura de Capa (mm)</legend>
                <div className="layer-options">
                  {[0.05, 0.1, 0.2].map((value) => (
                    <Button
                      key={value}
                      variant={
                        layer === value ? "primary" : "outline-secondary"
                      }
                      aria-pressed={layer === value}
                      onClick={() => setLayer(value)}
                    >
                      {value.toFixed(2)}
                    </Button>
                  ))}
                </div>
              </fieldset>
              <label className="d-block mt-3">
                Mano de Obra Post-Proceso (Hrs)
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  max="1000"
                  step="0.5"
                  value={laborHours}
                  onChange={(event) => setLaborHours(event.target.value)}
                />
              </label>
              <label className="d-block mt-3">
                Recargo sobre costo (%)
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  max="100"
                  value={margin}
                  onChange={(event) => setMargin(event.target.value)}
                />
              </label>
            </section>
          </div>
        </div>
        <section className="surface price-breakdown">
          <h2>Desglose de Precios</h2>
          <dl className="price-list">
            <div>
              <dt>
                Costo de Material
                <small>
                  {grams.toFixed(1)}g @ {money(quote.material / grams)}/g
                </small>
              </dt>
              <dd>{money(quote.material)}</dd>
            </div>
            <div>
              <dt>
                Desgaste de Máquina
                <small>
                  {Math.floor(quote.printHours)}h{" "}
                  {Math.round((quote.printHours % 1) * 60)}m tiempo imp.
                </small>
              </dt>
              <dd>{money(quote.machine)}</dd>
            </div>
            <div>
              <dt>
                Electricidad<small>Tarifa Industrial (SLA)</small>
              </dt>
              <dd>{money(quote.electricity)}</dd>
            </div>
            <div>
              <dt>
                Mano de Obra y Post
                <small>{laborHours || 0}h Nivel Técnico 2</small>
              </dt>
              <dd>{money(quote.labor)}</dd>
            </div>
            <div className="margin-line">
              <dt>MARGEN ({margin || 0}%)</dt>
              <dd>+{money(quote.markup)}</dd>
            </div>
          </dl>
          <div className="quote-total">
            <span>Cotización total estimada</span>
            <strong>{money(quote.total)}</strong>
            <small>
              Tiempo Estimado:{" "}
              {Math.max(1, Math.ceil(quote.printHours / 8)) + 1} Días Hábiles
            </small>
          </div>
          <Button
            className="w-100 mt-3"
            icon="file-earmark-text"
            disabled={!valid || exporting}
            onClick={pdf}
          >
            {exporting ? "GENERANDO..." : "GENERAR COTIZACIÓN OFICIAL"}
          </Button>
          <Button
            className="w-100 mt-2"
            variant="outline-primary"
            icon="bag-plus"
            disabled={!valid}
            onClick={() => setNewJob(true)}
          >
            Crear pedido con esta cotización
          </Button>
          <p className="field-help mt-3 mb-0">
            Estimación orientativa. El consumo real depende de soportes,
            orientación y laminado.
          </p>
        </section>
      </div>
      {libraryOpen && (
        <Modal
          title="Biblioteca de modelos"
          onClose={() => setLibraryOpen(false)}
        >
          <p className="muted">
            Selecciona un modelo de referencia o carga tu archivo STL.
          </p>
          {!search ||
          "engranaje helicoidal modelo referencia".includes(
            search.toLowerCase(),
          ) ? (
            <button
              className="library-item"
              onClick={() => {
                setFile(null);
                setError("");
                setLibraryOpen(false);
                setInfill(45);
                notify("Modelo de referencia seleccionado.");
              }}
            >
              <span className="icon-tile purple">
                <Icon name="gear-wide-connected" />
              </span>
              <span>
                <strong>Engranaje Helicoidal v2</strong>
                <small>Modelo de referencia • 124.5 g con Onyx al 45%</small>
              </span>
            </button>
          ) : (
            <EmptyState />
          )}
          <Button
            icon="upload"
            variant="outline-primary"
            className="mt-3"
            onClick={() => {
              setLibraryOpen(false);
              input.current.click();
            }}
          >
            Cargar mi STL
          </Button>
        </Modal>
      )}
      {newJob && (
        <Modal
          title="Crear pedido desde cotización"
          onClose={() => setNewJob(false)}
        >
          <NewJobForm
            onClose={() => setNewJob(false)}
            quote={{
              ...quote,
              margin: Number(margin),
              material: material.name,
              model:
                file?.name?.replace(/\.stl$/i, "") || "Engranaje Helicoidal v2",
            }}
          />
        </Modal>
      )}
    </>
  );
}
