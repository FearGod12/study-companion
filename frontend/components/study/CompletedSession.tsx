import { useRouter } from "next/router";
import { FaCheckCircle } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import Button from "../common/Button";

const CompletedSession = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-gray-100 px-4 text-center">
      <FaCheckCircle className="text-accent text-6xl mb-4" />
      <h1 className="text-4xl font-bold mb-2">Session Completed!</h1>
      <p className="text-lg text-gray-300 mb-6 flex items-center gap-2">
        <BsStars className="text-yellow-400 text-xl" />
        You did amazing work today!
      </p>
      <Button
        onClick={() => router.push("/main/schedule")}
        className="px-6 py-3 bg-accent hover:bg-accent/90 transition-all duration-200 text-white rounded-lg"
        text="Back to Schedules"
      />
    </div>
  );
};

export default CompletedSession;
