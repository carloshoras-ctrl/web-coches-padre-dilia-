import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getCars, getFeaturedCars } from "../../services/carsService";
import CarCard from "../CarCard/CarCard";
import "./FeaturedCars.css";

const FILTERS = ["Todos", "Gasolina", "Diesel", "Hibrido", "Electrico"];

function normalizeValue(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function FeaturedCars({
  sectionId = "coches",
  title,
  subtitle = "Los mejores coches al mejor precio",
  showHeaderLink = true,
  featuredOnly = true,
}) {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [favorites, setFavorites] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCars() {
      setLoading(true);
      setError("");

      try {
        const nextCars = featuredOnly ? await getFeaturedCars() : await getCars();
        if (!cancelled) {
          setCars(nextCars);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError("No se han podido cargar los coches.");
          setCars([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCars();

    return () => {
      cancelled = true;
    };
  }, [featuredOnly]);


  const filteredCars = useMemo(() => {
    if (activeFilter === "Todos") return cars;

    const activeFilterNormalized = normalizeValue(activeFilter);
    return cars.filter((car) => normalizeValue(car.fuel) === activeFilterNormalized);
  }, [activeFilter, cars]);

  const resolvedTitle =
    title || (
      <>
        COCHES <span className="featured__title-accent">DESTACADOS</span>
      </>
    );

  return (
    <section className="featured" id={sectionId}>
      <div>
        <div className="featured__header">
          <div className="title-wrapper">
            <h2 className="featured__title">{resolvedTitle}</h2>
            <p className="featured__subtitle">{subtitle}</p>
          </div>
        </div>
        <div className="filters-row">
          <div className="featured__filters">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`filter-btn ${activeFilter === f ? "active" : ""}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          {showHeaderLink && (
            <Link to="/catalogo" className="featured__link">
              Ver todos los coches
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          )}

        </div>

        {loading && <p className="featured__feedback">Cargando coches...</p>}
        {!loading && error && <p className="featured__feedback featured__feedback--error">{error}</p>}
        {!loading && !error && filteredCars.length === 0 && (
          <p className="featured__feedback">No hay coches para este filtro.</p>
        )}

        {!loading && !error && filteredCars.length > 0 && (
          <div className="featured__grid">
            {filteredCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                isFavorite={favorites.includes(car.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
