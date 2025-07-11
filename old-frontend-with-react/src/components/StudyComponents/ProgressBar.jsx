import { FaChevronDown } from "react-icons/fa";
import PropTypes from "prop-types"; 
import { FaChevronUp } from "react-icons/fa6";

const ProgressBar = ({ timeLeft, duration, showProgress, setShowProgress }) => {
  const progressPercentage = (100 - (timeLeft / (duration * 60)) * 100).toFixed(
    2
  );

  return (
    <div>
      {showProgress ? (
             <div className="absolute bottom-0 left-0 w-full z-10">
          <div className="p-4 bg-gray-950 bg-opacity-90 text-sm text-gray-200">
            <div className="flex justify-between">
              <div className="ml-4 font-semibold lg:text-lg">
                Study Progress
              </div>
              <div
                className="mr-4 cursor-pointer"
                onClick={() => setShowProgress(false)}
              >
                <FaChevronDown size={15} />
              </div>
            </div>
            <div className="mx-4 mb-1 mt-3 h-2 bg-gray-700 rounded">
              <div
                className="h-full bg-green-500 rounded transition-all"
                style={{
                  width: `${progressPercentage}%`,
                }}
              ></div>
            </div>
          </div>
        </div>   
      ) : (
        <button
        onClick={() => setShowProgress(true)}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black text-white rounded-lg z-50 flex items-center gap-1"
      >
        <FaChevronUp />
        <span className="ml-2 text-sm">Show Progress</span>
      </button>
      
      )}
    </div>
  );
};

ProgressBar.propTypes = {
  timeLeft: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  showProgress: PropTypes.bool.isRequired,
  setShowProgress: PropTypes.func.isRequired,
};

export default ProgressBar;
