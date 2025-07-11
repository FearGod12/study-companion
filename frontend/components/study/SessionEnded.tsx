import { useRouter } from "next/router";
import { FaCheckCircle } from "react-icons/fa";
import Button from "../common/Button";

const SessionEnded = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-gray-100 px-4 text-center">
      <FaCheckCircle className="text-accent text-6xl mb-4" />
      <h1 className="text-4xl font-bold mb-2">Session Ended</h1>
      <p className="text-lg text-gray-300 mb-6">
        You have ended your session. Great job on your work!
      </p>
      <Button
        onClick={() => router.push("/main")}
        className="px-6 py-3 bg-accent hover:bg-accent/90 transition-all duration-200 text-white rounded-lg"
        text="Back to Schedules"
      />
    </div>
  );
};

export default SessionEnded;
