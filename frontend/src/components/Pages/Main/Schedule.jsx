import React, { useState, useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { useNavigate } from "react-router-dom";
import TimePicker from "react-time-picker";
import { Toast } from "primereact/toast";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "react-time-picker/dist/TimePicker.css";
import { useSchedules } from "../../../hooks/useSchedule"; 

const Schedule = () => {
    const [upcomingTasks, setUpcomingTasks] = useState([]);
    const {
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
    } = useSchedules(setUpcomingTasks);

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
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={recurringDays.includes(day.id)}
                                        onChange={() =>
                                            handleRecurringChange(day.id)
                                        }
                                    />
                                    {day.label}
                                </label>
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
