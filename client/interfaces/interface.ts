import { ButtonHTMLAttributes, Dispatch, JSX, ReactNode, SetStateAction } from "react";

export type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

export interface ApiResponse<T = unknown> {
  access_Token?: string;
  success: boolean;
  data: T;
  message?: string;
}

export interface UserData {
  id?: string;
  name?: string;
  email?: string;
  accessToken?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
  category?: string;
  address?: string;
  avatar?: string;
}

// Define the store shape
export interface AuthStore {
  user: UserData | null;
  isAuthenticated: boolean;
  emailForVerification: string | null;
  loading: boolean;
  error: string | null;

  // Authentication actions
  register: (userData: FormValues) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logoutUser: () => void;
  fetchUserData: () => Promise<void>;

  // Email verification
  verifyEmail: (email: string, token: string) => Promise<void>;

  // Password Reset actions
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (
    token: string,
    password: string,
    confirmPassword: string,
    email: string
  ) => Promise<void>;

  initializeAuth: () => Promise<void>;
  hasHydrated: boolean;
}

export interface PasswordState {
  showPassword: { [key: string]: boolean };
  togglePassword: (field: string) => void;
}

export interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  category: string;
  address: string;
}

export interface UpdateFormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  category: string;
  address: string;
}

export interface Avatar {
  id: string;
  url: string;
  file: File;
}

export interface UserStore {
  loading: boolean;
  error: string | null;
  successMessage: string | null;

  uploadAvatar: (file: File) => Promise<void>;
  updateUserDetails: (userData: UpdateFormValues) => Promise<void>;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface EmailVerifyValues {
  otp: string[];
}

export interface ForgotPassValues {
  email: string;
}

export interface resetPassValues {
  token: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Schedules
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

export interface Schedule extends NewSchedule {
  id: string;
}

export interface ScheduleStore {
  schedules: Schedule[];
  loading: boolean;
  retrieved: boolean;
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
  setNewSchedule: (schedule: NewSchedule) => void;
  setEditingSchedule: (schedule: Schedule | null) => void;
  setModalState: (newState: ScheduleStore["modalState"]) => void;
  closeModal: () => void;
}


export interface Day {
  id: number;
  label: string;
}

export interface ScheduleFormProps {
  editingSchedule: Schedule | null;
  newSchedule: Schedule;
  daysOfWeek: Day[];
  setEditingSchedule: React.Dispatch<React.SetStateAction<NewSchedule | null>>;
  setNewSchedule: React.Dispatch<React.SetStateAction<NewSchedule>>;
  handleCreateSchedule: () => Promise<void>;
  handleUpdateSchedule: (id: string, schedule: Schedule) => Promise<void>;
  handleRecurringDayChange: (dayId: number) => void;
  handleRecurringDayChangeEdit: (dayId: number) => void;
}

export interface SessionStore {
  loading: boolean;
  error: string | null;
  studySessions: StudySession[];
  statistics: StudyStatistics | null;
  currentSession: StudySessionData

  // Actions
  startSession: (id: string) => Promise<void>;
  endSession: (id: string) => Promise<void>;
  fetchSessions: (page?: number, limit?: number) => Promise<void>;
  fetchStatistics: () => Promise<void>;
}

export interface HeaderProps {
  currentSession: StudySessionData;
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  changeBackground: (bgImage: string) => void;
  backgroundOptions: string[];
  handleEndSession: (scheduleId: string) => void;
  loading: boolean;
}

export interface MusicControlProps {
  isMusicPlaying: boolean;
  toggleMusic: () => void;
}

export interface NotesSectionProps {
  notes: string;
  saveNotes: (newNotes: string) => void;
}

export interface BackgroundSectionProps {
  bgImage: string;
  timeLeft: number;
}
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string | JSX.Element;
  className?: string;
  loading?: boolean;
}

export interface ProgressBarProps {
  timeLeft: number;
  currentSession:  StudySessionData;
}
export interface ScheduleFormProps {
  newSchedule: Schedule;
  editingSchedule: Schedule | null;
  daysOfWeek: { id: number; label: string }[];
  setNewSchedule: Dispatch<SetStateAction<NewSchedule>>;
  setEditingSchedule: Dispatch<SetStateAction<NewSchedule | null>>;
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
// Define the `ScheduleWithId` type
export type ScheduleWithId = Schedule & {
  id: string;
};

export interface StudySession {
  id: string;
  title: string;
  status: string;
  startTime: string;
  duration: number;
}
export interface StudyStatistics {
  totalMinutesStudied: number;
  totalSessionsCompleted: number;
  longestSessionDuration: number;
  averageSessionDuration: number;
  currentStreak: number;
  longestStreak: number;
}

export interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  bgColor?: string;
}

export interface StudySessionData {
  id: string;
  startTime: string;
  endTime: string;
  lastCheckIn: string;
  duration: number;
  status: "active" | "completed" | "paused"; 
}
