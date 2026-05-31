import FeaturedCars from "../components/FeaturedCars/FeaturedCars";

export default function CatalogPage() {
  return (
    <>
      <FeaturedCars
        sectionId="catalogo"
        showHeaderLink={false}
        featuredOnly={false}
        title={
          <>
            NUESTRO <span className="featured__title-accent">CATALOGO</span>
          </>
        }
        subtitle="Todos los coches disponibles en AutoSelect"
      />
    </>
  );
}
