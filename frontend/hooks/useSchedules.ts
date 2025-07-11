"use client";

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Schedule, ScheduleUtils } from "@/interfaces";
import { useScheduleStore } from "@/store/useScheduleStore";
import {
  formatTitle,
  formatDate,
  formatTime,
} from "@/utils/scheduleFormatting";
import { createScheduleData, updateScheduleData } from "@/utils/scheduleUtils";
import useStudySessions from "./useStudySessions";
import { useModalStore } from "@/store/useModalStore"; // Import the modal store

const useSchedules = () => {
  const {
    schedules,
    loading,
    newSchedule,
    editingSchedule,
    createSchedule,
    retrieveSchedules,
    updateSchedule,
    deleteSchedule,
    setNewSchedule,
    setEditingSchedule,
  } = useScheduleStore();

  const { openModal, closeModal, modalState } = useModalStore(); // Access the modal store

  const { handleStartSession } = useStudySessions();

  const [loadingAction, setLoadingAction] = useState<string | null>(null);
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

  // Handlers
  const handleCreateSchedule = async () => {
    setLoadingAction("create");
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
    } finally {
      setLoadingAction(null);
    }
  };

  const handleUpdateSchedule = async (id: string, payload: ScheduleUtils) => {
    setLoadingAction("update");
    try {
      const data = updateScheduleData(payload);
      await updateSchedule(id, data);
      retrieveSchedules();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to update schedule: ${message}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    setLoadingAction("delete");
    try {
      await deleteSchedule(id);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to delete schedule: ${message}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const toggleRecurringDay = (dayId: number, isEditing: boolean) => {
    const toggle = (days: number[]) =>
      days.includes(dayId)
        ? days.filter((id) => id !== dayId)
        : [...days, dayId];

    if (isEditing && editingSchedule?.isRecurring) {
      const updatedSchedule = {
        ...editingSchedule,
        recurringDays: toggle(editingSchedule.recurringDays),
      };
      setEditingSchedule(updatedSchedule);
    } else if (newSchedule.isRecurring) {
      const updatedSchedule = {
        ...newSchedule,
        recurringDays: toggle(newSchedule.recurringDays),
      };
      setNewSchedule(updatedSchedule);
    }
  };

  // Use the modal store's openModal function instead of setModalState
  const openModalHandler = (
    schedule: Schedule,
    action: "edit" | "delete" | "start"
  ) => {
    openModal(schedule, action); // Open modal through the modal store
  };

  // Use modal state directly from the modal store
  const handleConfirmAction = async () => {
    try {
      const { action, schedule } = modalState;
      if (!schedule) return;

      if (action === "edit") {
        const normalizedRecurringDays = (schedule.recurringDays ?? []).map(
          (d: number | { dayOfWeek: number }) =>
            typeof d === "number" ? d : d.dayOfWeek
        );

        setEditingSchedule({
          ...schedule,
          recurringDays: normalizedRecurringDays,
        });
        toast.success("Editing mode enabled!");
      } else if (action === "delete") {
        await handleDeleteSchedule(schedule.id);
      } else if (action === "start") {
        await handleStartSession(schedule);
      }
    } catch {
      toast.error("An error occurred during the action.");
    }
    closeModal(); // Close modal after the action is complete
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

    loadingAction,
    isModalOpen: modalState.isOpen, // Use modal state directly
    openModal: openModalHandler, // Call the openModal handler instead of setModalState
    closeModal,
    handleConfirmAction,
  };
};

export default useSchedules;
