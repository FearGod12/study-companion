import { PremiumStore } from '@/interfaces/interface';
import { subscribeToPremium } from '@/services/premium';
import { create } from 'zustand';

const usePremiumStore = create<PremiumStore>((set) => ({
  isSubscribed: false, 
  loading: false,      
  error: null,         

  // Action to subscribe to premium service
  subscribeToPremium: async () => {
    set({ loading: true, error: null });

    try {
      const data = await subscribeToPremium();
      set({ isSubscribed: data.success, loading: false });
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));

export default usePremiumStore;
