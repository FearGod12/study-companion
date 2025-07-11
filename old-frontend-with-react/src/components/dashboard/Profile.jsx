import { useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { FaTimes, FaUserCircle } from "react-icons/fa";
import useUser from "../../hooks/useUser";

const Profile = () => {
  const { user, loading, handleFileChange, handleAvatarUpdate } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(!isModalOpen);

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <FaSpinner className="animate-spin text-gray-500" size={24} />
        <p className="ml-2 p-6">Loading user data...</p>
      </div>
    );

  return (
    <div className="flex py-4 px-4 lg:justify-start md:justify-start justify-center w-full">
      {user ? (
        <div className="flex flex-col lg:flex-row md:flex-row gap-6 w-full">
          {/* Left Section: Greeting and Text */}
          <div className="flex flex-col justify-center lg:items-start  md:items-start items-center w-full lg:w-1/2 md:w-1/2">
            <h1 className="lg:text-3xl md:text-3xl text-2xl font-bold">
              Hi, {user.firstName}
            </h1>
            <p className="lg:text-lg mt-2">
              Ready to start your day with some learning?
            </p>
          </div>

          {/* Right Section: Profile Image and Update Button */}
          <div className="flex flex-col items-center lg:w-1/2 md:w-1/2">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="User Avatar"
                className="rounded-full lg:w-60 lg:h-40 md:w-56 md:h-40 w-48 h-48 object-cover"
              />
            ) : (
              <FaUserCircle size={70} />
            )}
            <button
              onClick={toggleModal}
              className="mt-4 p-2 rounded-md bg-secondary text-white hover:bg-pink-800 w-32"
            >
              Update Avatar
            </button>
          </div>
        </div>
      ) : (
        <p>No user data available.</p>
      )}

      {/* Avatar Update Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={toggleModal}
        >
          <div
            className="bg-white rounded-lg p-6 w-80 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-4 w-full text-sm"
            />
            <button
              onClick={handleAvatarUpdate}
              disabled={loading}
              className={`p-2 rounded-md w-full ${
                loading
                  ? "bg-gray-400 text-gray-600"
                  : "bg-secondary text-white hover:bg-pink-800"
              }`}
            >
              {loading ? "Updating..." : "Update"}
            </button>
            <button
              onClick={toggleModal}
              className="mt-4 p-2 rounded-md bg-red-500 hover:bg-red-400 text-gray-100 absolute top-0 right-4"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
