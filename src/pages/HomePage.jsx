import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Features from "../components/Features/Features";
import FeaturedCars from "../components/FeaturedCars/FeaturedCars";
import WhyUs from "../components/WhyUs/WhyUs";
import SellCar from "../components/SellCar/SellCar";
import Footer from "../components/Footer/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedCars />
      <Features />
      <WhyUs />
      <SellCar />
      <Footer />
    </>
  );
}
