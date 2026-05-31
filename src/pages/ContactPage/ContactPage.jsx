import { useState } from "react";
import "./ContactPage.css";

const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  carInterest: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState("");

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback("");
    setIsSending(true);

    await new Promise((resolve) => setTimeout(resolve, 700));

    setFeedback("Mensaje enviado. Te contactaremos en menos de 24 horas laborables.");
    setForm(EMPTY_FORM);
    setIsSending(false);
  }

  return (
    <>
      <main className="contact-page">
        <section className="contact-page__hero">
          <p className="section-tag">Atencion Personalizada</p>
          <h1>
            CONTACTA CON <span>EL PROPIETARIO</span>
          </h1>
          <p>
            Dinos que coche te interesa y te responderemos con disponibilidad, condiciones y
            opciones de financiacion.
          </p>
        </section>

        <section className="contact-page__content">
          <article className="contact-card contact-card--info">
            <h2>Datos de contacto</h2>
            <p>AutoSelect - Venta de coches de segunda mano revisados.</p>

            <ul className="contact-list">
              <li>
                <strong>Propietario</strong>
                <span>Daniel Lopez</span>
              </li>
              <li>
                <strong>Telefono</strong>
                <a href="tel:600123456">600 123 456</a>
              </li>
              <li>
                <strong>Email</strong>
                <a href="mailto:info@autoselect.es">info@autoselect.es</a>
              </li>
              <li>
                <strong>Horario</strong>
                <span>Lunes a Viernes, 9:00 - 18:00</span>
              </li>
            </ul>
          </article>

          <article className="contact-card contact-card--form">
            <h2>Formulario de contacto</h2>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form__grid">
                <label>
                  Nombre y apellidos
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    required
                  />
                </label>

                <label>
                  Telefono
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    required
                  />
                </label>

                <label>
                  Email
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    required
                  />
                </label>

                <label>
                  Coche de interes
                  <input
                    type="text"
                    value={form.carInterest}
                    onChange={(event) => updateField("carInterest", event.target.value)}
                    placeholder="Ej: BMW Serie 1"
                  />
                </label>
              </div>

              <label>
                Mensaje
                <textarea
                  rows="5"
                  value={form.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  placeholder="Cuentanos que necesitas..."
                  required
                />
              </label>

              {feedback && <p className="contact-form__feedback">{feedback}</p>}

              <button className="contact-form__submit" type="submit" disabled={isSending}>
                {isSending ? "Enviando..." : "Enviar consulta"}
              </button>
            </form>
          </article>
        </section>
      </main>
    </>
  );
}
