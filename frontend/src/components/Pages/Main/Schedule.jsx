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
} from "../../../services/api";

const Schedule = ({ setUpcomingTasks = () => {} }) => {
    const [tasks, setTasks] = useState([]); // Combined state for events and upcoming tasks
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [fromTime, setFromTime] = useState("10:00 AM");
    const [toTime, setToTime] = useState("11:00 AM");
    const [currentTime, setCurrentTime] = useState(new Date());
    const [title, setTitle] = useState("");
    const [editingEvent, setEditingEvent] = useState(null);
    const navigate = useNavigate();
    const toast = useRef(null);
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurringDays, setRecurringDays] = useState([]);

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

    useEffect(() => {
        fetchSchedules();
        const interval = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchSchedules = async () => {
        try {
            const response = await retrieveSchedules();
            const data = response.data;

            if (!Array.isArray(data)) {
                console.error("Unexpected data format:", data);
                return;
            }

            const backendEvents = data
                .filter((event) => {
                    if (
                        !event.startTime ||
                        isNaN(new Date(event.startTime).getTime())
                    ) {
                        console.warn(
                            "Skipping event with invalid startTime:",
                            event
                        );
                        return false;
                    }
                    if (typeof event.duration !== "number") {
                        console.warn(
                            "Skipping event with invalid duration:",
                            event
                        );
                        return false;
                    }
                    return true;
                })
                .map((event) => ({
                    id: event.id || null,
                    title: event.title,
                    startDateTime: new Date(event.startTime),
                    endDateTime: new Date(
                        new Date(event.startTime).getTime() +
                            event.duration * 60000
                    ),
                    duration: event.duration,
                    started: false,
                }));

            setTasks(backendEvents);
            if (setUpcomingTasks) {
                setUpcomingTasks(backendEvents);
            }
        } catch (error) {
            handleBackendError(error, "Error fetching schedules.");
        }
    };

    const handleAddEvent = async () => {
        if (!title.trim()) {
            toast.current.show({
                severity: "warn",
                summary: "Validation Error",
                detail: "Event title is required.",
            });
            return;
        }

        const [fromHours, fromMinutes] = parseTime(fromTime);
        const [toHours, toMinutes] = parseTime(toTime);

         const startDate = selectedDate.toISOString().split("T")[0]; // Only the date part
         const startTime = `${fromHours
             .toString()
             .padStart(2, "0")}:${fromMinutes.toString().padStart(2, "0")}:00`;


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

        const newEvent = {
            title: title.trim(),
            startDate, 
            startTime,
            duration: differenceInMinutes(endDateTime, startDateTime),
            isRecurring,
            recurringDays,
        };

        // Log the payload
        console.log(
            "Payload for creating a new event:",
            JSON.stringify(newEvent, null, 2)
        );

        try {
            const response = await createSchedules(newEvent);
            console.log("Response from createSchedules API:", response.data);

            if (!response.data || !response.data._id) {
                throw new Error("Invalid response from server");
            }

            const createdEvent = {
                ...newEvent,
                id: response.data._id,
                endDateTime,
            };

            setTasks((prevTasks) => [...prevTasks, createdEvent]);
            setUpcomingTasks((prevTasks) => [...prevTasks, createdEvent]);
            toast.current.show({
                severity: "success",
                summary: "Event Added",
                detail: "The event was successfully added!",
            });
            resetInputs();
        } catch (error) {
            console.error(
                "Error creating event:",
                error.response?.data || error.message
            );
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to add event.",
            });
        }
    };


    const handleEditEvent = (index) => {
        setEditingEvent(index);
        const task = tasks[index];
        setTitle(task.title);
        setSelectedDate(task.startDateTime);
        setFromTime(format(task.startDateTime, "hh:mm a"));
        setToTime(format(task.endDateTime, "hh:mm a"));
        setIsRecurring(task.isRecurring);
        setRecurringDays(task.recurringDays || []);
    };

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
            isRecurring,
            recurringDays,
        };

        try {
            const eventId = tasks[editingEvent].id;
            await updateSchedules(eventId, updatedEvent);
            const updatedTasks = [...tasks];
            updatedTasks[editingEvent] = {
                ...updatedEvent,
                id: eventId,
                endDateTime: updatedEndDateTime,
            };
            setTasks(updatedTasks);
            setUpcomingTasks(updatedTasks);
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

    const handleDeleteEvent = async (index) => {
        const taskId = tasks[index].id;
        try {
            await deleteSchedules(taskId);
            const updatedTasks = tasks.filter((_, i) => i !== index);
            setTasks(updatedTasks);
            setUpcomingTasks(updatedTasks); // If needed to update parent state
            toast.current.show({
                severity: "success",
                summary: "Task Deleted",
                detail: "The task was successfully deleted!",
            });
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to delete task.",
            });
        }
    };

    const handleStartEvent = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].started = true; // Mark the task as started
        setTasks(updatedTasks);
        setUpcomingTasks(updatedTasks); // If needed to update parent state
    };

    const resetInputs = () => {
        setTitle("");
        setSelectedDate(new Date());
        setFromTime("10:00 AM");
        setToTime("11:00 AM");
        setIsRecurring(false);
        setRecurringDays([]);
    };

    const parseTime = (time) => {
        if (!time || typeof time !== "string") return [0, 0];
        const timeRegex = /^(\d{1,2}):(\d{2})\s?(AM|PM)?$/i;
        const match = time.match(timeRegex);
        if (!match) return [0, 0]; // Default to 00:00 if parsing fails

        let [_, hours, minutes, period] = match;
        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);

        if (isNaN(hours) || isNaN(minutes)) return [0, 0];
        if (period?.toUpperCase() === "PM" && hours < 12) hours += 12;
        if (period?.toUpperCase() === "AM" && hours === 12) hours = 0;

        return [hours, minutes];
    };

    const highlightEventBadge = (task) => {
        if (task.started) {
            return <span className="text-green-500 text-sm">In Progress</span>;
        }
        if (isAfter(new Date(), task.startDateTime)) {
            return (
                <span className="bg-orange-300 px-2 py-1 rounded text-white text-sm">
                    Ready to Start
                </span>
            );
        }
        return <span className="text-gray-500 text-sm">Upcoming</span>;
    };

    // Tooltip for recurring days
    const TooltipWrapper = ({ children, tooltipText }) => (
        <div className="relative group">
            {children}
            <div className="absolute opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-xs rounded px-2 py-1 bottom-full left-1/2 transform -translate-x-1/2">
                {tooltipText}
            </div>
        </div>
    );

    return (
        <div className="container max-w-none flex gap-4 font-inria-sans">
            <Toast ref={toast} />
            <div className="w-2/3 bg-gray-100 flex flex-col rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-secondary text-pretty">
                    {editingEvent !== null ? "Edit Event" : "Create Event"}
                </h2>
                <div className="mb-4">
                    <div className="flex items-center gap-8 font-bold">
                        <label>Event Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-8 font-bold">
                    <label>Select Date</label>
                    <Calendar
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.value)}
                        dateFormat="yy/mm/dd"
                        className="mb-4"
                        showIcon
                    />
                </div>
                <div className="flex gap-6">
                    <div className="flex items-center gap-8 font-bold">
                        <label>Start Time</label>
                        <TimePicker
                            value={fromTime}
                            onChange={setFromTime}
                            disableClock
                            clearIcon={null}
                        />
                    </div>
                    <div className="flex items-center gap-8 font-bold">
                        <label>End Time</label>
                        <TimePicker
                            value={toTime}
                            onChange={setToTime}
                            disableClock
                            clearIcon={null}
                        />
                    </div>
                </div>

                <div className="flex gap-6">
                    <TooltipWrapper tooltipText="Enable if this event repeats on specific days.">
                        <label>Recurring</label>
                    </TooltipWrapper>
                    <input
                        type="checkbox"
                        checked={isRecurring}
                        onChange={handleRecurringToggle}
                    />
                </div>
                {isRecurring && (
                    <div className="flex gap-6">
                        <label>Select Recurring Days</label>
                        <div className="days-of-week">
                            {daysOfWeek.map((day) => (
                                <TooltipWrapper
                                    key={day.id}
                                    tooltipText={`Enable for ${day.label}`}
                                >
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={recurringDays.includes(
                                                day.id
                                            )}
                                            onChange={() =>
                                                handleRecurringChange(day.id)
                                            }
                                        />
                                        {day.label}
                                    </label>
                                </TooltipWrapper>
                            ))}
                        </div>
                    </div>
                )}
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
                    Upcoming Tasks
                </h2>
                <ul className="space-y-4">
                    {tasks.map((task, index) => (
                        <li
                            key={task.id}
                            className="flex flex-col border-b px-4 py-2 gap-2 bg-[#de66a64d] rounded-lg justify-center"
                        >
                            <div className="flex justify-between items-center">
                                <p className="text-lg font-semibold">
                                    {task.title}
                                </p>
                                <div>
                                    <p className="text-lg font-semibold">
                                        {format(task.startDateTime, "PP p")}
                                    </p>
                                    {highlightEventBadge(task)}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => handleEditEvent(index)}
                                        className="text-blue-500"
                                    >
                                        <i className="pi pi-pencil"></i>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteEvent(index)}
                                        className="text-red-500"
                                    >
                                        <i className="pi pi-trash"></i>
                                    </button>
                                </div>
                            </div>
                            {!task.started && (
                                <button
                                    onClick={() => handleStartEvent(index)}
                                    className="px-4 py-2 bg-secondary text-white rounded"
                                >
                                    Start Task
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Schedule;
