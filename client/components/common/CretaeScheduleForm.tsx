import React, { useState } from "react";
import { useScheduleStore } from "@/store/useScheduleStore";

const ScheduleForm = () => {
  const { createSchedule, loading, error } = useScheduleStore();
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    startTime: "",
    duration: 0,
    isRecurring: false,
    recurringDays: [],
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await createSchedule(formData); // Sends data to the Zustand store function
  };

  return (
    <section className="lg:flex-initial lg:w-3/5 md:w-3/5 px-6 flex-1 font-ink-free bg-gray-100 rounded py-8">
      <h2 className="text-xl font-semibold mb-6 mt-8">Create a Schedule</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Field */}
        <input
          type="text"
          placeholder="Title"
          className="p-2 rounded-lg w-full"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        {/* Start Date Field */}
        <input
          type="date"
          className="p-2 rounded-lg w-full"
          value={formData.startDate}
          onChange={(e) =>
            setFormData({ ...formData, startDate: e.target.value })
          }
        />

        {/* Start Time Field */}
        <input
          type="time"
          className="p-2 rounded-lg w-full"
          value={formData.startTime}
          onChange={(e) =>
            setFormData({ ...formData, startTime: e.target.value })
          }
        />

        {/* Duration Field */}
        <div className="space-y-2">
          <label>Duration (in minutes)</label>
          <input
            type="number"
            placeholder="Duration (in minutes)"
            className="p-2 rounded-lg w-full"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: Number(e.target.value) })
            }
          />
        </div>

        {/* Recurring Checkbox and Days */}
        <div className="flex gap-4 flex-col">
          <label className="flex gap-2 ml-2">
            <input
              type="checkbox"
              checked={formData.isRecurring}
              onChange={(e) =>
                setFormData({ ...formData, isRecurring: e.target.checked })
              }
            />
            Recurring
          </label>
          {formData.isRecurring && (
            <div className="space-x-4">
              <label>Recurring Days (e.g., 1 for Monday)</label>
              <input
                type="text"
                placeholder="Recurring Days (e.g., 1,3,5)"
                className="p-2 rounded-lg w-full"
                value={formData.recurringDays.join(",")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    recurringDays: e.target.value.split(",").map(Number),
                  })
                }
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-secondary text-white rounded"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Schedule"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </section>
  );
};

export default ScheduleForm;