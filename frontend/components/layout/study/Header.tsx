import { FaEllipsisVertical } from "react-icons/fa6";
import { formatToTime } from "@/utils/studyFormatting";
import Button from "@/components/common/Button";
import Image from "next/image";
import { HeaderProps } from "@/interfaces";
import { FaTimes } from "react-icons/fa";

const Header = ({
  currentSession,
  showMenu,
  setShowMenu,
  changeBackground,
  backgroundOptions,
  handleEndSession,
  loading,
}: HeaderProps) => {
  return (
    <header className="relative bg-black/95 flex justify-between items-center w-full px-4 py-2">
      <div className="flex gap-14">
        <div className="ml-3 text-gray-100 py-2 lg:text-base md:text-base text-sm">
          <div className="bg-gray-100 text-accent px-3 font-semibold rounded-lg py-2 mt-1">
            <p>Start Time: {formatToTime(currentSession.startTime)}</p>
            <p>
              Duration:{" "}
              {currentSession.duration
                ? `${currentSession.duration} minutes`
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex lg:gap-8 gap-2 items-center relative z-20">
        <Button
          onClick={() => handleEndSession(currentSession.scheduleId)}
          className="lg:px-4 py-2 md:px-4 px-2 rounded-lg text-sm text-gray-100 hover:bg-gray-100 hover:text-accent hover:border border-accent mr-10"
          disabled={loading}
          text={loading ? "Ending..." : "End Session"}
        />
        <div className="relative">
          {!showMenu && (
            <FaEllipsisVertical
              size={20}
              className="text-white cursor-pointer"
              onClick={() => setShowMenu(true)}
            />
          )}
          {showMenu && (
            <FaTimes
              size={20}
              className="text-white cursor-pointer"
              onClick={() => setShowMenu(false)}
            />
          )}
          {showMenu && (
            <div className="absolute right-0 mt-4 bg-gray-100 bg-opacity-90 rounded-lg p-4 w-52 shadow-lg z-50">
              <div className="flex flex-col space-y-4 text-gray-800">
                {backgroundOptions.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => changeBackground(img)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Image
                      src={img}
                      alt={`Image ${index}`}
                      className="w-10 h-10 rounded"
                      width={500}
                      height={500}
                      unoptimized
                    />
                    <span className="font-bold text-sm">Image {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
