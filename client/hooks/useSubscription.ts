import { useState } from "react";
import { getpremiumService } from "../services/apiService";

const useSubscription = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPremium = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getpremiumService();
      if (result.success) {
        window.location.href = result.url;
      } else {
        setError("Failed to generate subscription URL.");
      }
    } catch (err) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, fetchPremium };
};

export default useSubscription;
