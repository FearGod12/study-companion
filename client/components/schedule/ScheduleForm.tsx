import React, { useState } from "react";
import Spinner from "@/components/common/Spinner";
import useSchedules from "@/hooks/useSchedules";

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
  const schedule = editingSchedule || newSchedule;
  const recurringDays = schedule?.recurringDays || [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); 

    try {
      if (editingSchedule) {
        await handleUpdateSchedule(editingSchedule.id, editingSchedule);
        setEditingSchedule(null);
      } else {
        await handleCreateSchedule();
      }
    } catch (error) {
      console.error("Error handling schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = <K extends keyof typeof schedule>(
    field: K,
    value: typeof schedule[K]
  ) => {
    const updatedSchedule = { ...schedule, [field]: value };
  
    if (field === "isRecurring" && !value) {
      updatedSchedule.recurringDays = []; // Clear recurringDays if isRecurring is false
    }
  
    const setter = editingSchedule ? setEditingSchedule : setNewSchedule;
    setter(updatedSchedule);
  };

  return (
    <section className="lg:flex-initial lg:w-3/5 md:w-3/5 px-6 flex-1 font-ink-free bg-gray-100 rounded py-8">
      <h2 className="text-xl font-semibold mb-6 mt-8">
        {editingSchedule ? "Edit Schedule" : "Add New Schedule"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 lg:max-w-lg md:max-w-md max-w-md">
        <input
          type="text"
          placeholder="Title"
          value={schedule.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="p-2 rounded-lg w-full outline-2 outline-accent focus:ring ring-accent"
        />

        <input
          type="date"
          value={schedule.startDate}
          onChange={(e) => handleChange("startDate", e.target.value)}
          className="p-2 rounded-lg w-full outline-2 outline-accent focus:ring ring-accent"
        />

        <input
          type="time"
          value={schedule.startTime}
          onChange={(e) => handleChange("startTime", e.target.value)}
          className="p-2 rounded-lg w-full outline-2 outline-accent focus:ring ring-accent"
        />

        <div className="space-y-2">
          <label>Duration (in minutes)</label>
          <input
            type="number"
            value={schedule.duration}
            onChange={(e) => handleChange("duration", Number(e.target.value))}
            className="p-2 rounded-lg w-full outline-2 outline-accent focus:ring ring-accent"
            placeholder="0"
          />
        </div>
 <div className="flex gap-4 flex-col">
          <label className="flex gap-2 ml-2">
            <input
              type="checkbox"
              checked={schedule.isRecurring}
              onChange={(e) => handleChange("isRecurring", e.target.checked)}
            />
            Recurring
          </label>

          {schedule.isRecurring && (
            <div className="space-x-4">
              {daysOfWeek.map((day) => (
                <label key={day.id}>
                  <input
                    type="checkbox"
                    checked={recurringDays.includes(day.id)}
                    disabled={!schedule.isRecurring}
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
