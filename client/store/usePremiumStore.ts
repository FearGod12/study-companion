import { PremiumStore } from "@/interfaces";
import { subscribeToPremium } from "@/services/premiumService";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

const usePremiumStore = create<PremiumStore>((set) => ({
  isSubscribed: false,
  loading: false,
  error: null,

  goPremium: async () => {
    set({ loading: true, error: null });

    try {
      const url = await subscribeToPremium();
      window.location.href = url;
      set({ isSubscribed: true, loading: false });
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
}));

export default usePremiumStore;
