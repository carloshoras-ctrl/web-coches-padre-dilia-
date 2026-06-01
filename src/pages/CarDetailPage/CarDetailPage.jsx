import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCarById } from "../../services/carsService";
import "./CarDetailPage.css";
import CarSpecifications from "./CarSpecifications/CarSpecifications";
import EnvironmentalBadge from "../../components/EnvironmentalBadge/EnvironmentalBadge";
import { FeatureIcon, InfoIcon, SpecIcon } from "../../components/ui/CarIcons";

function formatPrice(value) {
  return Number(value || 0).toLocaleString("es-ES");
}

function formatKm(value) {
  return `${Number(value || 0).toLocaleString("es-ES")} km`;
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
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [contactSending, setContactSending] = useState(false);
  const [contactFeedback, setContactFeedback] = useState("");

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
    { label: "Año", value: car?.year || "-", icon: "year" },
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

  const thumbsToShow = imageList.slice(0, 6);
  const hiddenThumbs = Math.max(imageList.length - thumbsToShow.length, 0);

  function updateContactField(field, value) {
    setContactForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleContactSubmit(event) {
    event.preventDefault();
    setContactFeedback("");
    setContactSending(true);

    await new Promise((resolve) => setTimeout(resolve, 700));

    setContactFeedback("Mensaje enviado. Te contactaremos en menos de 24 horas laborables.");
    setContactForm({ name: "", phone: "", email: "", message: "" });
    setContactSending(false);
  }

  return (
    <>
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
                    <h1>
                      {car.brand} <span>{car.model}</span>
                    </h1>
                    <div className="car-detail-hero__price-row">
                      <p className="car-detail-card__price">{formatPrice(car.price)} EUR</p>
                      <span className="car-detail-hero__iva-pill">IVA incluido</span>
                    </div>
                  </header>
                  <section className="car-detail-media-layout">
                    <div className="car-detail-media-column">
                      <section className="car-detail-media">
                        <EnvironmentalBadge environmentalBadge={car?.environmentalBadge} />

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
                    <CarSpecifications selectedCar={car} />
                  </section>
                </div>

              </section>

              <article className="car-detail-contact-card car-detail-contact-card--full">
                <div className="car-detail-contact-card__text">
                  <h2>Te interesa este coche?</h2>
                  <p>Contactanos y te asesoramos sin compromiso.</p>
                </div>
                <Link to="/contacto" className="car-detail-contact-card__btn">
                  Contactar ahora
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14" />
                    <path d="M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </article>
              <section className="car-detail-bottom">
                <article className="car-detail-notes">
                  <h2>Descripcion del vehiculo</h2>
                  <p>
                    {car.description ||
                      `${car.brand} ${car.model} combina eficiencia, tecnologia y confort para el dia a dia.`}
                  </p>
                </article>

                <article className="car-detail-tech-card">
                  <h2>Contactar por este coche</h2>
                  <p className="car-detail-tech-card__hint">
                    Te responderemos con disponibilidad, condiciones y opciones de financiacion.
                  </p>

                  <div className="car-detail-tech-card__car">
                    <strong>{car.brand} {car.model}</strong>
                    <span>{car.year ? `${car.year} · ` : ""}{formatKm(car.km)}</span>
                  </div>

                  <form className="car-detail-contact-form" onSubmit={handleContactSubmit}>
                    <div className="car-detail-contact-form__grid">
                      <label>
                        Nombre y apellidos
                        <input
                          type="text"
                          value={contactForm.name}
                          onChange={(event) => updateContactField("name", event.target.value)}
                          required
                        />
                      </label>
                      <label>
                        Telefono
                        <input
                          type="tel"
                          value={contactForm.phone}
                          onChange={(event) => updateContactField("phone", event.target.value)}
                          required
                        />
                      </label>
                      <label className="car-detail-contact-form__full">
                        Email
                        <input
                          type="email"
                          value={contactForm.email}
                          onChange={(event) => updateContactField("email", event.target.value)}
                          required
                        />
                      </label>
                    </div>
                    <label className="car-detail-contact-form__full">
                      Mensaje
                      <textarea
                        rows="5"
                        value={contactForm.message}
                        onChange={(event) => updateContactField("message", event.target.value)}
                        placeholder={`Hola, me interesa el ${car.brand} ${car.model}.`}
                        required
                      />
                    </label>
                    {contactFeedback && <p className="car-detail-contact-form__feedback">{contactFeedback}</p>}
                    <button className="car-detail-contact-form__submit" type="submit" disabled={contactSending}>
                      {contactSending ? "Enviando..." : "Enviar consulta"}
                    </button>
                  </form>
                </article>
              </section>
            </>
          )}
        </section>
      </main>
    </>
  );
}
