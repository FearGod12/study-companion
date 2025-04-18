export interface Schedule {
  id: string;
  title: string;
  startDate: string;
  startTime: string;
  duration: number;
  isRecurring: boolean;
  recurringDays: number[];
}

export interface NewSchedule {
  title: string;
  startDate: string;
  startTime: string;
  duration: number;
  isRecurring: boolean;
  recurringDays: number[];
}

export interface ScheduleUtils {
  id: string;
  title: string;
  startDate: string;
  startTime: string;
  duration: number;
  isRecurring: boolean;
  recurringDays?: number[] ;
}

export interface ScheduleStore {
  schedules: Schedule[];
  loading: boolean;
  error: string | null;
  newSchedule: NewSchedule;
  editingSchedule: Schedule | null;
  modalState: {
    isOpen: boolean;
    action: "edit" | "delete" | "start" | null;
    schedule: Schedule | null;
  };
  createSchedule: (schedule: NewSchedule) => Promise<void>;
  retrieveSchedules: () => Promise<void>;
  updateSchedule: (id: string, schedule: Schedule) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
  setSchedules: (schedules: Schedule[]) => void;
  setNewSchedule: (newSchedule: NewSchedule) => void;
  setEditingSchedule: (editingSchedule: Schedule | null) => void;
  setModalState: (newState: ScheduleStore["modalState"]) => void;
  closeModal: () => void;
}

export interface Day {
  id: number;
  label: string;
}

export interface ScheduleFormProps {
  newSchedule: Schedule;
  editingSchedule: Schedule | null;
  daysOfWeek: Day[];
  setNewSchedule: React.Dispatch<React.SetStateAction<NewSchedule>>;
  setEditingSchedule: React.Dispatch<React.SetStateAction<NewSchedule | null>>;
  handleCreateSchedule: () => Promise<void>;
  handleUpdateSchedule: (id: string, schedule: Schedule) => Promise<void>;
  handleRecurringDayChange: (dayId: number) => void;
  handleRecurringDayChangeEdit: (dayId: number) => void;
  isFormValid: boolean;
  loading: boolean;
  error: string | null;
}

export interface ScheduleItemProps {
  schedule: Schedule;
  formatTitle: (title: string) => string;
  formatDate: (dateStr: string) => string;
  formatTime: (timeStr: string) => string;
  openModal: (schedule: Schedule, action: "edit" | "delete") => void;
}
