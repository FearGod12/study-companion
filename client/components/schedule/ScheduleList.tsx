import React from "react";
import ScheduleItem from "./ScheduleItem";
import useSchedules from "@/hooks/useSchedules";

const ScheduleList = () => {
  const { schedules, loading } = useSchedules();

  if (loading) return <p className="mt-10">Loading Schedules...</p>;

  if (!schedules.length)
    return (
      <div className="flex items-center justify-center h-50">
        <p>No schedule available.</p>
      </div>
    );

  return (
    <ul className="space-y-4 overflow-auto lg:max-h-full md:max-h-full max-h-1/6 scrollbar-hidden">
      {schedules.map((schedule, index) => (
        <ScheduleItem key={schedule.id || index} schedule={schedule} />
      ))}
    </ul>
  );
};

export default ScheduleList;
