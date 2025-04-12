import { ProgressBarProps } from "@/interfaces/interface";

const ProgressBar = ({ timeLeft, currentSession }: ProgressBarProps) => {
  if (!currentSession || !currentSession.duration) return null;

  const progressPercentage = ((100 - (timeLeft / (currentSession.duration * 60)) * 100)).toFixed(2);

  return (
    <div>
        <div className="absolute bottom-0 left-0 w-full z-10 ">
          <div className="pb-10 pt-2 bg-gray-950 bg-opacity-90 text-sm text-gray-200">
            <div className="flex justify-between">
              <div className="ml-4 font-semibold lg:text-lg">Study Progress</div>
            </div>
            <div className="mx-4 mb-1 mt-3 h-2 bg-gray-700 rounded">
              <div
                className="h-full bg-accent rounded transition-all"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default ProgressBar;
