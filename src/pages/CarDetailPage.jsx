import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import { getCarById } from "../firebase/carsService";
import "./CarDetailPage.css";

function formatPrice(value) {
  return Number(value || 0).toLocaleString("es-ES");
}

function formatKm(value) {
  return `${Number(value || 0).toLocaleString("es-ES")} km`;
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

  if (kind === "transmission") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 5v14" />
        <path d="M16 5v14" />
        <path d="M8 9h8" />
        <path d="M8 15h8" />
      </svg>
    );
  }

  if (kind === "power") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8z" />
      </svg>
    );
  }

  if (kind === "eco") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 13c4-4 9-6 16-6-2 7-6 12-12 13-2 .3-4-1.2-4-3.3V13z" />
        <path d="M8 16c1.4-1.8 3.7-3.2 6.8-4.3" />
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

function InfoIcon({ kind }) {
  if (kind === "warranty") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3l7 3v6c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    );
  }

  if (kind === "finance") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 8h14" />
        <path d="M5 12h10" />
        <path d="M5 16h8" />
        <path d="M3 4h18v16H3z" />
      </svg>
    );
  }

  if (kind === "delivery") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 7h11v8H3z" />
        <path d="M14 10h4l3 3v2h-7z" />
        <circle cx="7.5" cy="17.5" r="1.5" />
        <circle cx="18" cy="17.5" r="1.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 12l2.5 2.5L16 9" />
      <path d="M12 3l8 4v5c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4z" />
    </svg>
  );
}

function FeatureIcon({ kind }) {
  if (kind === "camera") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 8h12a2 2 0 012 2v6a2 2 0 01-2 2H3a2 2 0 01-2-2v-6a2 2 0 012-2z" />
        <path d="M17 11l5-2v8l-5-2z" />
      </svg>
    );
  }

  if (kind === "display") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5h16v11H4z" />
        <path d="M10 19h4" />
        <path d="M12 16v3" />
      </svg>
    );
  }

  if (kind === "seat") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 6v6a3 3 0 003 3h6" />
        <path d="M5 17h14" />
        <path d="M16 12V8a2 2 0 00-2-2h-3" />
      </svg>
    );
  }

  if (kind === "cruise") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 12l4-2" />
      </svg>
    );
  }

  if (kind === "wheels") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="2" />
        <path d="M12 4v6M20 12h-6M12 20v-6M4 12h6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 11h18" />
      <path d="M5 11V7h3v4" />
      <path d="M16 11V7h3v4" />
      <path d="M4 11v5h16v-5" />
    </svg>
  );
}

function buildGalleryImages(car) {
  if (!car) return [];

  const rawImages = [
    car.imageUrl,
    ...(Array.isArray(car.galleryImages) ? car.galleryImages : []),
    ...(Array.isArray(car.images) ? car.images : []),
  ];

  const filtered = rawImages.filter((image) => typeof image === "string" && image.trim() !== "");
  return [...new Set(filtered)];
}

function getEcoLabel(car) {
  if (car?.environmentalLabel) return String(car.environmentalLabel).toUpperCase();
  if (car?.ecoLabel) return String(car.ecoLabel).toUpperCase();

  const fuel = String(car?.fuel || "").toLowerCase();
  if (fuel.includes("elect") || fuel.includes("hibri")) return "ECO";
  return "C";
}

export default function CarDetailPage() {
  const { id } = useParams();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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

  const galleryImages = useMemo(() => buildGalleryImages(car), [car]);
  const fallbackImage = "https://via.placeholder.com/1400x780?text=Sin+imagen";
  const imageList = galleryImages.length > 0 ? galleryImages : [fallbackImage];
  const activeImage = imageList[Math.min(activeImageIndex, imageList.length - 1)];
  const transmission = car?.transmission || "Automatico";
  const power = car?.power || car?.horsePower || "-";
  const ecoLabel = getEcoLabel(car);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [id, car?.id]);

  function showPrevImage() {
    setActiveImageIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  }

  function showNextImage() {
    setActiveImageIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  }

  const keyFacts = [
    { label: "Ano", value: car?.year || "-", icon: "year" },
    { label: "Kilometros", value: formatKm(car?.km), icon: "km" },
    { label: "Combustible", value: car?.fuel || "-", icon: "fuel" },
    { label: "Transmision", value: transmission, icon: "transmission" },
  ];

  const detailCards = [
    { label: "Ano", value: car?.year || "-", icon: "year" },
    { label: "Kilometros", value: formatKm(car?.km), icon: "km" },
    { label: "Combustible", value: car?.fuel || "-", icon: "fuel" },
    { label: "Transmision", value: transmission, icon: "transmission" },
    { label: "Potencia", value: power === "-" ? "-" : `${power} CV`, icon: "power" },
    { label: "Etiqueta ambiental", value: ecoLabel, icon: "eco", badge: true },
  ];

  const highlights = [
    { title: "Garantia", subtitle: "12 meses incluida", icon: "warranty" },
    { title: "Financiacion", subtitle: "A medida y sin compromiso", icon: "finance" },
    { title: "Entrega", subtitle: "En toda Espana", icon: "delivery" },
    { title: "Revision", subtitle: "Revisado y listo para entregar", icon: "revision" },
  ];

  const features = [
    { title: "Climatizador automatico", subtitle: "Bi-zona", icon: "climate" },
    { title: "Camara trasera", subtitle: "y sensores", icon: "camera" },
    { title: "Pantalla tactil", subtitle: "con Apple CarPlay", icon: "display" },
    { title: "Asientos calefactables", subtitle: "delanteros", icon: "seat" },
    { title: "Control de crucero", subtitle: "adaptativo", icon: "cruise" },
    { title: "Llantas de aleacion", subtitle: "16 pulgadas", icon: "wheels" },
  ];

  const specs = [
    ["Marca", car?.brand || "-"],
    ["Modelo", car?.model || "-"],
    ["Ano", car?.year || "-"],
    ["Kilometros", formatKm(car?.km)],
    ["Combustible", car?.fuel || "-"],
    ["Transmision", transmission],
    ["Potencia", power === "-" ? "-" : `${power} CV`],
    ["Traccion", car?.traction || "Delantera"],
    ["Color", car?.color || "Gris metalizado"],
    ["Puertas", car?.doors || 5],
    ["Plazas", car?.seats || 5],
    ["Etiqueta ambiental", ecoLabel],
  ];

  const thumbsToShow = imageList.slice(0, 6);
  const hiddenThumbs = Math.max(imageList.length - thumbsToShow.length, 0);

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
              <section className="car-detail-layout">
                <div className="car-detail-main">
                  <header className="car-detail-hero">
                    <p className="car-detail-card__tag">{car.brand}</p>
                    <h1>
                      {car.brand} <span>{car.model}</span>
                    </h1>
                    <div className="car-detail-hero__price-row">
                      <p className="car-detail-card__price">{formatPrice(car.price)} EUR</p>
                      <span className="car-detail-hero__iva-pill">IVA incluido</span>
                    </div>
                    <div className="car-detail-keyfacts">
                      {keyFacts.map((fact) => (
                        <article key={fact.label} className="car-detail-keyfacts__item">
                          <span className="car-detail-keyfacts__icon">
                            <SpecIcon kind={fact.icon} />
                          </span>
                          <strong>{fact.value}</strong>
                        </article>
                      ))}
                    </div>
                  </header>

                  <section className="car-detail-media">
                    {car.badge && (
                      <span className={`car-detail-media__badge car-detail-media__badge--${car.environmentalBadge || "orange"}`}>
                        {car.badge}
                      </span>
                    )}

                    <img src={activeImage} alt={`${car.brand} ${car.model}`} className="car-detail-media__image" />

                    {imageList.length > 1 && (
                      <>
                        <button
                          className="car-detail-media__nav car-detail-media__nav--prev"
                          type="button"
                          onClick={showPrevImage}
                          aria-label="Imagen anterior"
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M15 5l-7 7 7 7" />
                          </svg>
                        </button>

                        <button
                          className="car-detail-media__nav car-detail-media__nav--next"
                          type="button"
                          onClick={showNextImage}
                          aria-label="Imagen siguiente"
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}
                  </section>

                  <section className="car-detail-thumbs">
                    {thumbsToShow.map((image, index) => {
                      const isActive = image === activeImage;
                      const showHiddenCounter = hiddenThumbs > 0 && index === thumbsToShow.length - 1;

                      return (
                        <button
                          type="button"
                          key={`${image}-${index}`}
                          className={`car-detail-thumbs__item ${isActive ? "is-active" : ""}`}
                          onClick={() => setActiveImageIndex(index)}
                          aria-label={`Mostrar imagen ${index + 1}`}
                        >
                          <img src={image} alt={`${car.brand} ${car.model} vista ${index + 1}`} />
                          {showHiddenCounter && (
                            <span className="car-detail-thumbs__more">+{hiddenThumbs}</span>
                          )}
                        </button>
                      );
                    })}
                  </section>
                </div>

                <aside className="car-detail-sidebar">
                  <div className="car-detail-sidebar__actions">
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

                  <button className="car-detail-favorite-btn" type="button">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                    Anadir a favoritos
                  </button>

                  <article className="car-detail-sidebar-card">
                    <h2>Informacion destacada</h2>
                    <ul className="car-detail-highlight-list">
                      {highlights.map((highlight) => (
                        <li key={highlight.title}>
                          <span>
                            <InfoIcon kind={highlight.icon} />
                          </span>
                          <div>
                            <strong>{highlight.title}</strong>
                            <p>{highlight.subtitle}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </article>

                  <article className="car-detail-contact-card">
                    <h2>Te interesa este coche?</h2>
                    <p>Contactanos y te asesoramos sin compromiso.</p>
                    <Link to="/contacto" className="car-detail-contact-card__btn">
                      Contactar ahora
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M5 12h14" />
                        <path d="M13 6l6 6-6 6" />
                      </svg>
                    </Link>
                  </article>
                </aside>
              </section>

              <section className="car-detail-specs">
                {detailCards.map((item) => (
                  <article key={item.label} className="car-detail-spec">
                    <span className="car-detail-spec__icon">
                      <SpecIcon kind={item.icon} />
                    </span>
                    <div>
                      <p>{item.label}</p>
                      <strong className={item.badge ? "car-detail-spec__eco-tag" : ""}>{item.value}</strong>
                    </div>
                  </article>
                ))}
              </section>

              <section className="car-detail-bottom">
                <article className="car-detail-notes">
                  <h2>Descripcion del vehiculo</h2>
                  <p>
                    {car.description ||
                      `${car.brand} ${car.model} combina eficiencia, tecnologia y confort para el dia a dia.`}
                  </p>
                  <p>
                    Vehiculo revisado y listo para entrega. Se entrega con garantia y opcion de financiacion.
                  </p>

                  <ul className="car-detail-features-grid">
                    {features.map((feature) => (
                      <li key={feature.title}>
                        <span>
                          <FeatureIcon kind={feature.icon} />
                        </span>
                        <div>
                          <strong>{feature.title}</strong>
                          <p>{feature.subtitle}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="car-detail-tech-card">
                  <h2>Especificaciones tecnicas</h2>
                  <dl className="car-detail-tech-list">
                    {specs.map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              </section>
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
