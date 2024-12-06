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
        <div className="flex py-4 px-10 items-center justify-center w-full">
            {user ? (
                <div className="flex lg:flex-row md:flex-row flex-col gap-6 p-2 items-center">
                    {/* Profile Picture Section */}
                    <div className="flex flex-col">
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt="User Avatar"
                                className="rounded-full w-40 h-40 object-cover"
                            />
                        ) : (
                            <FaUserCircle size={70} />
                        )}
                        {/* Open Modal Button */}
                        <button
                            onClick={toggleModal}
                            className="mt-4 p-1 rounded-md bg-secondary text-white hover:bg-pink-800 w-32 text-sm"
                        >
                            Change Avatar
                        </button>
                    </div>


  return (
    <div className="flex py-4 px-6 justify-between w-full">
      {user ? (
        <div className="flex lg:flex-row md:flex-row flex-col gap-4">
          {/* Profile Picture Section */}
          <div className="flex flex-col">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="User Avatar"
                className="rounded-full w-40 h-40 object-cover"
              />
            ) : (
              <FaUserCircle size={70} />
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
            {/* Avatar Update Section */}
            <div className="mt-4 flex flex-col gap-2">
              <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
              <button
                onClick={handleAvatarUpdate}
                disabled={loading}
                className={`p-2 rounded-md w-32 ${
                  loading
                    ? 'bg-gray-400 text-gray-600'
                    : 'bg-secondary text-white hover:bg-pink-800'
                }`}
              >
                {loading ? 'Updating...' : 'Update Avatar'}
              </button>
            </div>
          </div>

          {/* User Information */}
          <div className="flex flex-col gap-2 text-sm">
            {[
              { label: 'First Name', value: user.firstName },
              { label: 'Last Name', value: user.lastName },
              { label: 'Phone Number', value: user.phoneNumber },
              { label: 'Email', value: user.email },
              { label: 'Address', value: user.address },
              { label: 'Category', value: user.category },
            ].map(({ label, value }) => (
              <p key={label}>
                {label}:<span className="font-bold ml-4">{value || 'N/A'}</span>
              </p>
            ))}
          </div>
        </div>
      ) : (
        <p>No user data available.</p>
      )}

      {/* Refresh Button */}
      <div className="flex items-center">
        <button
          onClick={refreshUserData}
          disabled={loading}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          <FaSpinner
            size={24}
            className={`${loading ? 'animate-spin text-gray-500' : 'text-gray-700'}`}
          />
        </button>
      </div>
    </div>
  );
};

export default Profile;
