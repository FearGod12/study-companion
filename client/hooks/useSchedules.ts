"use client";

import { useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { Schedule, NewSchedule } from "@/interfaces/interface";
import { useScheduleStore } from "@/store/useScheduleStore";
import { formatTitle, formatDate, formatTime } from "@/utils/formatting";
import { prepareScheduleData } from "@/utils/scheduleUtils";
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
      const data = prepareScheduleData(newSchedule);
      await createSchedule(data);
      setNewSchedule({
        title: "",
        startDate: "",
        startTime: "",
        duration: 0,
        isRecurring: false,
        recurringDays: [],
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to create schedule: ${message}`);
    }
    
  };

  const handleUpdateSchedule = async (id: string, payload: Partial<Schedule>) => {
    try {
      const data = prepareScheduleData(payload as Schedule);
      await updateSchedule(id, data);
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

  const toggleRecurringDay = (dayId: number, isEditing: boolean) => {
    const schedule = isEditing ? editingSchedule : newSchedule;
    if (!schedule) return;

    const isSelected = schedule.recurringDays.includes(dayId);
    const updatedDays = isSelected
      ? schedule.recurringDays.filter((id) => id !== dayId)
      : [...schedule.recurringDays, dayId];

    const updatedSchedule = { ...schedule, recurringDays: updatedDays };

    isEditing ? setEditingSchedule(updatedSchedule) : setNewSchedule(updatedSchedule);
  };

  const openModal = (schedule: Schedule, action: "edit" | "delete" | "start") => {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("An error occurred during the action.");
    }
    closeModal();
  };

  return {
    // State
    schedules,
    newSchedule,
    editingSchedule,
    modalState,
    loading,
    daysOfWeek,
    locale,
    timeZone,

    // Formatters
    formatTitle,
    formatDate,
    formatTime,

    // Setters
    setNewSchedule,
    setEditingSchedule,

    // CRUD Handlers
    handleCreateSchedule,
    handleUpdateSchedule,
    handleDeleteSchedule,

    // Recurrence
    toggleRecurringDay,

    // Modal
    isModalOpen: modalState.isOpen,
    openModal,
    closeModal,
    handleConfirmAction,
  };
};

export default useSchedules;
