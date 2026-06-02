// import "./EnvironmentalBadge.css";
import badgezero from "../../../assets/etiquetas_medioambientales/etiqueta-zero.png";
import badgeeco from "../../../assets/etiquetas_medioambientales/etiqueta-eco.png";
import badgec from "../../../assets/etiquetas_medioambientales/etiqueta-c.png";
import badgeb from "../../../assets/etiquetas_medioambientales/etiqueta-b.png";
import "./styles.css"

export const ENVIRONMENTAL_BADGE_CONFIG = {
    zero: {
        label: "Etiqueta 0 emisiones",
        image: badgezero,
    },
    eco: {
        label: "Etiqueta ECO",
        image: badgeeco,
    },
    c: {
        label: "Etiqueta C",
        image: badgec,
    },
    b: {
        label: "Etiqueta B",
        image: badgeb,
    },
    none: {
        label: "Sin etiqueta medioambiental",
        image: null,
    },
};

export default function EnvironmentalBadge({
    environmentalBadge,
}) {

    const badge = ENVIRONMENTAL_BADGE_CONFIG[environmentalBadge];

    if (!badge?.image) {
        return null;
    }

    return (
        <div className={`car-card__environmental_badge car-card__badge--${environmentalBadge}`}>
            <img
                src={badge?.image}
                alt={badge?.label}
                loading="lazy"
                decoding="async"
            />
        </div>
    );
}