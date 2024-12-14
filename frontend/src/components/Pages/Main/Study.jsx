import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import study from "../../../assets/Image/bg-2.jpg";
import { FaImage, FaMusic, FaChevronDown } from "react-icons/fa";
import { FaEllipsisVertical } from "react-icons/fa6";

const Study = () => {
  const location = useLocation();
  const [sessionData] = useState(location.state);
  const [bgImage, setBgImage] = useState(study);
  const [showMenu, setShowMenu] = useState(false);
  const [showProgress, setShowProgress] = useState(true);

  // Extract session details
  const { status, startTime,  duration } = sessionData?.data?.data || {};
  console.log('start session', sessionData)

  const [timeLeft, setTimeLeft] = useState(() => {
    if (startTime && duration) {
      const durationInSeconds = duration * 60;
      const elapsed = (Date.now() - new Date(startTime).getTime()) / 1000;
      return Math.max(durationInSeconds - elapsed, 0);
    }
    return 0;
  });

  useEffect(() => {
    if (sessionData) {
      console.log("Session data in Study component:", sessionData);
    } else {
      console.error("No session data available.");
      console.log('start session', sessionData)
    }
  }, [sessionData]);


  // Update time left every second
  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => Math.max(prev - 1, 0));
      }, 1000);

      return () => clearInterval(interval); 
    }
  }, [timeLeft]);

  // Format time in MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Change Background
  const changeBackground = () => {
    setBgImage(study); // Set the background image
  };

  if (!sessionData) return <p>Loading session details...</p>;

  return (
    <div className="container max-w-none flex flex-col items-end h-screen w-screen font-inria-sans">
      <header className="relative bg-gray-950 lg:h-20 flex justify-between items-center w-full">
        {/* Display Session Details */}
        <div className="p-4 text-gray-100">
          <h3 className="lg:text-xl font-semibold md:text-base text-sm text-gray-100">
            Your Current Study Session
          </h3>
          <div className="text-white font-bold text-sm lg:text-base">
            <p className="text-sm">Status: {status || "Unknown"}</p>
            <p className="text-sm">Time Left: {formatTime(timeLeft)}</p>
          </div>
        </div>

        <div className="flex pr-4 lg:gap-8 gap-2 items-center relative z-20">
          {/* Dropdown Menu */}
          <div className="relative">
            <FaEllipsisVertical
              size={25}
              className="text-white cursor-pointer"
              onClick={() => setShowMenu((prev) => !prev)}
            />
            {showMenu && (
              <div className="absolute right-0 mt-2 bg-white bg-opacity-90 rounded-lg p-4 shadow-lg z-50">
                <div className="flex flex-col space-y-4 text-gray-800">
                  <div
                    className="flex items-center gap-4 border-b-2 pb-2 border-gray-300 cursor-pointer"
                    onClick={changeBackground}
                  >
                    <FaImage size={20} />
                    <span>Change Background</span>
                  </div>
                  <div className="flex items-center gap-4 border-b-2 pb-2 border-gray-300 cursor-pointer">
                    <FaMusic size={20} />
                    <span>Play Music</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <section
        className="relative bg-black flex h-screen"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-75"></div>
        <div className="py-6 w-screen flex flex-col justify-around z-10">
          {/* Timer */}
          <div className="ml-4 px-4 py-1 rounded-lg opacity-50 outline outline-white lg:w-46 md:w-52 w-44 bg-gray-950">
            <p className="lg:text-1xl font-mono text-gray-100">
             Personal Timer - <span> {duration ? `${duration} minutes` : "N/A"}</span>
            </p>
          </div>
          <div className=" text-gray-100 h-52 flex flex-col items-center gap-3">
            <p className="lg:text-2xl text-lg mb-2 font-ink-free lg:w-3/5 text-center">
              “It is during our darkest moments that we must focus to see the
              light.”
            </p>
            <p className="lg:text-2xl mb-6">Aristotle</p>
          </div>
        </div>
      </section>

      {/* Progress Bar Section */}
      {showProgress ? (
        <div className="absolute bottom-0 left-0 w-full z-10">
          <div className="p-4 bg-gray-950 bg-opacity-90 text-sm text-gray-200">
            <div className="flex justify-between">
              <div className="ml-4 font-semibold lg:text-lg">Study Progress</div>
              <div
                className="mr-4 cursor-pointer"
                onClick={() => setShowProgress(false)}
              >
                <FaChevronDown size={15} />
              </div>
            </div>
            <div className="mx-4 mb-1 mt-3 h-2 bg-gray-700 rounded">
              <div
                className="h-full bg-gray-100 rounded transition-all"
                style={{
                  width: `${timeLeft ? (timeLeft / (duration * 60)) * 100 : 0}%`,
                }}                
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowProgress(true)}
          className="absolute bottom-4 left-40 transform -translate-x-1/2 px-4 py-2 bg-black text-white rounded-lg z-10"
        >
          Show Progress
        </button>
      )}
    </div>
  );
};

export default Study;
