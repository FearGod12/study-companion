import useQuotes from "../../hooks/useQuotes";
import { formatTime } from "../../utils/timeFormatters";
import PropTypes from "prop-types";

const quotes = [
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
];

const BackgroundSection = ({ bgImage, timeLeft }) => {
  const { currentQuote } = useQuotes(quotes);

  return (
    <section
      className="relative flex h-screen bg-cover bg-center bg-black"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-75"></div>
      <div className="py-6 w-screen flex flex-col justify-around z-10">
        <div className="ml-4 px-4 py-1 rounded-lg opacity-50 outline outline-white lg:w-46 md:w-52 w-44 bg-gray-950">
          <p className="lg:text-1xl font-mono text-gray-100">
            Personal Timer -{" "}
            <span>{formatTime(timeLeft || 0)}</span>
          </p>
        </div>
        <div className="text-gray-100 h-52 flex flex-col items-center gap-3">
          <p className="lg:text-2xl text-lg mb-2 font-ink-free lg:w-3/5 text-center px-6">
            “{currentQuote.text}”
          </p>
          <p className="lg:text-2xl mb-6 italic">— {currentQuote.author}</p>
        </div>
      </div>
    </section>
  );
};

BackgroundSection.propTypes = {
  bgImage: PropTypes.string.isRequired,
  timeLeft: PropTypes.number.isRequired,
};

export default BackgroundSection;
