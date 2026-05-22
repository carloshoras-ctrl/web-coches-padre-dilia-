import Navbar from "../components/Navbar/Navbar";
import FeaturedCars from "../components/FeaturedCars/FeaturedCars";
import Footer from "../components/Footer/Footer";

export default function CatalogPage() {
  console.log('catalogo')
  return (
    <>
      <Navbar />
      <FeaturedCars
        sectionId="catalogo"
        showHeaderLink={false}
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
