import { Link } from "react-router-dom";
import "./CarCard.css";

export default function CarCard({ car, isFavorite, onToggleFavorite }) {
  const { id, brand, model, year, km, fuel, price, badge, badgeColor, imageUrl } = car;

  return (
    <article className="car-card">
      <div className="car-card__img-wrap">
        {badge && (
          <span className={`car-card__badge car-card__badge--${badgeColor}`}>
            {badge}
          </span>
        )}

        <img
          src={imageUrl || "https://via.placeholder.com/600x360?text=Sin+imagen"}
          alt={`${brand} ${model}`}
          className="car-card__img"
          loading="lazy"
        />

        <button
          className={`car-card__fav ${isFavorite ? "active" : ""}`}
          onClick={() => onToggleFavorite(id)}
          aria-label="Anadir a favoritos"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>
      </div>

      <div className="car-card__body">
        <h3 className="car-card__name">
          {brand} <span>{model}</span>
        </h3>

        <p className="car-card__meta">
          {year}
          <span className="car-card__dot" />
          {Number(km || 0).toLocaleString("es-ES")} km
          <span className="car-card__dot" />
          {fuel}
        </p>

        <p className="car-card__price">{Number(price || 0).toLocaleString("es-ES")} EUR</p>

        <div className="car-card__actions">
          <Link to={`/coches/${id}`} className="car-card__btn">
            Ver ficha
          </Link>
          <Link to="/contacto" className="car-card__btn car-card__btn--outline">
            Contactar
          </Link>
        </div>
      </div>
    </article>
  );
}
