import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__overlay" />
      <div className="hero__content">
        <div className="hero__text">
          <h1 className="hero__title">
            Encuentra tu próximo
            <span className="hero__highlight"> coche.</span>
          </h1>
          <p className="hero__subtitle">
            Coches de segunda mano revisados, garantizados y al mejor precio.
          </p>
          <a href="#coches" className="btn-primary hero__btn">
            VER COCHES DISPONIBLES
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
