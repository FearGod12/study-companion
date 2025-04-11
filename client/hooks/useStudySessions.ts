"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useSessionStore } from "@/store/useSessionStore";

const useStudySessions = () => {
  const router = useRouter();
  const { loading, endSession, startSession, currentSession } = useSessionStore();

  const [hasMounted, setHasMounted] = useState(false); // Hydration guard
  const [timeLeft, setTimeLeft] = useState(0);
  const [notes, setNotes] = useState("");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);

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
    const duration = currentSession.duration * 60; // in seconds
    const elapsed = Math.floor((Date.now() - start) / 1000);
    const remaining = duration - elapsed;

    setTimeLeft(Math.max(remaining, 0));
  }, [currentSession, hasMounted]);

  // Countdown logic
  useEffect(() => {
    if (!timeLeft) return;
    const interval = setInterval(() => setTimeLeft((prev) => Math.max(prev - 1, 0)), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Music toggle
  const toggleMusic = () => {
    setIsMusicPlaying((prev) => !prev);
    const audio = new Audio("/ambient-music.mp3");
    audio.loop = true;

    if (!isMusicPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  // Toggle show/hide progress bar
  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  // Start session (manual start from schedule card)
  const handleStartSession = async (schedule) => {
    const { id } = schedule;
    try {
      await startSession(id);
      router.push(`/study/${id}`);
    } catch (error) {
      console.error("Failed to start session:", error);
      toast.error("Failed to start session");
    }
  };

  // End session
  const handleEndSession = async (scheduleId: string) => {
    try {
      await endSession(scheduleId);
      toast.success("Session ended successfully!");
      router.push("/main");
    } catch (error) {
      console.error("Failed to end session:", error);
      toast.error("Failed to end session.");
    }
  };

  // Background image switch
  const changeBackground = (bgImage: string) => {
    setBgImage(bgImage);
  };

  const saveNotes = (newNotes: string) => {
    setNotes(newNotes);
  };

  return {
    timeLeft,
    bgImage,
    isMusicPlaying,
    toggleMusic,
    notes,
    saveNotes,
    changeBackground,
    handleStartSession, 
    handleEndSession,
    loading,
    hasMounted,
    showMenu, 
    toggleMenu,
  };
};

export default useStudySessions;
