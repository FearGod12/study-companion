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

export interface Transaction {
  id?: string;
  amount: number;
  currency: string;
  reference: string;
  createdAt: string;
  invoiceCode: string;
}

export interface PremiumStore {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  goPremium: () => Promise<PremiumResponse>;
  fetchTransactions: () => Promise<void>;
}

export type ScheduleWithId = {
  id: string;
} & Schedule;
