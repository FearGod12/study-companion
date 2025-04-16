import { Schedule } from "./schedule";

export interface PasswordState {
  showPassword: { [key: string]: boolean };
  togglePassword: (field: string) => void;
}

export interface Quote {
  text: string;
  author: string;
}

export interface PremiumResponse {
  success: boolean;
}

export interface PremiumStore {
  isSubscribed: boolean;
  loading: boolean;
  error: string | null;
  goPremium: () => Promise<PremiumResponse>;
}

export type ScheduleWithId = {
  id: string;
} & Schedule;
