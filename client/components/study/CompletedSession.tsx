import { useRouter } from "next/router";
import Button from "../common/Button";

const CompletedSession = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-gray-100">
      <h1 className="text-3xl font-bold mb-4">Session Completed!</h1>
      <p className="text-lg mb-6">You did amazing work today </p>
      <div className="flex gap-4">
        <Button
          onClick={() => router.push("/main")}
          className="px-6 py-3 bg-green-500 text-white rounded-lg"
          text="Back to Dashboard"
        />
      </div>
    </div>
  );
};

export default CompletedSession;
