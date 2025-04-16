import React, { ReactElement } from "react";
import useSchedules from "@/hooks/useSchedules";
import ConfirmationModal from "@/components/common/ConfirmModal";
import ScheduleForm from "@/components/schedule/ScheduleForm";
import ScheduleList from "@/components/schedule/ScheduleList";
import Layout from "@/components/layout/main/layout";

const Schedule = () => {
  const {
    isModalOpen,
    modalState,
    handleConfirmAction,
    closeModal,
    loadingAction,
  } = useSchedules();

  return (
    <div className="container max-w-none bg-gray-200 lg:h-screen md:h-screen ">
      <div className="flex flex-col lg:flex-row md:flex-row gap-4 lg:h-screen md:h-screen h-full">
        <ScheduleForm />
        <section className="flex-1 bg-pink-100 py-8 px-6 rounded">
          <ScheduleList />
        </section>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        message={(() => {
          if (!modalState || !modalState.schedule)
            return "Are you sure you want to proceed?";
          if (modalState.action === "delete") {
            return `Are you sure you want to delete "${modalState.schedule.title}"?`;
          } else if (modalState.action === "start") {
            return `Are you sure you want to start "${modalState.schedule.title}"?`;
          }
          return `Edit schedule "${modalState.schedule.title}"?`;
        })()}
        onConfirm={handleConfirmAction}
        onCancel={closeModal}
        isLoading={loadingAction === modalState?.action}
      />
    </div>
  );
};

Schedule.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Schedule;
