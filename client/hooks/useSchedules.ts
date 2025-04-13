"use client";

import { useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { Schedule } from "@/interfaces/interface";
import { useScheduleStore } from "@/store/useScheduleStore";
import { formatTitle, formatDate, formatTime } from "@/utils/formatting";
import { createScheduleData, updateScheduleData } from "@/utils/scheduleUtils";
import useStudySessions from "./useStudySessions";
import { useAuthStore } from "@/store/useAuthStore";

const useSchedules = () => {
  const {
    schedules,
    loading,
    retrieved,
    newSchedule,
    editingSchedule,
    modalState,
    createSchedule,
    retrieveSchedules,
    updateSchedule,
    deleteSchedule,
    setNewSchedule,
    setEditingSchedule,
    setModalState,
    closeModal,
  } = useScheduleStore();

  const { handleStartSession } = useStudySessions();
  const { isAuthenticated, hasHydrated } = useAuthStore();

  const daysOfWeek = useMemo(
    () => [
      { id: 0, label: "Sunday" },
      { id: 1, label: "Monday" },
      { id: 2, label: "Tuesday" },
      { id: 3, label: "Wednesday" },
      { id: 4, label: "Thursday" },
      { id: 5, label: "Friday" },
      { id: 6, label: "Saturday" },
    ],
    []
  );

  const locale = Intl.DateTimeFormat().resolvedOptions().locale || "en-US";
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Fetch schedules when user is authenticated
  useEffect(() => {
    if (hasHydrated && isAuthenticated && !loading && !retrieved) {
      retrieveSchedules();
    }
  }, [hasHydrated, isAuthenticated, loading, retrieved, retrieveSchedules]);

  // Handlers
  const handleCreateSchedule = async () => {
    try {
      const scheduleData = createScheduleData(newSchedule);
      await createSchedule(scheduleData);
      setNewSchedule({
        title: "",
        startDate: "",
        startTime: "",
        duration: 0,
        isRecurring: false,
        recurringDays: [],
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Failed to create schedule: ${error.message}`);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handleUpdateSchedule = async (id: string, payload: Schedule) => {
    try {
      const data = updateScheduleData(payload);
      await updateSchedule(id, data);
      retrieveSchedules();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to update schedule: ${message}`);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      await deleteSchedule(id);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to delete schedule: ${message}`);
    }
  };

  // Modified to correctly handle recurring days
  const toggleRecurringDay = (dayId: number, isEditing: boolean) => {
    if (isEditing) {
      if (!editingSchedule) return;

      const updatedDays = isEditing
        ? [...(editingSchedule?.recurringDays || [])]
        : [...(newSchedule.recurringDays || [])];
      const index = updatedDays.indexOf(dayId);
      if (index !== -1) {
        updatedDays.splice(index, 1);
      } else {
        updatedDays.push(dayId);
      }
      setEditingSchedule({ ...editingSchedule, recurringDays: updatedDays });
    } else {
      const updatedDays = [...newSchedule.recurringDays];
      const index = updatedDays.indexOf(dayId);
      if (index !== -1) {
        updatedDays.splice(index, 1);
      } else {
        updatedDays.push(dayId);
      }
      setNewSchedule({ ...newSchedule, recurringDays: updatedDays });
    }
  };

  const openModal = (
    schedule: Schedule,
    action: "edit" | "delete" | "start"
  ) => {
    setModalState({ isOpen: true, action, schedule });
  };

  const handleConfirmAction = async () => {
    try {
      const { action, schedule } = modalState;
      if (!schedule) return;

      if (action === "edit") {
        setEditingSchedule(schedule);
        toast.success("Editing mode enabled!");
      } else if (action === "delete") {
        await handleDeleteSchedule(schedule.id);
      } else if (action === "start") {
        await handleStartSession(schedule);
      }
    } catch {
      toast.error("An error occurred during the action.");
    }
    closeModal();
  };

  return {
    schedules,
    newSchedule,
    editingSchedule,
    modalState,
    loading,
    daysOfWeek,
    locale,
    timeZone,

    formatTitle,
    formatDate,
    formatTime,

    setNewSchedule,
    setEditingSchedule,

    handleCreateSchedule,
    handleUpdateSchedule,
    handleDeleteSchedule,

    toggleRecurringDay,

    isModalOpen: modalState.isOpen,
    openModal,
    closeModal,
    handleConfirmAction,
  };
};

export default useSchedules;
