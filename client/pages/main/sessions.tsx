import { ReactElement, useEffect, useState } from "react";
import { useSessionStore } from "@/store/useSessionStore";
import Loading from "@/components/common/Loading";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import Layout from "@/components/layout/main/layout";
import withAuth from "@/hoc/withAuth";

const Sessions = () => {
  const {
    studySessions,
    statistics,
    loading,
    error,
    fetchSessions,
    fetchStatistics,
  } = useSessionStore();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 5; 

  useEffect(() => {
    fetchSessions(currentPage);
  }, [currentPage, fetchSessions]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  if (loading) {
    return (
      <div className="container max-w-none h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <p className="container max-w-none h-screen flex items-center justify-center">
        Error: {error}
      </p>
    );
  }

  return (
    <div className="p-6 mt-12 h-full min-h-screen">
      <h2 className="text-lg font-bold text-accent text-pretty mb-4">
        Study Statistics
      </h2>

      {statistics && (
        <div className="mb-8 bg-accent p-4 text-gray-100 rounded">
          <p className="pt-2">
            Total Minutes Studied:{" "}
            <strong>{statistics.totalMinutesStudied}</strong>
          </p>
          <p className="pt-2">
            Total Sessions Completed:{" "}
            <strong>{statistics.totalSessionsCompleted}</strong>
          </p>
          <p className="pt-2">
            Longest Session Duration:{" "}
            <strong>{statistics.longestSessionDuration} minutes</strong>
          </p>
          <p className="pt-2">
            Average Session Duration:{" "}
            <strong>
              {statistics.averageSessionDuration?.toFixed(1) || 0} minutes
            </strong>
          </p>
          <p className="pt-2">
            Current Streak: <strong>{statistics.currentStreak}</strong>
          </p>
          <p className="pt-2">
            Longest Streak: <strong>{statistics.longestStreak}</strong>
          </p>
        </div>
      )}

      <h2 className="text-lg font-bold text-accent text-pretty mb-4">
        Study Sessions
      </h2>

      {studySessions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {studySessions.map((session) => (
            <div
              key={session.id}
              className="p-4 bg-gray-100 rounded-lg shadow-md"
            >
              <h3 className="font-semibold text-gray-800 mb-2">
                {session.title}
              </h3>
              <p className="text-gray-600">
                <strong>Status:</strong> {session.status}
              </p>
              <p className="text-gray-600">
                <strong>Start Time:</strong>{" "}
                {new Date(session.startTime).toLocaleString()}
              </p>
              <p className="text-gray-600">
                <strong>Duration:</strong> {session.duration} minutes
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No study sessions found.</p>
      )}

      {/* Pagination */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1 ? "bg-gray-300" : "bg-accent text-white"
          }`}
        >
          <FaArrowLeftLong />
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages ? "bg-gray-300" : "bg-accent text-white"
          }`}
        >
          <FaArrowRightLong />
        </button>
      </div>
    </div>
  );
};

Sessions.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default withAuth(Sessions);
