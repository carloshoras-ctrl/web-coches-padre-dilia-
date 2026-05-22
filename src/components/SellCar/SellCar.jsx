import "./SellCar.css";

export default function SellCar() {
  return (
    <section className="sellcar">
      <div className=" sellcar__inner">
        <div className="sellcar__text">
          <h2 className="sellcar__title">¿Tienes un coche para vender?</h2>
          <p className="sellcar__desc">Lo tasamos gratis y te hacemos la mejor oferta.</p>
        </div>
        <a href="#contacto" className="sellcar__btn">
          TASAR MI COCHE
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </section>
  );
}
