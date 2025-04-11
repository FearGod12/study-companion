import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/layout/study/Header";
import useStudySessions from "@/hooks/useStudySessions";
import BackgroundSection from "./BackgroundSection";
import CompletedSession from "./CompletedSession";
import ProgressBar from "./ProgressBar";
import { useSessionStore } from "@/store/useSessionStore";
import MusicControl from "./MusicControl";
import NotesSection from "./NotesSection";

const Study = () => {
  const router = useRouter();
  const { id } = router.query;

 // Use the Zustand session store
  const { currentSession, loading, startSession} = useSessionStore();

  const {
    timeLeft,
    bgImage,
    changeBackground,
    handleEndSession,
    isMusicPlaying,
    toggleMusic,
    notes,
    saveNotes,
  } = useStudySessions();

  const [showMenu, setShowMenu] = useState(false);
  const [showProgress, setShowProgress] = useState(true);

  useEffect(() => {
    if (id && !currentSession) {
      startSession(id as string);
    }
  }, [id, startSession, currentSession]);

  if (loading) return <p className="text-center p-4">Loading session...</p>;

  if (timeLeft === 0) {
    return <CompletedSession />;
  }

  return (
    <div className="container max-w-none flex flex-col items-end h-screen w-screen font-inria-sans">
      <Header
        currentSession={currentSession}
        handleEndSession={handleEndSession}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        changeBackground={changeBackground}
        backgroundOptions={[
          "/images/bg-1.jpg",
          "/images/bg.jpeg",
          "/images/bg-2.jpg",
        ]}
        loading={loading}
      />
      <BackgroundSection bgImage={bgImage || "/images/bg-1.jpg"} timeLeft={timeLeft} />
      {showProgress && (
        <ProgressBar
          timeLeft={timeLeft}
          currentSession={currentSession}
          showProgress={showProgress}
          setShowProgress={setShowProgress}
        />
      )}

      {/* Add Music Control */}
      <MusicControl isMusicPlaying={isMusicPlaying} toggleMusic={toggleMusic} />

      {/* Add Notes Section */}
      <NotesSection notes={notes} saveNotes={saveNotes} />
    </div>
  );
};

export default Study;
