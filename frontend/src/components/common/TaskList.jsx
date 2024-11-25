import { useState } from "react";
import Schedule from "../Pages/Main/Schedule"; // Assuming the path is correct
import { format, isAfter } from "date-fns"; // Ensure these utilities are installed

const TaskList = () => {
    const [upcomingTasks, setUpcomingTasks] = useState([]);
    const [visibleEvents, setVisibleEvents] = useState(3); // Initially show 3 events

    const handleShowMore = () => {
        setVisibleEvents((prev) => prev + 3); // Show 3 more events when clicked
    };

    const handleStartEvent = (index) => {
        console.log(`Starting event at index ${index}`);
        // Add logic for starting the event
    };

    return (
        <div className="container max-w-none flex gap-4 font-inria-sans">
            {/* Schedule Component */}
            <div className="hidden">
                <Schedule setUpcomingTasks={setUpcomingTasks} />

            </div>
            
            {/* Upcoming Events Section */}
            <div className="w-1/3 bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-secondary">
                    Upcoming Study
                </h2>
                <ul className="space-y-4">
                    {upcomingTasks
                        .filter(
                            (event) =>
                                isAfter(
                                    new Date(event.startDateTime),
                                    new Date()
                                ) && !event.started
                        ) // Only include upcoming events that haven't started
                        .slice(0, visibleEvents)
                        .map((event, index) => (
                            <li
                                key={index}
                                className="flex flex-col border-b px-4 py-2 gap-2 bg-[#de66a64d] rounded-lg justify-center"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-lg font-semibold">
                                            {format(
                                                event.startDateTime,
                                                "PP p"
                                            )}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            Starts in{" "}
                                            {getRemainingTime(
                                                event.startDateTime
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() =>
                                                console.log(
                                                    `Editing event at index ${index}`
                                                )
                                            }
                                            className="text-blue-500"
                                        >
                                            <i className="pi pi-pencil"></i>
                                        </button>
                                        <button
                                            onClick={() =>
                                                console.log(
                                                    `Deleting event at index ${index}`
                                                )
                                            }
                                            className="text-red-500"
                                        >
                                            <i className="pi pi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        onClick={() => handleStartEvent(index)}
                                        className="px-4 py-2 bg-secondary text-white rounded"
                                    >
                                        Start Event
                                    </button>
                                </div>
                            </li>
                        ))}
                </ul>

                {upcomingTasks.filter(
                    (event) =>
                        isAfter(new Date(event.startDateTime), new Date()) &&
                        !event.started
                ).length > visibleEvents && (
                    <button
                        onClick={handleShowMore}
                        className="mt-4 px-6 py-2 bg-secondary text-white rounded"
                    >
                        Show More
                    </button>
                )}
            </div>
        </div>
    );
};

export default TaskList;
