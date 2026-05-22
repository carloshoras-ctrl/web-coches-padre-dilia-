import { useState } from "react";
import { Link } from "react-router-dom";
import { carsData } from "../../data/carsData";
import CarCard from "../CarCard/CarCard";
import "./FeaturedCars.css";

const FILTERS = ["Todos", "Gasolina", "Diésel", "Híbrido", "Eléctrico"];

export default function FeaturedCars({
  sectionId = "coches",
  title,
  subtitle = "Los mejores coches al mejor precio",
  showHeaderLink = true,
}) {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const filtered =
    activeFilter === "Todos"
      ? carsData
      : carsData.filter((c) => c.fuel === activeFilter);

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

        <div className="featured__grid">
          {filtered.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              isFavorite={favorites.includes(car.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
