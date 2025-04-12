import { quotes } from "@/data/quotes";
import useQuotes from "@/hooks/useQuotes";
import { BackgroundSectionProps } from "@/interfaces/interface";

const BackgroundSection = ({ bgImage, timeLeft }: BackgroundSectionProps) => {
  const { currentQuote } = useQuotes(quotes);

  const formatTimeLeft = (timeLeft: number) => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <section
      className="relative flex h-screen bg-cover bg-center bg-black"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-90"></div>
      <div className="py-6 w-screen flex flex-col justify-around z-10">
        <div className="ml-4 px-4 py-2 rounded-lg opacity-50 outline outline-white lg:w-46 md:w-52 w-44 bg-gray-950">
          <p className="lg:text-1xl  md:text-base text-base text-gray-100">
            Personal Timer - <span>{formatTimeLeft(timeLeft || 0)}</span>
          </p>
        </div>
        <div className="text-gray-100 min-h-screen flex flex-col items-center gap-3 mt-10 py-4">
          <p className="lg:text-2xl text-lg mb-2 lg:max-w-lg md:max-w-md text-center px-2">
            “{currentQuote.text}”
          </p>
          <p className="lg:text-2xl mb-6 italic">— {currentQuote.author}</p>
        </div>
      </div>
    </section>
  );
};

export default BackgroundSection;
