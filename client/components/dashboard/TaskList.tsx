import useSchedules from "@/hooks/useSchedules";
import { useState } from "react";

const TaskList = () => {
  const { schedules, loading, formatTitle, formatDate, formatTime } =
    useSchedules();

  const [currentPage] = useState(0);
  const tasksPerPage = 3;

  const currentSchedules = schedules.slice(
    currentPage * tasksPerPage,
    (currentPage + 1) * tasksPerPage
  );

  return (
    <div className="grid lg:gap-6 gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : currentSchedules.length > 0 ? (
        <ul className="space-y-4 overflow-auto">
          {currentSchedules.map((schedule) => (
            <li
              key={schedule.id}
              className="flex justify-between items-center p-4 rounded-lg bg-accent text-gray-100"
            >
              <div>
                <h3 className="text-lg font-semibold">
                  {formatTitle(schedule.title)}
                </h3>
                <p className="text-sm">
                  {formatDate(schedule.startDate)} -{" "}
                  {formatTime(schedule.startTime)}{" "}
                </p>
                <p>{schedule.duration} minutes</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">No session found.</p>
      )}
    </div>
  );
};

export default TaskList;
