import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import useSchedules from "../../../hooks/useSchedule";

const Schedule = () => {
    const {
        schedules,
        newSchedule,
        editingSchedule,
        loading,
        daysOfWeek,
        formatTitle,
        formatDate,
        formatTime,
        searchQuery,
        filterOptions,
        isDarkMode,
        setNewSchedule,
        setEditingSchedule,
        setSearchQuery,
        setFilterOptions,
        toggleDarkMode,
        handleCreateSchedule,
        handleUpdateSchedule,
        handleDeleteSchedule,
        handleRecurringDayChange,
        handleRecurringDayChangeEdit,
    } = useSchedules();

    return (
        <div className="p-6 bg-gray-200 dark:bg-gray-900 dark:text-white">
            {/* Header Section */}
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold ml-12 text-secondary">Study Manager</h1>
                <button
                    onClick={toggleDarkMode}
                    className="px-4 py-2 bg-gray-700 text-gray-100 rounded"
                >
                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                </button>
            </header>

            {/* Main Content */}
            <div className="flex flex-col-reverse lg:flex-row md:flex-row gap-8 ">
                {/* Add/Edit Form */}
                <section className="lg:flex-initial lg:w-3/5 md:w-3/5 px-6 h-screen flex-1 font-ink-free bg-gray-100 dark:bg-gray-800 rounded">
                    <h2 className="text-xl font-semibold mb-6 mt-8">
                        {editingSchedule ? "Edit Schedule" : "Add New Schedule"}
                    </h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (editingSchedule) {
                                const updatedSchedule = {
                                    ...editingSchedule,
                                    title: newSchedule.title || editingSchedule.title,
                                    startDate: newSchedule.startDate || editingSchedule.startDate,
                                    startTime: newSchedule.startTime || editingSchedule.startTime,
                                    duration: newSchedule.duration || editingSchedule.duration,
                                    isRecurring: newSchedule.isRecurring !== undefined ? newSchedule.isRecurring : editingSchedule.isRecurring,
                                    recurringDays: newSchedule.recurringDays.length > 0 ? newSchedule.recurringDays : editingSchedule.recurringDays,
                                };
                                handleUpdateSchedule(updatedSchedule._id, updatedSchedule);
                                setEditingSchedule(null);
                            } else {
                                handleCreateSchedule();
                            }
                            setNewSchedule({
                                title: "",
                                startDate: "",
                                startTime: "",
                                duration: 0,
                                isRecurring: false,
                                recurringDays: [],
                            });
                        }}
                        className="space-y-4"
                    >
                        <input
                            type="text"
                            placeholder="Title"
                            value={editingSchedule ? editingSchedule.title : newSchedule.title}
                            onChange={(e) =>
                                editingSchedule
                                    ? setEditingSchedule((prev) => ({ ...prev, title: e.target.value }))
                                    : setNewSchedule((prev) => ({ ...prev, title: e.target.value }))
                            }
                            className="p-2 rounded-lg w-full dark:bg-gray-700 dark:text-white"
                        />
                        <input
                            type="date"
                            value={editingSchedule ? editingSchedule.startDate : newSchedule.startDate}
                            onChange={(e) =>
                                editingSchedule
                                    ? setEditingSchedule((prev) => ({ ...prev, startDate: e.target.value }))
                                    : setNewSchedule((prev) => ({ ...prev, startDate: e.target.value }))
                            }
                            className="p-2 rounded-lg w-full dark:bg-gray-700 dark:text-white"
                        />
                        <input
                            type="time"
                            value={editingSchedule ? editingSchedule.startTime : newSchedule.startTime}
                            onChange={(e) =>
                                editingSchedule
                                    ? setEditingSchedule((prev) => ({ ...prev, startTime: e.target.value }))
                                    : setNewSchedule((prev) => ({ ...prev, startTime: e.target.value }))
                            }
                            className="p-2 rounded-lg w-full dark:bg-gray-700 dark:text-white"
                        />
                        <input
                            type="number"
                            placeholder="Duration (in minutes)"
                            value={editingSchedule ? editingSchedule.duration : newSchedule.duration}
                            onChange={(e) =>
                                editingSchedule
                                    ? setEditingSchedule((prev) => ({ ...prev, duration: e.target.value }))
                                    : setNewSchedule((prev) => ({ ...prev, duration: e.target.value }))
                            }
                            className="p-2 rounded-lg w-full dark:bg-gray-700 dark:text-white"
                        />
                        <div className="flex items-center gap-4">
                            <label className="flex gap-2 ml-2">
                                <input
                                    type="checkbox"
                                    checked={editingSchedule ? editingSchedule.isRecurring : newSchedule.isRecurring}
                                    onChange={(e) =>
                                        editingSchedule
                                            ? setEditingSchedule((prev) => ({
                                                  ...prev,
                                                  isRecurring: e.target.checked,
                                              }))
                                            : setNewSchedule((prev) => ({
                                                  ...prev,
                                                  isRecurring: e.target.checked,
                                              }))
                                    }
                                />
                                Recurring
                            </label>
                            {((editingSchedule && editingSchedule.isRecurring) || newSchedule.isRecurring) && (
                                <div className="flex gap-2">
                                    {daysOfWeek.map((day) => (
                                        <label key={day.id}>
                                            <input
                                                type="checkbox"
                                                checked={editingSchedule
                                                    ? editingSchedule.recurringDays.includes(day.id)
                                                    : newSchedule.recurringDays.includes(day.id)}
                                                onChange={() =>
                                                    editingSchedule
                                                        ? handleRecurringDayChangeEdit(day.id)
                                                        : handleRecurringDayChange(day.id)
                                                }
                                            />
                                            {day.label}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-secondary text-white rounded"
                        >
                            {editingSchedule ? "Update Schedule" : "Add Schedule"}
                        </button>
                    </form>
                </section>

                {/* Search and Schedule List */}
                <section className="flex-1 bg-gray-100 dark:bg-gray-800 p-4 rounded h-full">
                    <div className="mb-4 space-y-4">
                        <input
                            type="text"
                            placeholder="Search schedules..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="p-2 rounded-lg w-full dark:bg-gray-700 dark:text-white"
                        />
                        <div className="flex gap-4">
                            <input
                                type="date"
                                value={filterOptions.startDate}
                                onChange={(e) =>
                                    setFilterOptions((prev) => ({ ...prev, startDate: e.target.value }))
                                }
                                className="p-2 rounded-lg w-full dark:bg-gray-700 dark:text-white"
                            />
                            <input
                                type="date"
                                value={filterOptions.endDate}
                                onChange={(e) =>
                                    setFilterOptions((prev) => ({ ...prev, endDate: e.target.value }))
                                }
                                className="p-2 rounded-lg w-full dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <p className="mt-8">Loading...</p>
                    ) : schedules.length > 0 ? (
                        <ul className="space-y-4 overflow-auto">
                            {schedules.map((schedule) => (
                                <li
                                    key={schedule._id}
                                    className="flex justify-between items-center p-4 rounded-lg bg-secondary text-gray-100 dark:text-gray-300"
                                >
                                    <div>
                                        <h3 className="text-lg font-semibold">{formatTitle(schedule.title)}</h3>
                                        <p className="text-sm">
                                            {formatDate(schedule.startDate)} - {formatTime(schedule.startTime)}
                                        </p>
                                        <p>{schedule.duration} minutes</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <button
                                            onClick={() => setEditingSchedule(schedule)}
                                            className="text-gray-100 hover:text-blue-300"
                                        >
                                            <FaRegEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSchedule(schedule._id)}
                                            className="text-gray-100 hover:text-red-200"
                                        >
                                           <RiDeleteBin6Line />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No schedules found.</p>
                    )}
                </section>
            </div>
        </div>
    );
}

export default Schedule;
