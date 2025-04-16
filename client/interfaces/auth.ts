import { FormValues } from "./user";

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

export interface AuthStore {
  user: UserData | null;
  isAuthenticated: boolean;
  emailForVerification: string | null;
  loading: boolean;
  error: string | null;
  register: (userData: FormValues) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logoutUser: () => void;
  fetchUserData: () => Promise<void>;
  verifyEmail: (email: string, token: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (
    token: string,
    password: string,
    confirmPassword: string,
    email: string
  ) => Promise<void>;
  initializeAuth: () => Promise<void>;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
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
