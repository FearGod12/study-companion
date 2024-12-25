import { useState } from "react";
import useSchedules from "../../hooks/useSchedule";

const TaskList = () => {
    const {
        schedules,
        loading,
        formatTitle,
        formatDate,
        formatTime,
    } = useSchedules();

    const [currentPage] = useState(0);
    const tasksPerPage = 3;

    const currentSchedules = schedules.slice(
        currentPage * tasksPerPage,
        (currentPage + 1) * tasksPerPage
    );

    return (
      
            <div className="w-full px-2">
                    {loading ? (
                        <p className="text-center">Loading...</p>
                    ) : currentSchedules.length > 0 ? (
                        <ul className="space-y-4 overflow-auto">
                            {currentSchedules.map((schedule) => (
                                <li
                                    key={schedule._id}
                                    className="flex justify-between items-center p-4 rounded-lg bg-secondary text-gray-100 dark:text-gray-300 "
                                >
                                    <div>
                                    <h3 className="text-lg font-semibold">{formatTitle(schedule.title)}</h3>
                                        <p className="text-sm">
                                            {formatDate(schedule.startDate)} - {formatTime(schedule.startTime)} </p>
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
