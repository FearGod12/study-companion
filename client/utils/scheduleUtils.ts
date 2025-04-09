import { NewSchedule } from "@/interfaces/interface";
import { formatTimeToHHMMSS } from "./formatting";

export const prepareScheduleData = (schedule: NewSchedule): NewSchedule => ({
  ...schedule,
  startTime: formatTimeToHHMMSS(schedule.startTime),
  recurringDays: schedule.isRecurring ? schedule.recurringDays : [],
});