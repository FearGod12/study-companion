import { NewSchedule, Schedule } from "@/interfaces";
import { formatTimeToHHMMSS } from "./scheduleFormatting";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateScheduleData = (schedule: any) => {
  const data = {
    ...schedule,
    startTime: formatTimeToHHMMSS(schedule.startTime),
    startDate: schedule.startDate.split("T")[0],
  };

  if (schedule.isRecurring) {
    data.recurringDays = schedule.recurringDays ?? [];
  } else {
    delete data.recurringDays;
  }

  return data;
};

export const createScheduleData = (schedule: NewSchedule | Schedule) => {
  const data: NewSchedule = {
    ...schedule,
    startTime: formatTimeToHHMMSS(schedule.startTime),
    startDate: schedule.startDate.split("T")[0],
    recurringDays: schedule.isRecurring ? schedule.recurringDays ?? [] : [],
  };
  return data;
};
