export function SpecIcon({ kind }) {
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

export function InfoIcon({ kind }) {
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

export function FeatureIcon({ kind }) {
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

