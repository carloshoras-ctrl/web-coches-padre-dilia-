import "./Footer.css";

const contactInfo = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: "VISÍTANOS",
    lines: ["C/ Industria, 25", "28001 Madrid"],
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.68 12a19.79 19.79 0 01-3.07-8.67A2 2 0 013.6 1.27h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.91 8.91a16 16 0 006.18 6.18l.91-.91a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
    label: "LLÁMANOS",
    lines: ["600 123 456", "L-V: 9:00 - 18:00"],
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: "ESCRíBENOS",
    lines: ["info@autoselect.es"],
  },
];

const legalLinks = ["Aviso legal", "Política de privacidad", "Cookies"];

export default function Footer() {
  return (
    <footer className="footer" id="contacto">
      {/* Contact bar */}
      <div className="footer__contact">
        <div className=" footer__contact-grid">
          {contactInfo.map((c, i) => (
            <div className="footer__contact-item" key={i}>
              <span className="footer__contact-icon">{c.icon}</span>
              <div>
                <p className="footer__contact-label">{c.label}</p>
                {c.lines.map((line, j) => (
                  <p className="footer__contact-val" key={j}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <p className="footer__copy">Â© 2024 AutoSelect. Todos los derechos reservados.</p>
          <div className="footer__legal">
            {legalLinks.map((l, i) => (
              <a key={i} href="#" className="footer__legal-link">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
