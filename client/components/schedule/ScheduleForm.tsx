import Spinner from "@/components/common/Spinner";
import useSchedules from "@/hooks/useSchedules";
import { Schedule } from "@/interfaces";
import {
  formatToHHMM,
  getCurrentTimeHHMM,
  isToday,
} from "@/utils/scheduleFormatting";
import { useState } from "react";


const ScheduleForm: React.FC = () => {
  const {
    newSchedule,
    editingSchedule,
    daysOfWeek,
    setNewSchedule,
    setEditingSchedule,
    handleCreateSchedule,
    handleUpdateSchedule,
    toggleRecurringDay,
  } = useSchedules();

  const [loading, setLoading] = useState(false);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
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
          recurringDays: newSchedule.recurringDays.length
            ? newSchedule.recurringDays
            : editingSchedule.recurringDays,
        };
        handleUpdateSchedule(updatedSchedule.id, updatedSchedule);
        setEditingSchedule(null);
      } else {
        await handleCreateSchedule();
      }
      setNewSchedule({
        title: "",
        startDate: "",
        startTime: "",
        duration: 0,
        isRecurring: false,
        recurringDays: [],
      });
    } catch (error) {
      console.error("Error handling schedule. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle field changes
  const handleChange = (
    field: keyof Schedule,
    value: string | number | boolean
  ) => {
    if (editingSchedule) {
      setEditingSchedule({ ...editingSchedule, [field]: value });
    } else {
      setNewSchedule({ ...newSchedule, [field]: value });
    }
  };

  return (
    <section className="lg:flex-initial lg:w-3/5 md:w-3/5 px-6 flex-1 bg-gray-100 rounded py-8">
      <h2 className="text-xl font-semibold mb-6 mt-8">
        {editingSchedule ? "Edit Schedule" : "Add New Schedule"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 lg:max-w-lg md:max-w-md max-w-md"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="title">Title</label>
          {/* Title */}
          <input
            type="text"
            id="title"
            placeholder="Title"
            value={editingSchedule ? editingSchedule.title : newSchedule.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="p-2 rounded-lg w-full outline-2 outline-accent focus:ring ring-accent"
          />
        </div>

        {/* Start Date */}
        <div className="flex flex-col gap-2">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            min={new Date().toISOString().split("T")[0]}
            value={
              editingSchedule
                ? editingSchedule.startDate
                : newSchedule.startDate
            }
            onChange={(e) => handleChange("startDate", e.target.value)}
            className="p-2 rounded-lg w-full outline-2 outline-accent focus:ring ring-accent"
          />
        </div>

        {/* Start Time */}

        <div className="flex flex-col gap-2">
          <label htmlFor="startTime">Start Time</label>
          <input
            type="time"
            id="startTime"
            min={
              isToday(
                editingSchedule
                  ? editingSchedule.startDate
                  : newSchedule.startDate
              )
                ? getCurrentTimeHHMM()
                : undefined
            }
            value={
              editingSchedule
                ? formatToHHMM(editingSchedule.startTime)
                : newSchedule.startTime
            }
            onChange={(e) => handleChange("startTime", e.target.value)}
            className="p-2 rounded-lg w-full outline-2 outline-accent focus:ring ring-accent"
          />
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-2">
          <label htmlFor="duration">Duration (in minutes)</label>
          <input
            type="number"
            id="duration"
            min={1}
            value={
              editingSchedule
                ? editingSchedule.duration.toString().replace(/^0+/, "")
                : newSchedule.duration.toString().replace(/^0+/, "")
            }
            onChange={(e) => handleChange("duration", Number(e.target.value))}
            className="p-2 rounded-lg w-full outline-2 outline-accent focus:ring ring-accent"
          />
        </div>

        {/* Recurring Days */}
        <div className="flex gap-4 flex-col">
          <label className="flex gap-2 ml-2">
            <input
              type="checkbox"
              checked={
                editingSchedule
                  ? editingSchedule.isRecurring
                  : newSchedule.isRecurring
              }
              onChange={(e) => handleChange("isRecurring", e.target.checked)}
            />
            Recurring
          </label>

          {(editingSchedule
            ? editingSchedule.isRecurring
            : newSchedule.isRecurring) && (
            <div className="space-x-4">
              {daysOfWeek.map((day) => (
                <label key={day.id}>
                  <input
                    type="checkbox"
                    checked={
                      editingSchedule
                        ? editingSchedule?.recurringDays?.includes(day.id)
                        : newSchedule?.recurringDays?.includes(day.id)
                    }
                    onChange={() =>
                      toggleRecurringDay(day.id, !!editingSchedule)
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
          className="px-4 py-2 bg-accent text-white rounded flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <Spinner />
          ) : editingSchedule ? (
            "Update Schedule"
          ) : (
            "Add Schedule"
          )}
        </button>
      </form>
    </section>
  );
};

export default ScheduleForm;
