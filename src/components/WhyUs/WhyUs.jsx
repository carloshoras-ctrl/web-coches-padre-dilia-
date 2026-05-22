import "./WhyUs.css";

const testimonials = [
  {
    name: "Carlos M.",
    initials: "CM",
    rating: 5,
    quote:
      "Excelente experiencia de principio a fin. El coche que compre esta impecable y el trato fue cercano y profesional en todo momento.",
  },
  {
    name: "Laura G.",
    initials: "LG",
    rating: 5,
    quote:
      "Me ayudaron a encontrar justo lo que buscaba. Financiacion rapida y transparente. Muy contenta con mi nuevo coche y con el servicio recibido.",
  },
  {
    name: "Carlos M.",
    initials: "CM",
    rating: 5,
    quote:
      "Excelente experiencia de principio a fin. El coche que compre esta impecable y el trato fue cercano y profesional en todo momento.",
  },
  {
    name: "Laura G.",
    initials: "LG",
    rating: 5,
    quote:
      "Me ayudaron a encontrar justo lo que buscaba. Financiacion rapida y transparente. Muy contenta con mi nuevo coche y con el servicio recibido.",
  },
  {
    name: "Javier R.",
    initials: "JR",
    rating: 5,
    quote:
      "Tienen coches de calidad y a buen precio. Se nota que revisan todos los detalles. Volveria a comprar aqui sin pensarlo.",
  },
  {
    name: "Marta L.",
    initials: "ML",
    rating: 5,
    quote:
      "Trato cercano y muy profesional. Resolvieron todas mis dudas y el proceso fue muy sencillo. Totalmente recomendable.",
  },
];

const stats = [
  { value: "4.9/5", label: "Valoracion media", icon: "users" },
  { value: "98%", label: "Recomendaria AutoSelect", icon: "thumb" },
  { value: "<24h", label: "Respuesta media", icon: "chat" },
];

function StarRating({ rating = 5 }) {
  return (
    <span className="stars" aria-label={`Valoracion ${rating} sobre 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? "#F47D20" : "none"}
          stroke="#F47D20"
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

function StatIcon({ type }) {
  if (type === "thumb") {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 9V5a3 3 0 0 0-3-3l-1 7" />
        <path d="M7 21h10a2 2 0 0 0 2-1.7l1-7A2 2 0 0 0 18 10h-7" />
        <path d="M4 10h3v11H4z" />
      </svg>
    );
  }

  if (type === "chat") {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 12a8.5 8.5 0 0 1-8.5 8.5H6l-3 3v-6.5A8.5 8.5 0 1 1 21 12Z" />
        <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default function WhyUs() {
  return (
    <section className="whyus" id="nosotros">
      <div className="whyus__overlay" />

      <div className="container whyus__inner">
        <header className="whyus__header">
          <h2 className="whyus__title">
            LO QUE DICEN <span className="whyus__accent">NUESTROS CLIENTES</span>
          </h2>
          <p className="whyus__subtitle">Experiencias reales de personas que ya encontraron su coche ideal.</p>
        </header>

        <div className="whyus__layout">
          <div className="whyus__cards">
            {testimonials.map((review) => (
              <article key={review.name} className="whyus__card">
                <div className="whyus__card-top">
                  <div className="whyus__person">
                    <div className="whyus__avatar" aria-hidden>{review.initials}</div>
                    <div>
                      <h3 className="whyus__name">{review.name}</h3>
                      <StarRating rating={review.rating} />
                    </div>
                  </div>

                  <span className="whyus__check" aria-hidden>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
                      <path d="m20 6-11 11-5-5" />
                    </svg>
                  </span>
                </div>

                <p className="whyus__quote">{review.quote}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="whyus__summary">
          <span className="whyus__summary-label">Valoracion media</span>
          <StarRating rating={5} />
          <span className="whyus__summary-value">4.9/5</span>
        </div>
      </div>
    </section>
  );
}
