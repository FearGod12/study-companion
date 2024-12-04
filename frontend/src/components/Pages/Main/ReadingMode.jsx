import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import readingMode from "../../../assets/Image/bg-2.jpg";
import { FaImage, FaMusic, FaChevronDown } from "react-icons/fa";
import { FaArrowRightFromBracket, FaEllipsis } from "react-icons/fa6";

const ReadingMode = () => {
    const { state } = useLocation();
    const { duration } = state || { duration: 30 }; // Default to 30 mins if undefined
    const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert duration to seconds
    const [showMenu, setShowMenu] = useState(false); // Toggle menu visibility
    const [showProgress, setShowProgress] = useState(true); // Toggle progress bar visibility
    const [bgImage, setBgImage] = useState(readingMode); // Background image state

    // Update the countdown timer
    useEffect(() => {
        const countdown = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(countdown);
                    alert("Time's up! Great job!");
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(countdown); // Cleanup on unmount
    }, [duration]);

    const formatTime = (time) => {
        const hours = Math.floor(time / 3600); // Get hours
        const minutes = Math.floor((time % 3600) / 60); // Get minutes
        const seconds = time % 60; // Get seconds
        return `${hours > 0 ? hours + "h " : ""}${minutes}:${
            seconds < 10 ? "0" : ""
        }${seconds}`;
    };

    // Calculate the progress percentage
    const progressPercentage =
        ((duration * 60 - timeLeft) / (duration * 60)) * 100;

    // Handle changing background image (dummy implementation for now)
    const changeBackground = () => {
        const newBackground = readingMode; // You can replace this with logic to pick new backgrounds.
        setBgImage(newBackground);
    };

    return (
        <div className="flex items-end h-screen w-screen">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={bgImage}
                    alt="Reading Mode Background"
                    className="h-screen w-screen object-cover"
                    loading="lazy"
                />
            </div>
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-75"></div>

            {/* Dropdown Menu */}
            <div className="absolute top-4 right-4 z-20">
                <FaEllipsis
                    size={30}
                    className="text-white cursor-pointer"
                    onClick={() => setShowMenu((prev) => !prev)} // Toggle menu visibility
                />
                {showMenu && (
                    <div className="absolute right-0 mt-2 bg-white bg-opacity-90 rounded-lg p-4 shadow-lg">
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

            {/* Quote and Timer */}
            <div className="relative text-center text-white p-6 z-10 flex flex-col h-screen items-center justify-center w-screen">
                <p className="text-2xl mb-2 font-ink-free w-3/5">
                    “It is during our darkest moments that we must focus to see
                    the light.”
                </p>
                <p className="text-2xl mb-6">Aristotle</p>
            </div>

            {/* Personal Timer */}
            <div className="absolute top-20 left-20 bg-black px-4 py-1 rounded-lg opacity-50 outline outline-white">
                <p className="text-2xl font-mono text-gray-100">
                    Personal Timer -{" "}
                    <span className="">{formatTime(timeLeft)}</span>
                </p>
            </div>

            {/* Exit */}
            <div className="absolute bottom-40 bg-black px-4 py-2 rounded-lg opacity-50 outline outline-white right-10">
                <Link to="/dashboard">
                    <FaArrowRightFromBracket size={25} color="white" />
                </Link>
            </div>

            {/* Progress Bar Section */}
            {showProgress ? (
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gray-800 bg-opacity-90 text-sm text-gray-200">
                    <div className="flex justify-between">
                        {/* Study Progress Label */}
                        <div className="ml-4 font-semibold text-lg">
                            Study Progress
                        </div>

                        {/* Hide Progress Icon */}
                        <div
                            className="mr-4 cursor-pointer"
                            onClick={() => setShowProgress(false)} // Toggle showProgress to false
                        >
                            <FaChevronDown size={20} />
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mx-4 mb-1 mt-3 h-2 bg-gray-700 rounded">
                        <div
                            className="h-full bg-gray-100 rounded transition-all"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <div className="flex mt-4 justify-between px-4 font-bold text-lg">
                        {/* Time spent on bottom left */}
                        <div className="">
                            {formatTime(duration * 60 - timeLeft)}
                        </div>
                        {/* Time left on bottom right */}
                        <div className="">{formatTime(timeLeft)}</div>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setShowProgress(true)} // Toggle showProgress to true
                    className="absolute bottom-4 left-40 transform -translate-x-1/2 px-4 py-2 bg-black text-white rounded-lg"
                >
                    Show Progress
                </button>
            )}
        </div>
    );
};

export default ReadingMode;
