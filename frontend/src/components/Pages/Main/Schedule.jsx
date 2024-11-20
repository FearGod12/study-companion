import { useState, useEffect } from "react";
import {
    format,
    differenceInMinutes,
    isAfter,
    isBefore,
    isEqual,
} from "date-fns";
import { Calendar } from "primereact/calendar";
import { useNavigate } from "react-router-dom";
import TimePicker from "react-time-picker";

// PrimeReact and TimePicker CSS imports
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "react-time-picker/dist/TimePicker.css";

const Schedule = ({ setUpcomingTasks }) => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [fromTime, setFromTime] = useState("10:00 AM");
    const [toTime, setToTime] = useState("11:00 AM");
    const [currentTime, setCurrentTime] = useState(new Date());
    const [editingEvent, setEditingEvent] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    const handleAddEvent = () => {
        const [fromHours, fromMinutes] = parseTime(fromTime);
        const [toHours, toMinutes] = parseTime(toTime);

        const startDateTime = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            fromHours,
            fromMinutes
        );
        const endDateTime = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            toHours,
            toMinutes
        );

        if (isBefore(startDateTime, new Date())) {
            alert(
                "You cannot book an event in the past. Please select a future date and time."
            );
            return;
        }

        if (isBefore(endDateTime, startDateTime)) {
            alert("End time cannot be before start time.");
            return;
        }

        const newEvent = {
            startDateTime,
            endDateTime,
            duration: differenceInMinutes(endDateTime, startDateTime),
            started: false,
        };

        setEvents((prevEvents) => {
            const updatedEvents = [...prevEvents, newEvent];
            setUpcomingTasks(updatedEvents); // Pass the updated events to parent (TaskList)
            return updatedEvents;
        });

        resetInputs();
    };

    const resetInputs = () => {
        setSelectedDate(new Date());
        setFromTime("10:00 AM");
        setToTime("11:00 AM");
        setEditingEvent(null);
    };

    const parseTime = (time) => {
        const [timePart, period] = time.split(" ");
        const [hours, minutes] = timePart.split(":").map(Number);
        const adjustedHours =
            period === "PM" && hours < 12 ? hours + 12 : hours;
        return [adjustedHours, minutes];
    };

    const handleStartEvent = (index) => {
        const updatedEvents = [...events];
        updatedEvents[index] = {
            ...updatedEvents[index],
            started: true, // Mark the event as started
        };
        setEvents(updatedEvents);
        const { duration } = updatedEvents[index];
        navigate("/reading-mode", { state: { duration } });
    };

    const getRemainingTime = (eventDateTime) => {
        const minutes = differenceInMinutes(eventDateTime, currentTime);
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const handleEditEvent = (index) => {
        setEditingEvent(index);
        setSelectedDate(events[index].startDateTime);
        setFromTime(format(events[index].startDateTime, "hh:mm a"));
        setToTime(format(events[index].endDateTime, "hh:mm a"));
    };

    const handleUpdateEvent = () => {
        const [fromHours, fromMinutes] = parseTime(fromTime);
        const [toHours, toMinutes] = parseTime(toTime);

        const updatedStartDateTime = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            fromHours,
            fromMinutes
        );
        const updatedEndDateTime = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            toHours,
            toMinutes
        );

        if (isBefore(updatedStartDateTime, new Date())) {
            alert("You cannot update an event to a past time.");
            return;
        }

        if (isBefore(updatedEndDateTime, updatedStartDateTime)) {
            alert("End time cannot be before start time.");
            return;
        }

        const updatedEvents = [...events];
        updatedEvents[editingEvent] = {
            startDateTime: updatedStartDateTime,
            endDateTime: updatedEndDateTime,
            duration: differenceInMinutes(
                updatedEndDateTime,
                updatedStartDateTime
            ),
        };

        setEvents(updatedEvents);
        setUpcomingTasks(updatedEvents); // Update parent with new events
        resetInputs();
    };

    const handleDeleteEvent = (index) => {
        const updatedEvents = events.filter((_, i) => i !== index);
        setEvents(updatedEvents);
        setUpcomingTasks(updatedEvents); // Update parent with new events
    };

    return (
        <div className="container max-w-none flex gap-4 font-inria-sans">
            {/* Schedule Input Section */}
            <div className="w-2/3 bg-gray-100 flex flex-col rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-secondary text-pretty">
                    Schedule Study
                </h2>
                <Calendar
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.value)}
                    inline
                    dateFormat="dd/mm/yy"
                    className="mb-4"
                />
                <div className="flex gap-6">
                    <div className="flex items-center gap-8">
                        <p>From:</p>
                        <TimePicker
                            value={fromTime}
                            onChange={setFromTime}
                            disableClock
                            clearIcon={null}
                        />
                    </div>

                    <div className="flex items-center gap-8">
                        <p>To:</p>
                        <TimePicker
                            value={toTime}
                            onChange={setToTime}
                            disableClock
                            clearIcon={null}
                        />
                    </div>
                </div>

                <button
                    onClick={
                        editingEvent === null
                            ? handleAddEvent
                            : handleUpdateEvent
                    }
                    className="mt-4 px-6 py-2 bg-secondary text-white rounded"
                >
                    {editingEvent === null ? "Add Event" : "Update Event"}
                </button>
            </div>

            {/* Upcoming Events Section */}
            <div className="w-1/3 bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-secondary">
                    Upcoming Study
                </h2>
                <ul className="space-y-4">
                    {events.map((event, index) => {
                        const isEventPast = isAfter(
                            currentTime,
                            event.startDateTime
                        );
                        const isEventUpcoming = !isEventPast && !event.started;

                        return (
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
                                            {event.started
                                                ? "In Progress"
                                                : isEventPast
                                                ? "Event Ready to Start"
                                                : `Starts in ${getRemainingTime(
                                                      event.startDateTime
                                                  )}`}
                                        </p>
                                    </div>

                                    {isEventUpcoming && (
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() =>
                                                    handleEditEvent(index)
                                                }
                                                className="text-blue-500"
                                            >
                                                <i className="pi pi-pencil"></i>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteEvent(index)
                                                }
                                                className="text-red-500"
                                            >
                                                <i className="pi pi-trash"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    {isEventUpcoming && !event.started ? (
                                        <button
                                            onClick={() =>
                                                handleStartEvent(index)
                                            }
                                            className="px-4 py-2 bg-secondary text-white rounded"
                                        >
                                            Start Event
                                        </button>
                                    ) : (
                                        <span className="text-green-500 text-sm">
                                            Ongoing
                                        </span>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default Schedule;
