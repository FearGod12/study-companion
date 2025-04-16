import Header from "@/components/layout/study/Header";
import useStudySessions from "@/hooks/useStudySessions";
import { useSessionStore } from "@/store/useSessionStore";
import BackgroundSection from "@/components/study/BackgroundSection";
import CompletedSession from "@/components/study/CompletedSession";
import ProgressBar from "@/components/study/ProgressBar";
import { NotificationPopup } from "@/components/notifications/NotificationPopup";
import { useSocketSessionStore } from "@/store/useSocketSessionStore";
import SessionEnded from "@/components/study/SessionEnded";
import { useState } from "react";

const Study = () => {
  const {
    timeLeft,
    bgImage,
    changeBackground,
    handleEndSession,
    hasMounted,
    loading,
    showMenu,
    toggleMenu,
  } = useStudySessions();

  const { currentSession } = useSessionStore();
  const { notification, sendCheckInResponse } = useSocketSessionStore();
  const [sessionEnded, setSessionEnded] = useState(false);

  const handleEndSessionWithMessage = (scheduleId: string) => {
    handleEndSession(scheduleId);
    setSessionEnded(true);
  };

  if (!hasMounted) return null;
  if (loading)
    return (
      <p className="h-screen w-screen text-center p-4">Loading session...</p>
    );
  if (!currentSession)
    return <p className="text-center p-4">No active session found.</p>;
  const hasSessionStarted =
    currentSession?.startTime &&
    new Date() >= new Date(currentSession.startTime);

  if (timeLeft === 0 && hasSessionStarted) {
    return <CompletedSession />;
  }

  if (sessionEnded) {
    return <SessionEnded />;
  }
  const handleNotificationResponse = (response: boolean) => {
    sendCheckInResponse(notification?.id || "", response);
  };

  return (
    <div className="container max-w-none flex flex-col items-end max-h-screen">
      <Header
        currentSession={currentSession}
        handleEndSession={handleEndSessionWithMessage}
        showMenu={showMenu}
        setShowMenu={toggleMenu}
        changeBackground={changeBackground}
        backgroundOptions={[
          "/image/bg-1.jpg",
          "/image/bg.jpeg",
          "/image/bg-2.jpg",
        ]}
        loading={loading}
      />

      <BackgroundSection
        bgImage={bgImage || "/image/bg-1.jpg"}
        timeLeft={timeLeft}
      />

      <ProgressBar timeLeft={timeLeft} currentSession={currentSession} />

      {notification && (
        <NotificationPopup
          message={notification.message}
          onRespond={handleNotificationResponse}
          timeout={120}
        />
      )}
    </div>
  );
};

export default Study;
