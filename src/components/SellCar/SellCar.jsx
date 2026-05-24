import { Link } from "react-router-dom";
import "./SellCar.css";

export default function SellCar() {
  return (
    <section className="sellcar">
      <div className=" sellcar__inner">
        <div className="sellcar__text">
          <h2 className="sellcar__title">Quieres hablar con el vendedor?</h2>
          <p className="sellcar__desc">Resuelve tus dudas y recibe atencion personalizada.</p>
        </div>
        <Link to="/contacto" className="sellcar__btn">
          CONTACTAR CON EL VENDEDOR
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
