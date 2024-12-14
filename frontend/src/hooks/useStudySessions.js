import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { getStudySessions, getStudyStatistics } from "../services/api";

const useStudySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch study sessions
  const fetchStudySessions = useCallback(
    async (page = 1, limit = 10) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getStudySessions(page, limit);
        setSessions(response.data.sessions || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        const errorMessage = err.message || "Failed to fetch study sessions.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Fetch study statistics
  const fetchStudyStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getStudyStatistics();
      setStatistics(response.data);
    } catch (err) {
      const errorMessage = err.message || "Failed to fetch statistics.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data when currentPage changes
  useEffect(() => {
    fetchStudySessions(currentPage);
  }, [currentPage, fetchStudySessions]);

  return {
    sessions,
    statistics,
    currentPage,
    totalPages,
    loading,
    error,
    fetchStudySessions,
    fetchStudyStatistics,
    setCurrentPage,
  };
};

export default useStudySessions;
