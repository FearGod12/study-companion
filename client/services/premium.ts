import apiClient from './apiClient'; 

// Function to subscribe to premium service
export const subscribeToPremium = async () => {
  try {
    const response = await apiClient.get('/premium/go-premium');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Subscription failed');
  }
};

