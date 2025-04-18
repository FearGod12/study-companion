import { useState, useEffect, useCallback } from "react";
import { carouselImages } from "@/data/carousel";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import Button from "./Button";
import Link from "next/link";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

const Carousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // Scroll buttons
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Scroll to selected dot
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  // Listen for slide changes
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Initialize scroll snaps
  useEffect(() => {
    if (!emblaApi) return;
    onSelect(); // set current index
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="w-full lg:max-w-4xl md:max-w-md max-w-sm mx-auto">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {carouselImages.cards.map((card, i) => (
            <div
              key={i}
              className="embla__slide lg:flex-[0_0_33.3333%] md:flex-[0_0_80%] flex-[0_0_100%] px-4"
            >
              <div className="flex flex-col items-center bg-gray-50 rounded-lg h-full border border-accent shadow shadow- md:mx-0 lg:mx-0 mx-8">
                <Image
                  src={card.src}
                  alt={`Slide ${i + 1}`}
                  className="rounded-t-xl object-cover w-full"
                  width={300}
                  height={200}
                />
                <p className="text-center px-4 py-4">{card.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-6 gap-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-3 h-1 rounded-full transition-colors ${
              index === selectedIndex
                ? "bg-accent"
                : "bg-gray-100"
            }`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="text-center flex justify-center gap-4 mt-6">
        <button
          onClick={scrollPrev}
          className="px-6 py-1 text-gray-50 font-bold hover:bg-gray-50 bg-accent hover:text-accent rounded-lg"
        >
          <FaArrowLeftLong/>
        </button>
        <button
          onClick={scrollNext}
          className="px-6 py-1 text-gray-50 font-bold hover:bg-gray-50 bg-accent hover:text-accent rounded-lg"
        >
          <FaArrowRightLong/>
        </button>
      </div>
      <div className="flex justify-center mt-10 ">
        <Link href="/memberRegistration">
          <Button
            text="Join the Study Club"
            className="px-4 py-2 bg-gray-100 text-accent hover:bg-accent hover:text-gray-100 rounded-lg border border-accent"
          />
        </Link>
      </div>
    </div>
  );
};

export default Carousel;
