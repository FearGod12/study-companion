import { useEffect, useState } from "react";
import axios from "axios";

const StudySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch study sessions
  const fetchSessions = async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/study-sessions?page=${page}&limit=${limit}`);
      if (response.status === 200) {
        setSessions(response.data.data.sessions); // Assuming sessions are in response.data.data.sessions
        setTotalPages(response.data.data.totalPages); // Assuming totalPages is provided
      } else {
        setError("Failed to fetch study sessions.");
      }
    } catch (err) {
      setError("An error occurred while fetching study sessions.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch sessions when the component mounts or the page changes
  useEffect(() => {
    fetchSessions(currentPage);
  }, [currentPage]);

  // Handle page changes
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (loading) {
    return <p>Loading study sessions...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="study-sessions-container p-4">
      <h2 className="text-lg font-bold mb-4">Your Study Sessions</h2>

      {sessions.length > 0 ? (
        <div className="sessions-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="session-card p-4 bg-gray-100 rounded-lg shadow-md"
            >
              <h3 className="font-semibold text-gray-800 mb-2">{session.title}</h3>
              <p className="text-gray-600">
                <strong>Status:</strong> {session.status}
              </p>
              <p className="text-gray-600">
                <strong>Start Time:</strong> {new Date(session.startTime).toLocaleString()}
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

      {/* Pagination Controls */}
      <div className="pagination-controls flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
          }`}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StudySessions;
