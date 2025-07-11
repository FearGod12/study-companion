import { FaArrowLeftLong, FaEllipsisVertical } from "react-icons/fa6";
import Button from "../common/Button";
import { formatToTime } from "../../utils/timeFormatters";
import PropTypes from 'prop-types';

const Header = ({
  sessionData,
  showMenu,
  setShowMenu,
  changeBackground,
  backgroundOptions,
  handleEndSession,
  loading,
  navigate,
}) => (
  <header className="relative bg-gray-950 flex justify-between items-center w-full px-4 py-2">
    <div className="flex gap-6">
      <button onClick={() => navigate(-1)} className="text-gray-100 pl-4">
        <FaArrowLeftLong />
      </button>
      <div className="p-4 text-gray-100">
        <h3 className="lg:text-xl font-bold md:text-base text-sm text-gray-100">
          Your Current Study Session
        </h3>
        <p className="text-sm">Status: {sessionData.status || "Unknown"}</p>
        <p className="text-sm">
          Start Time: {formatToTime(sessionData.startTime)}
        </p>
        <p className="text-sm">Duration: {sessionData.duration ? `${sessionData.duration} minutes` : "N/A"}</p>
      </div>
    </div>

    <div className="flex pr-4 lg:gap-8 gap-2 items-center relative z-20">
      {loading ? (
        <p>Processing...</p>
      ) : (
        <Button
        onClick={() => handleEndSession(sessionData.scheduleId
          )}
          className="px-4 py-2 rounded-lg text-sm text-gray-100"
          text="End Session"
        />
      )}
      <div className="relative">
        <FaEllipsisVertical
          size={25}
          className="text-white cursor-pointer"
          onClick={() => setShowMenu((prev) => !prev)}
        />
        {showMenu && (
          <div className="absolute right-0 mt-4 bg-gray-100 bg-opacity-90 rounded-lg p-4 w-52 shadow-lg z-50">
            <div className="flex flex-col space-y-4 text-gray-800">
              {backgroundOptions.map((img, index) => (
                <div
                  key={index}
                  onClick={() => changeBackground(img)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <img
                    src={img}
                    alt={`Background ${index}`}
                    className="w-10 h-10 rounded"
                  />
                  <span className="font-bold text-sm">
                    Background {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </header>
);

Header.propTypes = {
  sessionData: PropTypes.shape({
    scheduleId: PropTypes.string.isRequired,
    status: PropTypes.string,
    startTime: PropTypes.string, 
    duration: PropTypes.number, 
  }).isRequired,
  timeLeft: PropTypes.number.isRequired,
  showMenu: PropTypes.bool.isRequired,
  setShowMenu: PropTypes.func.isRequired,
  changeBackground: PropTypes.func.isRequired,
  backgroundOptions: PropTypes.arrayOf(PropTypes.string).isRequired, 
  handleEndSession: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default Header;
