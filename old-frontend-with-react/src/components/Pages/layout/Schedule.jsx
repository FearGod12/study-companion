import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import useSchedules from "../../../hooks/useSchedule";
import useStudySessions from "../../../hooks/useStudySessions";
import Button from "../../common/Button";
import "../../../styles/scrollbar.css";
import ConfirmationModal from "../../common/ConfirmationModal";

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
    setNewSchedule,
    setEditingSchedule,
    setSearchQuery,
    setFilterOptions,
    handleCreateSchedule,
    handleUpdateSchedule,
    handleRecurringDayChange,
    handleRecurringDayChangeEdit,
    // Modal states and handlers
    isModalOpen,
    currentAction,
    openEditModal,
    openDeleteModal,
    handleConfirmEdit,
    handleConfirmDelete,
    handleCancel,
  } = useSchedules();

  const {
    isStartSessionModalOpen,
    openStartModal,
    handleConfirmStart,
    handleCancelStart,
  } = useStudySessions();

  return (
    <div className="container max-w-none bg-gray-200 lg:h-screen md:h-screen">
      <div className="flex flex-col lg:flex-row md:flex-row gap-8 h-screen">
        {/* Add/Edit Schedule Form */}
        <section className="lg:flex-initial lg:w-3/5 md:w-3/5 px-6 flex-1 font-ink-free bg-gray-100 rounded py-8">
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
                  isRecurring:
                    newSchedule.isRecurring !== undefined
                      ? newSchedule.isRecurring
                      : editingSchedule.isRecurring,
                  recurringDays:
                    newSchedule.recurringDays.length > 0
                      ? newSchedule.recurringDays
                      : editingSchedule.recurringDays,
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
              value={
                editingSchedule ? editingSchedule.title : newSchedule.title
              }
              onChange={(e) =>
                editingSchedule
                  ? setEditingSchedule((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  : setNewSchedule((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
              }
              className="p-2 rounded-lg w-full"
            />
            <input
              type="date"
              value={
                editingSchedule
                  ? editingSchedule.startDate
                  : newSchedule.startDate
              }
              onChange={(e) =>
                editingSchedule
                  ? setEditingSchedule((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  : setNewSchedule((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
              }
              className="p-2 rounded-lg w-full"
            />
            <input
              type="time"
              value={
                editingSchedule
                  ? editingSchedule.startTime
                  : newSchedule.startTime
              }
              onChange={(e) =>
                editingSchedule
                  ? setEditingSchedule((prev) => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
                  : setNewSchedule((prev) => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
              }
              className="p-2 rounded-lg w-full"
            />
            <div className="space-y-2">
              <label>Duration (in minutes)</label>
              <input
                type="number"
                placeholder="Duration (in minutes)"
                value={
                  editingSchedule
                    ? editingSchedule.duration
                    : newSchedule.duration
                }
                onChange={(e) =>
                  editingSchedule
                    ? setEditingSchedule((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    : setNewSchedule((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                }
                className="p-2 rounded-lg w-full"
              />
            </div>
            <div className="flex gap-4 flex-col">
              <label className="flex gap-2 ml-2">
                <input
                  type="checkbox"
                  checked={
                    editingSchedule
                      ? editingSchedule.isRecurring
                      : newSchedule.isRecurring
                  }
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
              {((editingSchedule && editingSchedule.isRecurring) ||
                newSchedule.isRecurring) && (
                <div className="space-x-4">
                  {daysOfWeek.map((day) => (
                    <label key={day.id}>
                      <input
                        type="checkbox"
                        checked={
                          editingSchedule
                            ? editingSchedule.recurringDays.includes(day.id)
                            : newSchedule.recurringDays.includes(day.id)
                        }
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
        <section className="flex-1 bg-pink-100 py-8 px-6 rounded">
          <div className="mb-4 space-y-4">
            <input
              type="text"
              placeholder="Search schedules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 rounded-lg w-full"
            />
            <div className="flex gap-4">
              <input
                type="date"
                value={filterOptions.startDate}
                onChange={(e) =>
                  setFilterOptions((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="p-2 rounded-lg w-full"
              />
            </div>
          </div>

          {loading ? (
            <p className="mt-8">Loading...</p>
          ) : schedules.length > 0 ? (
            <ul className="space-y-4 overflow-auto h-3/4 scrollbar-hidden">
              {schedules.map((schedule) => (
                <li
                  key={schedule._id}
                  className="flex justify-between items-center p-4 rounded-lg bg-secondary text-gray-100"
                >
                  <div>
                    <h3 className="text-lg font-semibold">
                      {formatTitle(schedule.title)}
                    </h3>
                    <p className="text-sm">
                      {formatDate(schedule.startDate)} -{" "}
                      {formatTime(schedule.startTime)}
                    </p>
                    <p>{schedule.duration} minutes</p>
                    <Button
                      onClick={() => openStartModal(schedule)}
                      className="text-gray-100 border mt-2"
                      text="Start Session"
                    />
                  </div>

                  <div className="flex gap-2 items-center">
                    {/* Edit button with tooltip */}
                    <button
                      onClick={() => openEditModal(schedule)}
                      className="text-gray-100 hover:text-blue-300 relative group"
                    >
                      <FaRegEdit />
                      <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-max px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100">
                        Edit
                      </span>
                    </button>

                    {/* Delete button with tooltip */}
                    <button
                      onClick={() => openDeleteModal(schedule)}
                      className="text-gray-100 hover:text-red-200 relative group"
                    >
                      <RiDeleteBin6Line />
                      <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-max px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100">
                        Delete
                      </span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center justify-center">
              <p>No schedules found.</p>
            </div>
          )}
        </section>
      </div>

      {/* Modal for Confirmation */}
      <ConfirmationModal
        isOpen={isModalOpen}
        message={
          currentAction === "delete"
            ? "Are you sure you want to delete this schedule?"
            : "Are you sure you want to edit this schedule?"
        }
        onConfirm={
          currentAction === "delete" ? handleConfirmDelete : handleConfirmEdit
        }
        onCancel={handleCancel}
      />

      {/* Start Session Confirmation Modal */}
      <ConfirmationModal
        isOpen={isStartSessionModalOpen}
        message="Are you sure you want to start this session?"
        onConfirm={handleConfirmStart}
        onCancel={handleCancelStart}
      />
    </div>
  );
};

export default Schedule;
