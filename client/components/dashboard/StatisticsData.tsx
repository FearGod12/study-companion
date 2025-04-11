import { useEffect } from "react";
import { FaClock, FaCalendarAlt, FaFire, FaTrophy } from "react-icons/fa";
import { useSessionStore } from "@/store/useSessionStore";
import Loading from "../common/Loading";
import StatCard from "../common/StatCard";


const StudyStatistics = () => {
  const {
      statistics,
      loading,
      error,
      fetchStatistics,
    } = useSessionStore();

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-2">
        <Loading />
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 p-4">
        Error: {error}
      </div>
    );

  return (
    <div className="p-4 font-inria-sans">
      {statistics && (
        <div className="grid lg:gap-6 gap-3 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 ">
          <StatCard
            icon={<FaClock className="text-gray-100 size-10" />}
            label="Total Minutes Studied"
            value={`${statistics.totalMinutesStudied} min`}
            bgColor="bg-blue-500"
          />
          <StatCard
            icon={<FaCalendarAlt  className="text-gray-100 size-10" />}
            label="Total Sessions Complete"
            value={statistics.totalSessionsCompleted}
            bgColor="bg-green-500"
          />
          <StatCard
            icon={<FaTrophy  className="text-gray-100 size-10" />}
            label="Longest Session Duration"
            value={`${statistics.longestSessionDuration} min`}
            bgColor="bg-yellow-500"
          />
          <StatCard
            icon={<FaClock  className="text-gray-100 size-10" />}
            label="Average Session Duration"
            value={`${statistics.averageSessionDuration?.toFixed(1) || 0} min`}
            bgColor="bg-indigo-500"
          />
          <StatCard
            icon={<FaFire  className="text-gray-100 size-10" />}
            label="Current Streak"
            value={statistics.currentStreak}
            bgColor="bg-red-500"
          />
          <StatCard
            icon={<FaTrophy  className="text-gray-100 size-10" />}
            label="Longest Streak"
            value={statistics.longestStreak}
            bgColor="bg-orange-500"
          />
        </div>
      )}
    </div>
  );
};



export default StudyStatistics;
