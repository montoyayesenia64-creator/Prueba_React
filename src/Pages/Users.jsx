import { useState } from "react";
import { useAppData } from "../context/AppContext";
import {
  PageHeader,
  StatCard,
  Button,
  Badge,
  Icon,
  Modal,
  Switch,
  EmptyState,
} from "../components/UI";
const blank = { name: "", email: "", role: "Operador", status: "Ausente" };
export default function Users({ search }) {
  const { users, setUsers, settings, setSettings, notify, logActivity } =
    useAppData();
  const [tab, setTab] = useState("Todos");
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const filtered = users.filter(
    (item) =>
      `${item.name} ${item.email} ${item.role}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (tab === "Todos" ||
        item.role === (tab === "Operadores" ? "Operador" : "Cliente")),
  );
  const submit = (event) => {
    event.preventDefault();
    if (!form.name.trim())
      return notify("Escribe el nombre del usuario.", "warning");
    const email = form.email.trim().toLowerCase();
    if (
      users.some(
        (item) => item.id !== editing && item.email.toLowerCase() === email,
      )
    )
      return notify("Este correo ya está registrado.", "warning");
    const previous = users.find((item) => item.id === editing);
    const item = {
      ...form,
      name: form.name.trim(),
      email,
      id: editing || crypto.randomUUID(),
      activity: "Ahora mismo",
      color: previous?.color || "#8337f5",
    };
    setUsers((previousUsers) =>
      editing
        ? previousUsers.map((user) => (user.id === editing ? item : user))
        : [...previousUsers, item],
    );
    logActivity(
      editing ? "Usuario actualizado" : "Usuario registrado",
      `${item.name} • ${item.role}`,
      "person-plus",
      "purple",
    );
    notify(editing ? "Usuario actualizado." : "Usuario registrado.");
    setModalOpen(false);
  };
  const security = (key, value) => {
    setSettings({ ...settings, [key]: value });
    notify("Preferencia de seguridad guardada para esta demostración.");
  };
  return (
    <>
      <PageHeader title="Gestión de Usuarios">
        <Button
          icon="person-plus"
          onClick={() => {
            setForm(blank);
            setEditing(null);
            setModalOpen(true);
          }}
        >
          Añadir Usuario
        </Button>
      </PageHeader>
      <div className="stats-grid three">
        <StatCard
          label="Total usuarios"
          value={new Intl.NumberFormat("en").format(1280 + users.length)}
          icon="people"
          change="+12%"
        />
        <StatCard
          label="En línea"
          value={40 + users.filter((item) => item.status === "En línea").length}
          icon="lightning-charge"
          tone="blue"
          change="Estable"
          changeTone="gray"
        />
        <StatCard
          label="Adopción 2FA"
          value="98.2%"
          icon="shield-exclamation"
          tone="red"
        />
      </div>
      <div className="dashboard-grid">
        <section className="surface users-card">
          <div
            className="user-tabs"
            role="tablist"
            aria-label="Tipo de usuario"
          >
            {["Todos", "Operadores", "Clientes"].map((value) => (
              <button
                key={value}
                role="tab"
                aria-selected={tab === value}
                className={tab === value ? "active" : ""}
                onClick={() => setTab(value)}
              >
                {value}
              </button>
            ))}
          </div>
          <div
            className="table-responsive"
            role="tabpanel"
            aria-label={`Usuarios: ${tab}`}
          >
            <table className="table app-table users-table">
              <thead>
                <tr>
                  <th>Identidad</th>
                  <th>Rol</th>
                  <th>Estado red</th>
                  <th>Última actividad</th>
                  <th>
                    <span className="visually-hidden">Editar</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="user-identity">
                        <span
                          className="avatar mini"
                          style={{ background: item.color }}
                        >
                          {item.name
                            .split(" ")
                            .map((word) => word[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </span>
                        <span>
                          <strong
                            className={
                              item.status === "Suspendido" ? "text-danger" : ""
                            }
                          >
                            {item.name}
                          </strong>
                          <small>{item.email}</small>
                        </span>
                      </div>
                    </td>
                    <td>
                      <Badge
                        tone={
                          item.role === "Admin"
                            ? "purple"
                            : item.role === "Operador"
                              ? "green"
                              : "blue"
                        }
                      >
                        {item.role}
                      </Badge>
                    </td>
                    <td>
                      <span
                        className={`network-status ${item.status === "Suspendido" ? "suspended" : item.status === "Ausente" ? "away" : ""}`}
                      >
                        <span className="status-dot" />
                        {item.status}
                      </span>
                    </td>
                    <td className="muted">{item.activity}</td>
                    <td>
                      <button
                        className="icon-button"
                        aria-label={`Editar ${item.name}`}
                        onClick={() => {
                          setForm(item);
                          setEditing(item.id);
                          setModalOpen(true);
                        }}
                      >
                        <Icon name="three-dots-vertical" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && <EmptyState />}
          </div>
        </section>
        <section className="surface security-card">
          <h2>Escudo de Seguridad</h2>
          <Switch
            label="Imponer 2FA"
            description="Obligatorio para roles admin"
            checked={settings.enforce2fa}
            onChange={(value) => security("enforce2fa", value)}
          />
          <Switch
            label="Lista Blanca de IP"
            description="Restringir a subred interna"
            checked={settings.ipWhitelist}
            onChange={(value) => security("ipWhitelist", value)}
          />
          <div className="role-summary">
            <h3 className="eyebrow">Resumen de roles</h3>
            {[
              ["Administrador", "Control Total", "#8d35ff"],
              ["Operador", "Imprimir/Editar", "#ad80ff"],
              ["Cliente", "Sólo Lectura", "#c8afff"],
            ].map(([name, permission, color]) => (
              <div key={name}>
                <span>
                  <b className="status-dot" style={{ background: color }} />
                  {name}
                </span>
                <span className="muted">{permission}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
      {modalOpen && (
        <Modal
          title={editing ? "Editar usuario" : "Añadir usuario"}
          onClose={() => setModalOpen(false)}
        >
          <form className="form-stack" onSubmit={submit}>
            <label>
              Nombre completo
              <input
                autoFocus
                className="form-control"
                required
                maxLength="100"
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
              />
            </label>
            <label>
              Correo electrónico
              <input
                type="email"
                className="form-control"
                required
                maxLength="150"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
              />
            </label>
            <label>
              Rol
              <select
                className="form-select"
                value={form.role}
                disabled={editing === "USR-001"}
                onChange={(event) =>
                  setForm({ ...form, role: event.target.value })
                }
              >
                {["Admin", "Operador", "Cliente"].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label>
              Estado
              <select
                className="form-select"
                value={form.status}
                disabled={editing === "USR-001"}
                onChange={(event) =>
                  setForm({ ...form, status: event.target.value })
                }
              >
                {["En línea", "Ausente", "Suspendido"].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            {editing === "USR-001" && (
              <p className="field-help">
                El rol y el estado del administrador principal están protegidos.
              </p>
            )}
            <Button type="submit" icon="floppy">
              Guardar usuario
            </Button>
          </form>
        </Modal>
      )}
    </>
  );
}
