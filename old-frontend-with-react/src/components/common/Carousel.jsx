import { useRef } from "react";
import { carouselImages } from "../../services/carouselData";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
import PropTypes from "prop-types";


const NextArrow = (props) => {
  const { className = "", style = {}, onClick = () => {} } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
};

NextArrow.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
};

const PrevArrow = (props) => {
  const { className = "", style = {}, onClick = () => {}} = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
};

PrevArrow.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
};

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
    infinite: true,
    speed: 500,
    lazyLoad: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
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
          infinite: true,
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
          <div key={index}>
            <div className="flex flex-col items-center shadow-md shadow-white bg-gray-50 rounded-lg h-full">
              <img
                src={card.src}
                alt={`Slide ${index + 1}`}
                className="rounded-t-xl w-full object-cover"
              />
              <p className="font-ink-free h-24 flex justify-center items-center px-4">
                {card.text}
              </p>
            </div>
          </div>
        ))}
      </Slider>
      <div className="text-center flex justify-center gap-4 mt-10">
        <button
          className="px-4 py-2 text-secondary font-bold hover:bg-secondary bg-white hover:text-white hover:border-white hover:border rounded-lg"
          onClick={previous}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 text-secondary font-bold hover:bg-secondary bg-white hover:text-white hover:border-white hover:border rounded-lg"
          onClick={next}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Carousel;
