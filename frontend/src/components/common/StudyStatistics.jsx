import { useEffect } from "react";
import useStudySessions from "../../hooks/useStudySessions";
import Loading from "./Loading";
import { FaClock, FaCalendarAlt, FaFire, FaTrophy } from "react-icons/fa";
import PropTypes from "prop-types";

const StudyStatistics = () => {
  const {
    statistics,
    loading,
    error,
    fetchStudyStatistics,
  } = useStudySessions();

  useEffect(() => {
    fetchStudyStatistics();
  }, [fetchStudyStatistics]);

  if (loading)
    return (
      <div className="container max-w-none h-screen w-screen flex items-center justify-center">
        <Loading />
      </div>
    );

  if (error)
    return (
      <div className="container max-w-none h-screen w-screen flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );

  return (
    <div className="p-2">
      {statistics && (
        <div className="grid lg:gap-6 gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          <StatCard
            icon={<FaClock className="text-gray-100 lg:size-8 size-4" />}
            label="Total Minutes Studied"
            value={`${statistics.totalMinutesStudied} min`}
            bgColor="bg-blue-500"
          />
          <StatCard
            icon={<FaCalendarAlt  className="text-gray-100 lg:size-8 size-4" />}
            label="Total Sessions Complete"
            value={statistics.totalSessionsCompleted}
            bgColor="bg-green-500"
          />
          <StatCard
            icon={<FaTrophy  className="text-gray-100 lg:size-8 size-4" />}
            label="Longest Session Duration"
            value={`${statistics.longestSessionDuration} min`}
            bgColor="bg-yellow-500"
          />
          <StatCard
            icon={<FaClock  className="text-gray-100 lg:size-8 size-4" />}
            label="Average Session Duration"
            value={`${statistics.averageSessionDuration?.toFixed(1) || 0} min`}
            bgColor="bg-indigo-500"
          />
          <StatCard
            icon={<FaFire  className="text-gray-100 lg:size-8 size-4" />}
            label="Current Streak"
            value={statistics.currentStreak}
            bgColor="bg-red-500"
          />
          <StatCard
            icon={<FaTrophy  className="text-gray-100 lg:size-8 size-4" />}
            label="Longest Streak"
            value={statistics.longestStreak}
            bgColor="bg-orange-500"
          />
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, bgColor }) => (
  <div
    className={`flex items-center justify-between p-2 rounded-lg shadow-md ${bgColor} text-gray-100 text-sm`}
  >
    <div className="flex items-center gap-4">
      <div className="rounded-full bg-gray-100/20">{icon}</div>
      <div>
        <h3 className="text-sm font-semibold flex flex-wrap ">{label}</h3>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

StatCard.propTypes = {
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  bgColor: PropTypes.string.isRequired,
};

export default StudyStatistics;
