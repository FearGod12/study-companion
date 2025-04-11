import Header from "@/components/layout/study/Header";
import useStudySessions from "@/hooks/useStudySessions";
import { useSessionStore } from "@/store/useSessionStore";
import BackgroundSection from "@/components/common/study/BackgroundSection";
import CompletedSession from "@/components/common/study/CompletedSession";
import ProgressBar from "@/components/common/study/ProgressBar";

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

  if (!hasMounted) return null;
  if (loading) return <p className="h-screen w-screen text-center p-4">Loading session...</p>;
  if (!currentSession) return <p className="text-center p-4">No active session found.</p>;
  if (timeLeft === 0) return <CompletedSession />;

  return (
    <div className="container max-w-none flex flex-col items-end h-screen w-screen font-inria-sans">
      <Header
        currentSession={currentSession}
        handleEndSession={handleEndSession}
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

        <ProgressBar
          timeLeft={timeLeft}
          currentSession={currentSession}
        />
    </div>
  );
};

export default Study;
