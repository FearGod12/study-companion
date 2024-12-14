import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
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

    // State for Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const tasksPerPage = 2;

    // Pagination logic: slicing the schedules to only show 3 at a time
    const currentSchedules = schedules.slice(
        currentPage * tasksPerPage,
        (currentPage + 1) * tasksPerPage
    );

    const goToNextPage = () => {
        if ((currentPage + 1) * tasksPerPage < schedules.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

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
                        <p className="text-center">No tasks found.</p>
                    )}

                    {/* Pagination Controls */}
                    <div className="flex justify-between mt-4">
                        <button
                            onClick={goToPreviousPage}
                            disabled={currentPage === 0}
                            className="px-2 py-2 bg-secondary text-white rounded disabled:opacity-50"
                        >
                           <FaArrowLeft/>
                        </button>
                        <button
                            onClick={goToNextPage}
                            disabled={(currentPage + 1) * tasksPerPage >= schedules.length}
                            className="px-2 py-2 bg-secondary text-white rounded disabled:opacity-50"
                        >
                           <FaArrowRight/>
                        </button>
                    </div>
            </div>
       
    );
};

export default TaskList;
