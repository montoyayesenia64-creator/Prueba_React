/** @file Formulario reutilizado por el menú global y por la calculadora de costos. */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppData } from "../context/AppContext";
import { Button } from "./UI";
/**
 * Crea un pedido pendiente de revisión técnica y navega a su pantalla de gestión.
 * Los valores de quote solo precargan el formulario al montarlo.
 * @param {object} props Opciones del formulario.
 * @param {() => void} props.onClose Cierra el diálogo que contiene el formulario.
 * @param {{model?: string, material?: string, total?: number, grams?: number,
 * printHours?: number, margin?: number}} [props.quote] Cotización opcional de origen.
 */
export default function NewJobForm({ onClose, quote }) {
  const { materials, setOrders, logActivity, notify } = useAppData();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    client: "",
    contact: "",
    model: quote?.model || "",
    material: quote?.material || materials[0]?.name || "",
    amount: quote?.total?.toFixed(2) || "",
    weight: quote?.grams?.toFixed(2) || "124.5",
    hours: quote?.printHours?.toFixed(2) || "14.37",
    margin: quote?.margin ?? 25,
  });
  // name identifica la propiedad; los inputs numéricos se mantienen como texto al editar.
  const change = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });
  /** Valida referencias, convierte cantidades a números y registra el nuevo pedido. */
  const submit = (event) => {
    event.preventDefault();
    if (!form.client.trim() || !form.model.trim())
      return notify("Completa el cliente y el nombre del modelo.", "warning");
    if (!materials.some((material) => material.name === form.material))
      return notify("Selecciona un material del inventario.", "warning");
    const createdAt = new Date().toISOString();
    // El ID continúa la secuencia PP; este contador local no coordina varios clientes.
    setOrders((previous) => [
      ...previous,
      {
        ...form,
        client: form.client.trim(),
        model: form.model.trim(),
        id: `PP-${Math.max(9384, ...previous.map((item) => Number(item.id.replace("PP-", "")) || 0)) + 1}`,
        amount: Number(form.amount),
        weight: Number(form.weight),
        hours: Number(form.hours),
        margin: Number(form.margin),
        status: "Pendiente técnico",
        createdAt,
      },
    ]);
    logActivity(
      "Nuevo trabajo de impresión",
      `${form.client} • ${form.model}`,
      "bag-plus",
      "blue",
    );
    notify("Trabajo creado. Ya puedes revisarlo en Pedidos.");
    onClose();
    navigate("/pedidos");
  };
  return (
    <form onSubmit={submit} className="form-stack">
      <label>
        Cliente
        <input
          autoFocus
          required
          maxLength="100"
          className="form-control"
          name="client"
          value={form.client}
          onChange={change}
          placeholder="Empresa o nombre del cliente"
        />
      </label>
      <label>
        Contacto
        <input
          className="form-control"
          maxLength="100"
          name="contact"
          value={form.contact}
          onChange={change}
          placeholder="Persona responsable"
        />
      </label>
      <label>
        Modelo / proyecto
        <input
          required
          maxLength="120"
          className="form-control"
          name="model"
          value={form.model}
          onChange={change}
          placeholder="Ej. Engranaje Helicoidal v3"
        />
      </label>
      <label>
        Material
        <select
          required
          className="form-select"
          name="material"
          value={form.material}
          onChange={change}
        >
          {materials.map((item) => (
            <option key={item.id}>{item.name}</option>
          ))}
        </select>
      </label>
      <div className="row g-3">
        <label className="col-6">
          Peso estimado (g)
          <input
            required
            className="form-control"
            type="number"
            min="0.01"
            max="1000000"
            step="0.01"
            name="weight"
            value={form.weight}
            onChange={change}
          />
        </label>
        <label className="col-6">
          Impresión (horas)
          <input
            required
            className="form-control"
            type="number"
            min="0.01"
            max="10000"
            step="0.01"
            name="hours"
            value={form.hours}
            onChange={change}
          />
        </label>
        <label className="col-6">
          Cotización total
          <input
            required
            className="form-control"
            type="number"
            min="0.01"
            max="1000000000"
            step="0.01"
            name="amount"
            value={form.amount}
            onChange={change}
          />
        </label>
        <label className="col-6">
          Recargo sobre costo (%)
          <input
            required
            className="form-control"
            type="number"
            min="0"
            max="100"
            step="0.1"
            name="margin"
            value={form.margin}
            onChange={change}
          />
        </label>
      </div>
      <div className="dialog-actions">
        <Button variant="outline-secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" icon="plus-lg">
          Crear trabajo
        </Button>
      </div>
    </form>
  );
}
