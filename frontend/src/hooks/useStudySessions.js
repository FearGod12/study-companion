import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  startStudySession,
  endStudySession,
  getStudySessions,
  getStudyStatistics,
} from "../services/api";
import { useNavigate } from "react-router-dom";

const useStudySessions = (initialSessionData = null) => {
  const [sessions, setSessions] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  const [sessionData, setSessionData] = useState(initialSessionData);
  const [timeLeft, setTimeLeft] = useState(() => {
    if (initialSessionData?.startTime && initialSessionData?.duration) {
      const durationInSeconds = initialSessionData.duration * 60;
      const elapsed =
        (Date.now() - new Date(initialSessionData.startTime).getTime()) / 1000;
      return Math.max(durationInSeconds - elapsed, 0);
    }
    return 0;
  });
  const [bgImage, setBgImage] = useState(null);

  // Start session
  const handleStartSession = useCallback(
    async (scheduleId) => {
      try {
        setLoading(true);
        const response = await startStudySession(scheduleId);
        setLoading(false);
        setSessionData(response.data.data);
        toast.success("Reading session started successfully!");
        navigate(`/study/${scheduleId}`, { state: response.data.data });
      } catch (error) {
        setLoading(false);
        toast.error(error.response?.data?.message || "Failed to start session.");
      }
    },
    [navigate]
  );

  // End session
  const handleEndSession = useCallback(async (scheduleId) => {
    try {
      setLoading(true);
      console.log('Requesting to end session for Schedule ID:', scheduleId);
      const response = await endStudySession(scheduleId);
      console.log('end data', response)
      setLoading(false);
      toast.success("Session ended successfully!");
      return response.data; 
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || "Failed to end session.";
      console.error('Error details:', errorMessage);
      toast.error(errorMessage);
    }
  }, []);
  
  // Timer decrement
  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => Math.max(prev - 1, 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeLeft]);

  // Background changer
  const changeBackground = useCallback((newBgImage) => {
    setBgImage(newBgImage);
  }, []);

  const fetchStudySessions = useCallback(
  async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getStudySessions(page, limit);
      setSessions(response.data.sessions || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      setError(error.message || "Failed to fetch study sessions.");
      toast.error(error.message || "Failed to fetch study sessions.");
    } finally {
      setLoading(false);
    }
  },
  []
);

const fetchStudyStatistics = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await getStudyStatistics();
    setStatistics(response.data);
  } catch (error) {
    setError(error.message || "Failed to fetch statistics.");
    toast.error(error.message || "Failed to fetch statistics.");
  } finally {
    setLoading(false);
  }
}, []);

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
    sessionData,
    timeLeft,
    bgImage,
    setCurrentPage,
    handleStartSession,
    handleEndSession,
    changeBackground,
  };
};

export default useStudySessions;
