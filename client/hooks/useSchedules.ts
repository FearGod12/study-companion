"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { FilterOptions, NewSchedule, Schedule } from "@/interfaces/interface";
import { useScheduleStore } from "@/store/useScheduleStore";
import { formatTitle, formatDate, formatTime } from "@/utils/formatting";
import { prepareScheduleData } from "@/utils/scheduleUtils";

// Helper function for updating recurring days
const updateRecurringDays = (schedule: Schedule, dayId: number) => {
  const isSelected = schedule.recurringDays.includes(dayId);
  return {
    ...schedule,
    recurringDays: isSelected
      ? schedule.recurringDays.filter((id) => id !== dayId)
      : [...schedule.recurringDays, dayId],
  };
};

const useSchedules = () => {
  // Access Zustand store for global state
  const {
    schedules,
    retrieved,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  } = useScheduleStore();
  const loading = useScheduleStore((state) => state.loading);
  const retrieveSchedules = useScheduleStore((state) => state.retrieveSchedules);

  // Local state for managing form, modal, and filters
  const [newSchedule, setNewSchedule] = useState<NewSchedule>({
    title: "",
    startDate: "",
    startTime: "",
    duration: 0,
    isRecurring: false,
    recurringDays: [],
  });

  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const modalState = useScheduleStore((state) => state.modalState);
  const setModalState = useScheduleStore((state) => state.setModalState);
  const closeModal = useScheduleStore((state) => state.closeModal);
  

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    startDate: "",
    endDate: "",
    isRecurring: null,
  });

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

  const [locale, setLocale] = useState<string>("en-US");
  const [timeZone, setTimeZone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  // Fetch schedules
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        if (!loading && !retrieved) { // Check the retrieved flag
          await retrieveSchedules();
        }
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };
  
    fetchSchedules();
  }, [loading, retrieved, retrieveSchedules]);

  // Filtered and searched schedules
  const filteredSchedules = useMemo(
    () =>
      schedules.filter((schedule) => {
        const matchesSearch = searchQuery
          ? schedule.title.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
        const matchesStartDate = filterOptions.startDate
          ? new Date(schedule.startDate) >= new Date(filterOptions.startDate)
          : true;
        const matchesEndDate = filterOptions.endDate
          ? new Date(schedule.startDate) <= new Date(filterOptions.endDate)
          : true;
        const matchesRecurring =
          filterOptions.isRecurring !== null
            ? schedule.isRecurring === filterOptions.isRecurring
            : true;
        return (
          matchesSearch && matchesStartDate && matchesEndDate && matchesRecurring
        );
      }),
    [schedules, searchQuery, filterOptions]
  );

  // Handle creating, updating, and deleting schedules
  const handleCreateSchedule = async () => {
    try {
      const scheduleData = prepareScheduleData(newSchedule);
      await createSchedule(scheduleData);
      setNewSchedule({
        title: "",
        startDate: "",
        startTime: "",
        duration: 0,
        isRecurring: false,
        recurringDays: [],
      });
    } catch (error: any) {
      toast.error(
        `Failed to create schedule: ${
          error.response?.data?.message ?? "Unknown error"
        }`
      );
    }
  };

  const handleUpdateSchedule = async (
    id: string,
    payload: Partial<Schedule>
  ) => {
    try {
      const scheduleData = prepareScheduleData(payload as NewSchedule);
      await updateSchedule(id, scheduleData as Schedule);
    } catch (error: any) {
      toast.error(
        `Failed to update schedule: ${
          error.response?.data?.message ?? "Unknown error"
        }`
      );
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      await deleteSchedule(id);
    } catch (error: any) {
      toast.error(
        `Failed to delete schedule: ${
          error.response?.data?.message || "Unknown error"
        }`
      );
    }
  };

  // Modal handling logic
  const openModal = (schedule: Schedule, action: "edit" | "delete") => {
    setModalState({ isOpen: true, action, schedule });
  };

  const handleConfirmAction = async () => {
    try {
      if (modalState.action === "edit") {
        setEditingSchedule(modalState.schedule);
        toast.success("Editing mode enabled!");
      } else if (modalState.action === "delete") {
        await handleDeleteSchedule(modalState.schedule!.id);
      }
    } catch (error) {
      toast.error("An error occurred during the action.");
    }
    closeModal();
  };

  const toggleRecurringDay = (dayId: number, isEditing: boolean) => {
    if (isEditing && editingSchedule) {
      setEditingSchedule(updateRecurringDays(editingSchedule, dayId));
    } else {
      setNewSchedule(updateRecurringDays(newSchedule, dayId));
    }
  };

  return {
    schedules: filteredSchedules,
    newSchedule,
    editingSchedule,
    loading,
    daysOfWeek,
    formatTitle,
    formatDate,
    formatTime,
    locale,
    timeZone,
    searchQuery,
    filterOptions,
    setNewSchedule,
    setEditingSchedule,
    setLocale,
    setTimeZone,
    setSearchQuery,
    setFilterOptions,
    handleCreateSchedule,
    handleUpdateSchedule,
    handleDeleteSchedule,
    toggleRecurringDay,
    isModalOpen: modalState.isOpen,
    openModal,
    closeModal,
    modalState,
    handleConfirmAction,
  };
};

export default useSchedules;