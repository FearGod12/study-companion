"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useSessionStore } from "@/store/useSessionStore";
import { Schedule } from "@/interfaces";
import { useScheduleStore } from "@/store/useScheduleStore";

const useStudySessions = () => {
  const router = useRouter();
  const { loading, endSession, startSession, currentSession } =
    useSessionStore();
  const { retrieveSchedules } = useScheduleStore();
  const [hasMounted, setHasMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [loadingStart, setLoadingStart] = useState(false);

  // Hydration-safe mount check
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Safely extract ID from URL only after router is ready
  useEffect(() => {
    if (!router.isReady) return;

    const { id } = router.query;
    if (!id || typeof id !== "string" || currentSession) return;

    startSession(id);
  }, [router.isReady, router.query, startSession, currentSession]);

  // Set initial timeLeft based on session info
  useEffect(() => {
    if (!hasMounted || !currentSession) return;

    const start = new Date(currentSession.startTime).getTime();
    const duration = currentSession.duration * 60;
    const elapsed = Math.floor((Date.now() - start) / 1000);
    const remaining = duration - elapsed;

    setTimeLeft(Math.max(remaining, 0));
  }, [currentSession, hasMounted]);

  // Countdown logic
  useEffect(() => {
    if (timeLeft <= 0 || !currentSession) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, currentSession]);

  // Toggle show/hide progress bar
  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  // Start session (manual start from schedule card)
  const handleStartSession = async (schedule: Schedule) => {
    setLoadingStart(true);
    const { id } = schedule;
    try {
      await startSession(id);
      router.push(`/study/${id}`);
    } catch (error) {
      console.error("Failed to start session:", error);
      toast.error("Failed to start session");
    } finally {
      setLoadingStart(false);
    }
  };

  // End session
  const handleEndSession = async (scheduleId: string) => {
    try {
      await endSession(scheduleId);
      retrieveSchedules();
    } catch (error) {
      console.error("Failed to end session:", error);
      toast.error("Failed to end session.");
    }
  };

  // Background image switch
  const changeBackground = (bgImage: string) => {
    setBgImage(bgImage);
  };

  return {
    timeLeft,
    bgImage,
    changeBackground,
    handleStartSession,
    handleEndSession,
    loading,
    hasMounted,
    showMenu,
    toggleMenu,
    loadingStart,
  };
};

export default useStudySessions;
