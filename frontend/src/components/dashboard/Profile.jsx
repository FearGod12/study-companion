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
        <div className="flex py-4 px-10 lg:justify-start md:justify-start  justify-center w-full">
            {user ? (
                <div className="flex lg:flex-row md:flex-row flex-col lg:gap-4 md:gap-4 gap-6">
                    {/* Profile Picture Section */}
                    <div className="flex flex-col items-center">
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt="User Avatar"
                                className="rounded-full lg:w-40 lg:h-40 md:w-40 md:h-40 w-48 h-w-52 object-cover"
                            />
                        ) : (
                            <FaUserCircle size={70} />
                        )}
                        {/* Open Modal Button */}
                        <button
                            onClick={toggleModal}
                            className="mt-4 p-2 rounded-md bg-secondary text-white hover:bg-pink-800 w-32"
                        >
                            Update Avatar
                        </button>
                    </div>

                    {/* User Information */}
                    <div className="flex flex-col gap-3 lg:text-sm md:text-sm justify-center lg:items-start md:items-start items-center ">
                        {[
                            { label: "First Name", value: user.firstName },
                            { label: "Last Name", value: user.lastName },
                            { label: "Phone Number", value: user.phoneNumber },
                            { label: "Email", value: user.email },
                            { label: "Address", value: user.address },
                            { label: "Category", value: user.category },
                        ].map(({ label, value }) => (
                            <p key={label} className="flex">
                                {label}:
                                <span className="flex font-bold ml-4 flex-wrap">{value || "N/A"}</span>
                            </p>
                        ))}
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
