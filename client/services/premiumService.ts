import { handleApiError } from '@/utils/ErrorUtils';
import apiClient from './apiClient'; 

export const subscribeToPremium = async () => {
  try {
    const response = await apiClient.get('/premium/go-premium');
    return response.data.data.subscription_url;
  } catch (error) {
     handleApiError(error);
        throw error;
  }
};

