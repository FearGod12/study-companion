import { useRef } from "react";
import { carouselImages } from "../services/carouselData";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "red" }}
      onClick={onClick}
    />
  );
}

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "green" }}
      onClick={onClick}
    />
  );
}


const Carousel = () => {
     let sliderRef = useRef(null);
     const next = () => {
         sliderRef.slickNext();
     };
     const previous = () => {
         sliderRef.slickPrev();
     };
    const settings = {
        dots: true,
        infinite:false,
        speed: 500,
        lazyLoad: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 2000,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: false,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <div className="w-3/4 m-auto">
            <Slider
                ref={(slider) => {
                    sliderRef = slider;
                }}
                {...settings}
            >
                {carouselImages.cards.map((card, index) => (
                    <div key={index} className="h-[26rem]">
                        <div className="flex flex-col items-center shadow-md">
                            <img
                                src={card.src}
                                alt={`Slide ${index + 1}`}
                                className="rounded-t-xl w-full h-72 object-cover"
                            />
                            <p className="font-ink-free text-center px-1 py-2 md:h-[8rem] lg:h-[6rem]">
                                {card.text}
                            </p>
                        </div>
                    </div>
                ))}
            </Slider>
            <div className="text-center m-9 space-x-4">
                <button className="px-8 py-2 rounded-3xl bg-purple-500" onClick={previous}>
                    Previous
                </button>
                <button className="px-10 py-2 rounded-3xl bg-purple-500" onClick={next}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Carousel;
