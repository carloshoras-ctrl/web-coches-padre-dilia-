// Opciones de formularios y catálogos relacionadas con coches

export const FUEL_OPTIONS = ["Gasolina", "Diesel", "Hibrido", "Electrico"];

export const TRANSMISSION_OPTIONS = [
    { value: "manual", label: "Manual" },
    { value: "automatico", label: "Automatico" },
];

export const ENVIRONMENTAL_BADGE_OPTIONS = [
    { value: "zero", label: "0 Emisiones" },
    { value: "eco", label: "ECO" },
    { value: "c", label: "C" },
    { value: "b", label: "B" },
    { value: "none", label: "Sin Etiqueta" },
];

// Si en el select trabajas con label visible y necesitas convertir a codigo:
export const ENVIRONMENTAL_BADGE_LABEL_TO_CODE = {
    "0 Emisiones": "zero",
    ECO: "eco",
    C: "c",
    B: "b",
    "Sin Etiqueta": "none",
};

// Y al revés, por si necesitas mostrar desde lo que viene del backend:
export const ENVIRONMENTAL_BADGE_CODE_TO_LABEL = {
    zero: "0 Emisiones",
    eco: "ECO",
    c: "C",
    b: "B",
    none: "Sin Etiqueta",
};