import React from "react";
import useSchedules from "@/hooks/useSchedules"; // Updated import to use correct hook path
import ConfirmationModal from "@/components/common/ConfirmModal";
import ScheduleForm from "@/components/schedule/ScheduleForm";
import ScheduleList from "@/components/schedule/ScheduleList";

const Schedule = () => {
  const { isModalOpen, modalState, handleConfirmAction, closeModal } = useSchedules();

  return (
    <div className="container max-w-none bg-gray-200 lg:h-screen md:h-screen">
      <div className="flex flex-col lg:flex-row md:flex-row gap-8 h-screen">
        <ScheduleForm />

        <section className="flex-1 bg-pink-100 py-8 px-6 rounded">
          <ScheduleList />
        </section>
      </div>
      <ConfirmationModal
  isOpen={isModalOpen}
  message={
    (() => {
      if (!modalState || !modalState.schedule) return "Are you sure you want to proceed?";
      if (modalState.action === "delete") {
        return `Are you sure you want to delete "${modalState.schedule.title}"?`;
      }
      return `Edit schedule "${modalState.schedule.title}"?`;
    })()
  }
  onConfirm={handleConfirmAction}
  onCancel={closeModal}
/>

    </div>
  );
};

export default Schedule;
