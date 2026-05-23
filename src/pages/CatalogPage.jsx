import Navbar from "../components/Navbar/Navbar";
import FeaturedCars from "../components/FeaturedCars/FeaturedCars";
import Footer from "../components/Footer/Footer";

export default function CatalogPage() {
  return (
    <>
      <Navbar />
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
      <Footer />
    </>
  );
}
