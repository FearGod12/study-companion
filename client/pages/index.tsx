import Carousel from "@/components/common/Carousel";
import Hero from "@/components/landing/Hero";
import Footer from "@/components/layout/landing/Footer";
import Header from "@/components/layout/landing/Header";
import Image from "next/image";

export default function Home() {
  return (
    <section className="container max-w-none overflow-x-hidden w-screen flex flex-col">
      {/* Header */}
      <div className="z-10">
        <Header />
      </div>

      {/* Hero and Image Section  */}
      <section
        id="home"
        className="flex items-center justify-center h-screen bg-cover bg-center relative"
      >
        <div className="flex flex-col md:flex-row items-center justify-between w-3/4 max-w-6xl mx-auto space-y-6 md:space-y-0 md:space-x-8">
          {/* Hero Component */}
          <div className="flex-1">
            <Hero />
          </div>

          {/* Background Image */}
          <div className="flex-1 lg:flex md:flex hidden justify-center">
            <Image
              src="/image/hero-img.png"
              alt="background image"
              className="w-full lg:max-w-lg md:max-w-md h-auto object-cover rounded-lg "
              loading="lazy"
              width={400}
              height={400}
            />
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section
        id="feature"
        className="flex items-center justify-center h-screen bg-gradient-to-r from-accent to-pink-600"
      >
        <Carousel />
      </section>
      <Footer />
    </section>
  );
}
