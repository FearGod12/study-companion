import React from "react";
import ScheduleItem from "./ScheduleItem";
import useSchedules from "@/hooks/useSchedules";

const ScheduleList = () => {
  const { schedules, loading } = useSchedules();


  if (loading) return <p className="mt-8">Loading Schedules...</p>;

  if (!schedules.length)
    return (
      <div className="flex items-center justify-center">
        <p>No schedules found.</p>
      </div>
    );

  return (
    <ul className="space-y-4 overflow-auto h-3/4 scrollbar-hidden">
      {schedules.map((schedule) => (
        <ScheduleItem
          key={schedule.id}
          schedule={schedule}
        />
      ))}
    </ul>
  );
};

export default ScheduleList;
