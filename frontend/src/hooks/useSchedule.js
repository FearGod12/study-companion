import { useState, useEffect, useRef } from "react";
import { format, differenceInMinutes, isAfter, isBefore } from "date-fns";
import { Toast } from "primereact/toast";
import {
    retrieveSchedules,
    createSchedules,
    updateSchedules,
    deleteSchedules,
} from "../services/api.js";

export const useSchedules = (setUpcomingTasks) => {
    const [tasks, setTasks] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [fromTime, setFromTime] = useState("10:00 AM");
    const [toTime, setToTime] = useState("11:00 AM");
    const [title, setTitle] = useState("");
    const [editingEvent, setEditingEvent] = useState(null);
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurringDays, setRecurringDays] = useState([]);
    const toast = useRef(null);
    const daysOfWeek = [
        { id: 1, label: "Monday" },
        { id: 2, label: "Tuesday" },
        { id: 3, label: "Wednesday" },
        { id: 4, label: "Thursday" },
        { id: 5, label: "Friday" },
        { id: 6, label: "Saturday" },
        { id: 7, label: "Sunday" },
    ];

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
            console.error("Error fetching schedules:", error);
        }
    };
    // Handle toggling of the recurring event
    const handleRecurringToggle = () => {
        setIsRecurring((prev) => !prev);
    };

    const handleRecurringChange = (day) => {
        setRecurringDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    useEffect(() => {
        fetchSchedules();
        const interval = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

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
            startDate: selectedDate.toISOString().split("T")[0], // Only the date part
            startTime: `${fromHours.toString().padStart(2, "0")}:${fromMinutes
                .toString()
                .padStart(2, "0")}:00`,
            duration: differenceInMinutes(endDateTime, startDateTime),
            isRecurring,
            recurringDays,
        };

        try {
            const response = await createSchedules(newEvent);
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
            setUpcomingTasks(updatedTasks);
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
        updatedTasks[index].started = true;
        setTasks(updatedTasks);
        setUpcomingTasks(updatedTasks);
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
        if (!match) return [0, 0];

        let [_, hours, minutes, period] = match;
        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);

        if (isNaN(hours) || isNaN(minutes)) return [0, 0];
        if (period?.toUpperCase() === "PM" && hours < 12) hours += 12;
        if (period?.toUpperCase() === "AM" && hours === 12) hours = 0;

        return [hours, minutes];
    };

    return {
        tasks,
        selectedDate,
        fromTime,
        toTime,
        title,
        editingEvent,
        isRecurring,
        recurringDays,
        setTitle,
        setSelectedDate,
        setFromTime,
        setToTime,
        setIsRecurring,
        setRecurringDays,
        handleRecurringToggle,
        handleAddEvent,
        handleEditEvent,
        handleUpdateEvent,
        handleDeleteEvent,
        handleStartEvent,
        resetInputs,
        daysOfWeek,
        toast,
    };
};
