import { NewSchedule, Schedule } from "@/interfaces/interface";

export const prepareScheduleData = (schedule: NewSchedule | Schedule) => {
  const data: any = {
    ...schedule,
    // Parse startTime correctly by removing any unwanted fractions of a second
    startTime: schedule.startTime.split('T')[1]?.split('.')[0],  // Correctly handles time portion
    startDate: schedule.startDate.split('T')[0],  // Just extract the date portion
  };

  // Remove recurringDays if not recurring
  if (!schedule.isRecurring) {
    delete data.recurringDays;
  }

  return data;
};
