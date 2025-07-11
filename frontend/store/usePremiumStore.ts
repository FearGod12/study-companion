import { PremiumStore } from "@/interfaces";
import { subscribeToPremium } from "@/services/premiumService";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { userTransactions } from "@/services/userDataService";

const usePremiumStore = create<PremiumStore>((set) => ({
  transactions: [],
  loading: false,
  error: null,

  goPremium: async () => {
    set({ loading: true, error: null });

    try {
      const url = await subscribeToPremium();
      window.open(url, "_blank");
      set({ loading: false });
      return url;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ error: "Subscription failed", loading: false });
      if (
        error?.response?.status === 401 ||
        (error instanceof Error && error.message.includes("Unauthorized"))
      ) {
        useAuthStore.getState().logoutUser();
      }
    }
  },

  fetchTransactions: async () => {
    set({ loading: true, error: null });

    try {
      const response = await userTransactions();
      set({ transactions: response, loading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ error: "Transaction fetch failed", loading: false });
      if (
        error?.response?.status === 401 ||
        (error instanceof Error && error.message.includes("Unauthorized"))
      ) {
        useAuthStore.getState().logoutUser();
      }
    }
  },
}));

export default usePremiumStore;
