import { quotes } from "@/data/quotes";
import useQuotes from "@/hooks/useQuotes";
import { BackgroundSectionProps } from "@/interfaces";
import { formatTimeLeft } from "@/utils/studyFormatting";

const BackgroundSection = ({ bgImage, timeLeft }: BackgroundSectionProps) => {
  const { currentQuote } = useQuotes(quotes);

  return (
    <section
      className="relative flex bg-cover bg-center bg-black h-screen overflow-hidden"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-85"></div>
      <div className="py-6 w-screen flex flex-col justify-center my-auto z-10 gap-20">
        <div className="ml-4 px-4 py-2 rounded-lg opacity-50 outline outline-gray-100 lg:w-46 md:w-52 w-44 bg-gray-950 mt-10">
          <p className="lg:text-1xl md:text-base text-base text-gray-100 text-center">
            Personal Timer - <span>{formatTimeLeft(timeLeft || 0)}</span>
          </p>
        </div>
        <div className="text-gray-100 min-h-screen flex flex-col items-center gap-3 mt-10 py-4 px-4">
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
