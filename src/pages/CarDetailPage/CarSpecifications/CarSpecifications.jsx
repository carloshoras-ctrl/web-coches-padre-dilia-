import { CalendarFold, Gauge, Fuel, Cog, Zap, Leaf, Car, Palette, Cylinder, SlidersVertical, Armchair, DoorClosed, BookOpenText, Droplets } from "lucide-react";
import './styles.css'
import { ENVIRONMENTAL_BADGE_CODE_TO_LABEL } from "../../../constants/formOptions";

export default function CarSpecifications({ selectedCar }) {
    console.log({ selectedCar })

    const carSpecifications = [
        { key: "year", label: "Año", value: selectedCar?.year || "-", icon: CalendarFold },
        { key: "km", label: "Kilometros", value: Number(selectedCar?.km || 0).toLocaleString("es-ES") || "-", icon: Gauge },
        { key: "fuel", label: "Combustible", value: selectedCar?.fuel || "-", icon: Fuel },
        { key: "transmission", label: "Cambio", value: selectedCar?.transmission || "-", icon: Cog },
        { key: "power", label: "Potencia (CV)", value: selectedCar?.power || "-", icon: Zap },
        { key: "environmentalBadge", label: "Etiqueta Medioambiental", value: ENVIRONMENTAL_BADGE_CODE_TO_LABEL[selectedCar?.environmentalBadge] || "-", icon: Leaf },
        { key: "body", label: "Carrocería", value: selectedCar?.body || "-", icon: Car },
        { key: "color", label: "Color", value: selectedCar?.color || "-", icon: Palette },
        { key: "engineSize", label: "Cilindrada", value: `${selectedCar?.engineSize} (${selectedCar?.numCilinders} cilinders)` || "-", icon: Cylinder },
        { key: "gears", label: "Marchas", value: selectedCar?.gears || "-", icon: SlidersVertical },
        { key: "seats", label: "Plazas", value: selectedCar?.seats || "-", icon: Armchair },
        { key: "doors", label: "Puertas", value: selectedCar?.doors || "-", icon: DoorClosed },
        { key: "euroStandard", label: "Normativa Emisiones", value: selectedCar?.euroStandard || "-", icon: BookOpenText },
        { key: "consumption", label: "Consumo (L / 100km)", value: selectedCar?.consumption || "-", icon: Droplets },
    ];



    return (
        <>
            <section className="car-detail-specs">
                {carSpecifications.map(({ key, label, value, icon: Icon }) => (
                    <article key={key} className="car-detail-spec">
                        <span className="car-detail-spec__icon">
                            <Icon />
                        </span>
                        <div>
                            <p>{label}</p>
                            <strong >{value}</strong>
                        </div>
                    </article>
                ))}
            </section>
        </>
    );
}
