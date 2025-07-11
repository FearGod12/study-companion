import { Quote } from "@/interfaces";
import { useState, useEffect } from "react";

const useQuotes = (initialQuotes: Quote[], intervalTime = 30000) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex(
        (prevIndex) => (prevIndex + 1) % initialQuotes.length
      );
    }, intervalTime);

    return () => clearInterval(interval);
  }, [initialQuotes, intervalTime]);

  const currentQuote = initialQuotes[currentQuoteIndex];

  return { currentQuote };
};

export default useQuotes;
