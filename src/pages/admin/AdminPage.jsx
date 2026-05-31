import { useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { logoutAdmin } from "../../firebase/authService";
import { addCar, deleteCar, getCars, updateCar } from "../../services/carsService";
import "./AdminPage.css";
import { ENVIRONMENTAL_BADGE_OPTIONS, TRANSMISSION_OPTIONS } from "../../constants/formOptions";

const FUEL_OPTIONS = ["Gasolina", "Diesel", "Hibrido", "Electrico"];
const ETIQUETAS_MEDIOAMBIENTALES = ["0 Emisiones", "ECO", "C", "B", "Sin Etiqueta"];

const EMPTY_FORM = {
  brand: "",
  model: "",
  year: "",
  km: "",
  fuel: FUEL_OPTIONS[0],
  price: "",
  imageUrl: "",
  badge: "",
  environmentalBadge: ETIQUETAS_MEDIOAMBIENTALES[0],
  featured: true,
};


const ENVIRONMENTAL_BADGE_MAP = {
  "0 Emisiones": "zero",
  "ECO": "eco",
  "C": "c",
  "B": "b",
  "Sin Etiqueta": "none"
};

function formatPrice(value) {
  return Number(value || 0).toLocaleString("es-ES");
}

export default function AdminPage() {
  const { adminUser } = useAdminAuth();

  const [cars, setCars] = useState([]);
  const [carsLoading, setCarsLoading] = useState(false);
  const [carsError, setCarsError] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [deleteLoadingId, setDeleteLoadingId] = useState("");

  useEffect(() => {
    loadCars();
  }, []);

  const editingCar = useMemo(() => cars.find((car) => car.id === editingId) || null, [cars, editingId]);

  async function loadCars() {
    setCarsLoading(true);
    setCarsError("");

    try {
      const nextCars = await getCars();
      setCars(nextCars);
    } catch (error) {
      setCarsError("No se han podido cargar los coches.");
    } finally {
      setCarsLoading(false);
    }
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId("");
    setFormError("");
  }

  function startEdit(car) {
    setEditingId(car.id);
    setForm({
      brand: car.brand || "",
      model: car.model || "",
      year: car.year ? String(car.year) : "",
      km: car.km ? String(car.km) : "",
      fuel: car.fuel || FUEL_OPTIONS[0],
      price: car.price ? String(car.price) : "",
      imageUrl: car.imageUrl || "",
      badge: car.badge || "",
      environmentalBadge: car.environmentalBadge || ETIQUETAS_MEDIOAMBIENTALES[0],
      featured: Boolean(car.featured),
    });
    setFormError("");
    setFormMessage("");
  }

  async function handleLogout() {
    await logoutAdmin();
  }

  async function handleSave(event) {
    event.preventDefault();
    setFormError("");
    setFormMessage("");

    const brand = form.brand.trim();
    const model = form.model.trim();
    const fuel = form.fuel.trim();
    const imageUrl = form.imageUrl.trim();
    const badge = form.badge.trim();
    const environmentalBadge = ENVIRONMENTAL_BADGE_MAP[form.environmentalBadge]
    console.log({ environmentalBadge })

    const year = Number(form.year);
    const km = Number(form.km);
    const price = Number(form.price);

    if (!brand || !model || !fuel || !year || !km || !price || !imageUrl) {
      setFormError("Completa marca, modelo, combustible, añoo, km, precio e imagen.");
      return;
    }

    if (!/^https?:\/\//i.test(imageUrl)) {
      setFormError("La URL de imagen debe empezar por http:// o https://.");
      return;
    }

    const payload = {
      brand,
      model,
      fuel,
      year,
      km,
      price,
      imageUrl,
      badge: badge || null,
      environmentalBadge,
      featured: Boolean(form.featured),
    };

    setSaveLoading(true);

    try {
      if (editingId) {
        await updateCar(editingId, payload);
        setFormMessage("Coche actualizado correctamente.");
      } else {
        await addCar(payload);
        setFormMessage("Coche publicado correctamente.");
      }

      resetForm();
      await loadCars();
    } catch (error) {
      const code = error?.code ? ` (${error.code})` : "";
      const message = error?.message || "No se ha podido guardar el coche.";
      setFormError(`${message}${code}`);
    } finally {
      setSaveLoading(false);
    }
  }

  async function handleDelete(car) {
    const confirmed = window.confirm(`Vas a eliminar ${car.brand} ${car.model}. Continuar?`);
    if (!confirmed) return;

    setDeleteLoadingId(car.id);
    setFormMessage("");
    setFormError("");

    try {
      await deleteCar(car.id);

      if (editingId === car.id) {
        resetForm();
      }

      setFormMessage("Coche eliminado correctamente.");
      await loadCars();
    } catch (error) {
      setFormError("No se ha podido eliminar el coche.");
    } finally {
      setDeleteLoadingId("");
    }
  }

  return (
    <>
      <main className="admin-page">
        <section className="admin-shell">
          <header className="admin-shell__header">
            <h1>
              PANEL <span>ADMIN</span>
            </h1>
            <p>Gestiona coches publicados: alta, edicion y eliminacion.</p>
          </header>

          <div className="admin-dashboard">
            <div className="admin-card admin-session">
              <div>
                <p className="admin-session__label">Sesion activa</p>
                <p className="admin-session__mail">{adminUser?.email || "Administrador"}</p>
              </div>
              <button className="admin-btn admin-btn--ghost" onClick={handleLogout}>
                Cerrar sesion
              </button>
            </div>

            <div className="admin-layout">
              <section className="admin-card admin-form-card">
                <h2>{editingCar ? `Editando: ${editingCar.brand} ${editingCar.model}` : "Publicar coche"}</h2>

                <form className="admin-form" onSubmit={handleSave}>
                  <div className="admin-form-grid">
                    <label>
                      Marca
                      <input
                        type="text"
                        value={form.brand}
                        onChange={(event) => setForm((prev) => ({ ...prev, brand: event.target.value }))}
                        required
                      />
                    </label>

                    <label>
                      Modelo
                      <input
                        type="text"
                        value={form.model}
                        onChange={(event) => setForm((prev) => ({ ...prev, model: event.target.value }))}
                        required
                      />
                    </label>

                    <label>
                      Año
                      <input
                        type="number"
                        min="1990"
                        max="2100"
                        value={form.year}
                        onChange={(event) => setForm((prev) => ({ ...prev, year: event.target.value }))}
                        required
                      />
                    </label>

                    <label>
                      Kilometros
                      <input
                        type="number"
                        min="0"
                        value={Number(form.km).toLocaleString("es-ES")}
                        onChange={(event) => setForm((prev) => ({ ...prev, km: event.target.value }))}
                        required
                      />
                    </label>

                    <label>
                      Combustible
                      <select
                        value={form.fuel}
                        onChange={(event) => setForm((prev) => ({ ...prev, fuel: event.target.value }))}
                      >
                        {FUEL_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Cambio
                      <select
                        value={form.transmission}
                        onChange={(event) => setForm((prev) => ({ ...prev, transmission: event.target.value }))}
                      >
                        {TRANSMISSION_OPTIONS.map(({ value, label }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      Precio EUR
                      <input
                        type="number"
                        min="0"
                        value={form.price}
                        onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                        required
                      />
                    </label>
                    <label>
                      Potencia (CV)
                      <input
                        type="number"
                        min="0"
                        value={form.power}
                        onChange={(event) => setForm((prev) => ({ ...prev, power: event.target.value }))}
                        required
                      />
                    </label>
                    <label>
                      Etiqueta Medioambiental
                      <select
                        value={form.environmentalBadge}
                        onChange={(event) => setForm((prev) => ({ ...prev, environmentalBadge: event.target.value }))}
                      >
                        {ENVIRONMENTAL_BADGE_OPTIONS.map(({ value, label }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Carrocería
                      <input
                        type="text"
                        value={form.body}
                        onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))}
                        required
                      />
                    </label>
                    <label>
                      Color
                      <input
                        type="text"
                        value={form.color}
                        onChange={(event) => setForm((prev) => ({ ...prev, color: event.target.value }))}
                        required
                      />
                    </label>
                    <label>
                      {"Cilindrada (cc)"}
                      <input
                        type="number"
                        min="0"
                        value={form.engineSize}
                        onChange={(event) => setForm((prev) => ({ ...prev, engineSize: event.target.value }))}
                        required
                      />
                    </label>
                    <label>
                      Número de Cilindros
                      <input
                        type="number"
                        min="0"
                        value={form.numCilinders}
                        onChange={(event) => setForm((prev) => ({ ...prev, numCilinders: event.target.value }))}
                        required
                      />
                    </label>
                    <label>
                      Marchas
                      <input
                        type="number"
                        min="0"
                        value={form.gears}
                        onChange={(event) => setForm((prev) => ({ ...prev, gears: event.target.value }))}
                        required
                      />
                    </label>
                    <label>
                      Plazas
                      <input
                        type="number"
                        min="0"
                        value={form.seats}
                        onChange={(event) => setForm((prev) => ({ ...prev, seats: event.target.value }))}
                        required
                      />
                    </label>
                    <label>
                      Puertas
                      <input
                        type="number"
                        min="0"
                        value={form.doors}
                        onChange={(event) => setForm((prev) => ({ ...prev, doors: event.target.value }))}
                        required
                      />
                    </label>
                    <label>
                      Normativa Emisiones
                      <input
                        type="text"
                        value={form.euroStandard}
                        onChange={(event) => setForm((prev) => ({ ...prev, euroStandard: event.target.value }))}
                        placeholder={`p.e "EURO 5"`}
                        required
                      />
                    </label>

                    <label>
                      URL de imagen
                      <input
                        type="url"
                        value={form.imageUrl}
                        onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
                        placeholder="https://images.unsplash.com/..."
                        required
                      />
                    </label>


                  </div>

                  <label className="admin-checkbox">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(event) => setForm((prev) => ({ ...prev, featured: event.target.checked }))}
                    />
                    Marcar como destacado
                  </label>

                  {formError && <p className="admin-feedback admin-feedback--error">{formError}</p>}
                  {formMessage && <p className="admin-feedback admin-feedback--ok">{formMessage}</p>}

                  <div className="admin-actions">
                    <button className="admin-btn" type="submit" disabled={saveLoading}>
                      {saveLoading ? "Guardando..." : editingId ? "Actualizar coche" : "Publicar coche"}
                    </button>

                    {editingId && (
                      <button type="button" className="admin-btn admin-btn--ghost" onClick={resetForm}>
                        Cancelar edicion
                      </button>
                    )}
                  </div>
                </form>
              </section>

              <section className="admin-card admin-list-card">
                <h2>Coches publicados</h2>

                {carsLoading && <p className="admin-feedback">Cargando listado...</p>}
                {!carsLoading && carsError && (
                  <p className="admin-feedback admin-feedback--error">{carsError}</p>
                )}
                {!carsLoading && !carsError && cars.length === 0 && (
                  <p className="admin-feedback">Aun no hay coches publicados.</p>
                )}

                {!carsLoading && !carsError && cars.length > 0 && (
                  <ul className="admin-cars-list">
                    {cars.map((car) => (
                      <li key={car.id} className="admin-cars-item">
                        <img
                          className="admin-cars-item__img"
                          src={car.imageUrl || "https://via.placeholder.com/240x150?text=Sin+imagen"}
                          alt={`${car.brand} ${car.model}`}
                        />

                        <div className="admin-cars-item__info">
                          <h3>
                            {car.brand} <span>{car.model}</span>
                          </h3>
                          <p>
                            {car.year} | {Number(car.km || 0).toLocaleString("es-ES")} km | {car.fuel}
                          </p>
                          <strong>{formatPrice(car.price)} EUR</strong>
                        </div>

                        <div className="admin-cars-item__actions">
                          <button className="admin-btn admin-btn--ghost" onClick={() => startEdit(car)}>
                            Editar
                          </button>
                          <button
                            className="admin-btn admin-btn--danger"
                            onClick={() => handleDelete(car)}
                            disabled={deleteLoadingId === car.id}
                          >
                            {deleteLoadingId === car.id ? "Eliminando..." : "Eliminar"}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
