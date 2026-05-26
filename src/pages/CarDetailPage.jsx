import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import { getCarById } from "../firebase/carsService";
import "./CarDetailPage.css";

function formatPrice(value) {
  return Number(value || 0).toLocaleString("es-ES");
}

function SpecIcon({ kind }) {
  if (kind === "year") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 2v3M17 2v3M4 9h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z" />
      </svg>
    );
  }

  if (kind === "km") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 12l4-3" />
        <path d="M12 16h.01" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 14c2-1 4-1 6 0 2 1 4 1 6 0" />
      <path d="M8 10h8l1 4H7l1-4z" />
      <circle cx="9" cy="16" r="1" />
      <circle cx="15" cy="16" r="1" />
    </svg>
  );
}

export default function CarDetailPage() {
  const { id } = useParams();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCar() {
      setLoading(true);
      setError("");

      try {
        const nextCar = await getCarById(id);
        if (!cancelled) setCar(nextCar);
      } catch (loadError) {
        if (!cancelled) {
          setCar(null);
          setError("No se ha encontrado la ficha de este coche.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCar();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <>
      <Navbar />

      <main className="car-detail-page">
        <section className="car-detail-shell">
          <Link to="/catalogo" className="car-detail__back-link">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
            Volver al catalogo
          </Link>

          {loading && <p className="car-detail__feedback">Cargando ficha del coche...</p>}
          {!loading && error && <p className="car-detail__feedback car-detail__feedback--error">{error}</p>}

          {!loading && !error && car && (
            <>
              <header className="car-detail-hero">
                <div>
                  <p className="car-detail-card__tag">Ficha de vehiculo</p>
                  <h1>
                    {car.brand} <span>{car.model}</span>
                  </h1>
                  <p className="car-detail-card__price">{formatPrice(car.price)} EUR</p>
                </div>

                <div className="car-detail-card__actions">
                  <a href="tel:600123456" className="car-detail-btn">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2A19.8 19.8 0 0111.2 18.9a19.5 19.5 0 01-6.1-6.1A19.8 19.8 0 012.08 4.2 2 2 0 014.06 2h3a2 2 0 012 1.72c.1.95.35 1.88.72 2.76a2 2 0 01-.45 2.11l-.9.9a16 16 0 006.18 6.18l.9-.9a2 2 0 012.1-.45 12.8 12.8 0 002.77.72A2 2 0 0122 16.92z" />
                    </svg>
                    Llamar ahora
                  </a>
                  <Link to="/contacto" className="car-detail-btn car-detail-btn--outline">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z" />
                      <path d="M21 7l-9 6L3 7" />
                    </svg>
                    Contactar por formulario
                  </Link>
                </div>
              </header>

              <section className="car-detail-media">
                {car.badge && (
                  <span className={`car-detail-media__badge car-detail-media__badge--${car.badgeColor || "orange"}`}>
                    {car.badge}
                  </span>
                )}
                <img
                  src={car.imageUrl || "https://via.placeholder.com/1400x780?text=Sin+imagen"}
                  alt={`${car.brand} ${car.model}`}
                  className="car-detail-media__image"
                />
              </section>

              <section className="car-detail-specs">
                <article className="car-detail-spec">
                  <span className="car-detail-spec__icon"><SpecIcon kind="year" /></span>
                  <div>
                    <p>Anio</p>
                    <strong>{car.year || "-"}</strong>
                  </div>
                </article>

                <article className="car-detail-spec">
                  <span className="car-detail-spec__icon"><SpecIcon kind="km" /></span>
                  <div>
                    <p>Kilometros</p>
                    <strong>{Number(car.km || 0).toLocaleString("es-ES")} km</strong>
                  </div>
                </article>

                <article className="car-detail-spec">
                  <span className="car-detail-spec__icon"><SpecIcon kind="fuel" /></span>
                  <div>
                    <p>Combustible</p>
                    <strong>{car.fuel || "-"}</strong>
                  </div>
                </article>
              </section>

              <section className="car-detail-notes">
                <h2>Resumen del vehiculo</h2>
                <p>
                  Vehiculo revisado y listo para entrega. Si te interesa, contacta con el vendedor y
                  te enviaremos informacion detallada de mantenimiento, financiacion y disponibilidad.
                </p>
              </section>
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
