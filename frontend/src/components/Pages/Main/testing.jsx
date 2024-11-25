import { useState, useEffect, useRef } from "react";
import { format, differenceInMinutes, isAfter, isBefore } from "date-fns";
import { Calendar } from "primereact/calendar";
import { useNavigate } from "react-router-dom";
import TimePicker from "react-time-picker";
import { Toast } from "primereact/toast";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "react-time-picker/dist/TimePicker.css";
import {
    retrieveSchedules,
    createSchedules,
    updateSchedules,
    deleteSchedules,
} from "../../../services/api"; // Importing API functions

const Schedule = ({ setUpcomingTasks }) => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [fromTime, setFromTime] = useState("10:00 AM");
    const [toTime, setToTime] = useState("11:00 AM");
    const [currentTime, setCurrentTime] = useState(new Date());
    const [title, setTitle] = useState(""); // New state for title input
    const [editingEvent, setEditingEvent] = useState(null);
    const navigate = useNavigate();
    const toast = useRef(null);
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurringDays, setRecurringDays] = useState([]);

    // Days of the week (1 = Monday, 7 = Sunday)
    const daysOfWeek = [
        { id: 1, label: "Monday" },
        { id: 2, label: "Tuesday" },
        { id: 3, label: "Wednesday" },
        { id: 4, label: "Thursday" },
        { id: 5, label: "Friday" },
        { id: 6, label: "Saturday" },
        { id: 7, label: "Sunday" },
    ];

    const handleRecurringChange = (day) => {
        setRecurringDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const handleRecurringToggle = () => {
        setIsRecurring(!isRecurring);
    };

    // Fetch schedules on component mount
    useEffect(() => {
        fetchSchedules();
        const interval = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    // Fetch the schedules from the backend
    const fetchSchedules = async () => {
        try {
            const response = await retrieveSchedules(); // Use imported function
            const backendEvents = response.map((event) => ({
                id: event.id,
                title: event.title,
                startDateTime: new Date(event.startTime), // Convert to Date object
                endDateTime: new Date(
                    new Date(event.startTime).getTime() + event.duration * 60000
                ), // Adding duration in milliseconds
                duration: event.duration,
            }));

            setEvents(backendEvents);
            setUpcomingTasks(backendEvents);
        } catch (error) {
            console.error("Error fetching schedules:", error.message);
        }
    };

    // Add a new event (schedule)
    const handleAddEvent = async () => {
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
            toast.current.show({
                severity: "warn",
                summary: "Invalid Time",
                detail: "End time cannot be before start time.",
            });
            return;
        }

        if (isBefore(endDateTime, startDateTime)) {
            toast.current.show({
                severity: "warn",
                summary: "Invalid Time",
                detail: "End time cannot be before start time.",
            });
            return;
        }

        const newEvent = {
            title,
            startTime: startDateTime.toISOString(),
            duration: differenceInMinutes(endDateTime, startDateTime),
            isRecurring: isRecurring, // Set this flag
            recurringDays: recurringDays, // Include selected recurring days
        };

        try {
            const response = await createSchedules(newEvent); // Using imported API function
            const createdEvent = {
                ...newEvent,
                id: response.data._id,
                endDateTime,
            };
            setEvents((prevEvents) => [...prevEvents, createdEvent]);
            setUpcomingTasks((prevTasks) => [...prevTasks, createdEvent]);
            toast.current.show({
                severity: "success",
                summary: "Event Added",
                detail: "The event was successfully added!",
            });
            resetInputs();
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to add event.",
            });
        }
    };

    // Edit an event
    const handleEditEvent = (index) => {
        setEditingEvent(index);
        const event = events[index];
        setTitle(event.title);
        setSelectedDate(event.startDateTime);
        setFromTime(format(event.startDateTime, "hh:mm a"));
        setToTime(format(event.endDateTime, "hh:mm a"));
    };

    // Update an event
    const handleUpdateEvent = async () => {
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

        // Check if the end time is after start time
        if (isBefore(updatedEndDateTime, updatedStartDateTime)) {
            toast.current.show({
                severity: "warn",
                summary: "Invalid Time",
                detail: "End time cannot be before start time.",
            });
            return;
        }

        const updatedEvent = {
            title,
            startTime: updatedStartDateTime.toISOString(),
            duration: differenceInMinutes(
                updatedEndDateTime,
                updatedStartDateTime
            ),
            isRecurring: isRecurring, // Set this flag
            recurringDays: recurringDays, // Include selected recurring days
        };

        try {
            const eventId = events[editingEvent].id;
            await updateSchedules(eventId, updatedEvent); // Using imported API function
            const updatedEvents = [...events];
            updatedEvents[editingEvent] = {
                ...updatedEvent,
                id: eventId,
                endDateTime: updatedEndDateTime,
            };
            setEvents(updatedEvents);
            setUpcomingTasks(updatedEvents);
            toast.current.show({
                severity: "success",
                summary: "Event Updated",
                detail: "The event was successfully updated!",
            });
            resetInputs();
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to update event.",
            });
        }
    };

    // Delete an event
    const handleDeleteEvent = async (index) => {
        const eventId = events[index].id;
        try {
            await deleteSchedules(eventId); // Using imported API function
            const updatedEvents = events.filter((_, i) => i !== index);
            setEvents(updatedEvents);
            setUpcomingTasks(updatedEvents);
            toast.current.show({
                severity: "success",
                summary: "Event Deleted",
                detail: "The event was successfully deleted!",
            });
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to delete event.",
            });
        }
    };

    const getRemainingTime = (startDateTime) => {
        const minutesLeft = differenceInMinutes(startDateTime, currentTime);
        if (minutesLeft < 1) {
            return "Now";
        }
        const hours = Math.floor(minutesLeft / 60);
        const minutes = minutesLeft % 60;
        return `${hours > 0 ? hours + " hr " : ""}${minutes} min`;
    };

    const handleStartEvent = async (index) => {
        const eventId = events[index].id;
        const updatedEvent = { ...events[index], started: true };

        try {
            await updateSchedules(eventId, updatedEvent); // Use imported function to update status
            const updatedEvents = [...events];
            updatedEvents[index] = updatedEvent; // Update the event in local state
            setEvents(updatedEvents);
            setUpcomingTasks(updatedEvents);
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to start event.",
            });
        }
    };

    // Parse time string (e.g., "10:00 AM") into hours and minutes
   const parseTime = (timeStr) => {
       const [time, modifier] = timeStr.split(" ");
       const [hours, minutes] = time.split(":").map(Number);
       let hours24 = hours % 12;
       if (modifier === "PM") {
           hours24 += 12;
       }
       return [hours24, minutes];
   };

    // Reset form inputs
    const resetInputs = () => {
        setTitle("");
        setFromTime("10:00 AM");
        setToTime("11:00 AM");
        setSelectedDate(new Date());
        setEditingEvent(null);
    };

    return (
        <div className="container max-w-none flex gap-4 font-inria-sans">
            <Toast ref={toast} />
            <div className="w-2/3 bg-gray-100 flex flex-col rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-secondary text-pretty">
                    Schedule Study
                </h2>
                <div className="mb-4">
                    <div className="flex items-center gap-8 font-bold">
                        <p>Title:</p>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter title"
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>
                <Calendar
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.value)}
                    inline
                    dateFormat="dd/mm/yy"
                    className="mb-4"
                />
                <div className="flex gap-6">
                    <div className="flex items-center gap-8 font-bold">
                        <p>From:</p>
                        <TimePicker
                            value={fromTime}
                            onChange={setFromTime}
                            disableClock
                            clearIcon={null}
                        />
                    </div>

                    <div className="flex items-center gap-8 font-bold">
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
                                    <p className="text-lg font-semibold">
                                        {event.title}
                                    </p>
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
