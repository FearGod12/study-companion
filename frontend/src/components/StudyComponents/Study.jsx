import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import study from "../../assets/Image/bg-1.jpg";
import bgImage1 from "../../assets/Image/bg.jpeg";
import bgImage2 from "../../assets/Image/bg-2.jpg";
import useStudySessions from "../../hooks/useStudySessions";
import Header from "./Header";
import BackgroundSection from "./BackgroundSection";
import ProgressBar from "./ProgressBar";
import CompletedSession from "./CompletedSession";

const Study = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialSessionData = location.state || null;

  const {
    sessionData,
    timeLeft,
    bgImage,
    changeBackground,
    handleEndSession,
    loading,
  } = useStudySessions(initialSessionData);

  const [showMenu, setShowMenu] = useState(false);
  const [showProgress, setShowProgress] = useState(true);

  if (!sessionData) {
    return <p className="text-center p-4">Loading session details...</p>;
  }

  if (timeLeft === 0) {
    return <CompletedSession navigate={navigate} />;
  }

  return (
    <div className="container max-w-none flex flex-col items-end h-screen w-screen font-inria-sans">
      <Header
        sessionData={sessionData}
        handleEndSession={ handleEndSession}
        
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        changeBackground={changeBackground}
        backgroundOptions={[study, bgImage1, bgImage2]}
        handleEnd={() => handleEndSession("testScheduleId123")}
        loading={loading}
        navigate={navigate}
      />
      <BackgroundSection bgImage={bgImage || study}  timeLeft={timeLeft}/>
      {showProgress && (
        <ProgressBar
          timeLeft={timeLeft}
          duration={sessionData.duration}
          showProgress={showProgress}
          setShowProgress={setShowProgress}
        />
      )}
    </div>
  );
};

export default Study;
