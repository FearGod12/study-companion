import { NewSchedule, Schedule } from "@/interfaces/interface";
import { formatTimeToHHMMSS } from "./formatting";

export const updateScheduleData = (schedule: Schedule) => {
  const data: Schedule = {
    ...schedule,
    startTime: formatTimeToHHMMSS(extractTimeFromISOString(schedule.startTime)),
    startDate: schedule.startDate.split("T")[0],
    recurringDays: schedule.isRecurring ? schedule.recurringDays : [],
  };

  return data;
};

export const createScheduleData = (schedule: NewSchedule | Schedule) => {
  const data: NewSchedule = {
    ...schedule,
    startTime: formatTimeToHHMMSS(schedule.startTime),
    startDate: schedule.startDate.split("T")[0],
    recurringDays: schedule.isRecurring ? schedule.recurringDays : [],
  };
  return data; // You missed this return statement
};

// Helper function to extract time in HH:MM:SS from ISO string
const extractTimeFromISOString = (isoString: string): string => {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};
