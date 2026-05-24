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
          <a href="#" className="car-card__btn">
            Ver ficha
          </a>
          <a href="#contacto" className="car-card__btn car-card__btn--outline">
            Contactar
          </a>
        </div>
      </div>
    </article>
  );
}
