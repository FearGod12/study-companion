import { PasswordState } from "@/interfaces/interface";
import { create } from "zustand";

export const usePasswordStore = create<PasswordState>((set) => ({
  showPassword: {
    password: false,
    confirmPassword: false,
  },
  togglePassword: (field) =>
    set((state) => ({
      showPassword: { ...state.showPassword, [field]: !state.showPassword[field] },
    })),
}));
