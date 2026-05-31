import Hero from "../../components/Hero/Hero";
import Features from "../../components/Features/Features";
import FeaturedCars from "../../components/FeaturedCars/FeaturedCars";
import WhyUs from "../../components/WhyUs/WhyUs";
import SellCar from "../../components/SellCar/SellCar";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCars />
      <Features />
      <WhyUs />
      <SellCar />
    </>
  );
}
