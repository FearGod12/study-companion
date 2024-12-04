import { useState, useEffect } from "react";
import { FaPenSquare, FaTimes, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import AvatarUpload from "./AvatarUpload"; 

const Profile = () => {
    const { user, fetchUserData, loading } = useAuth();
    const [isAvatarUploadVisible, setAvatarUploadVisible] = useState(false);

    useEffect(() => {
        if (!user && !loading) {
            fetchUserData();
        }
    }, [user, loading, fetchUserData]);

    if (loading) {
        return null;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex py-4 px-6 justify-between w-full">
            {/* Profile Picture */}
            <div className="flex lg:flex-row md:flex-row flex-col gap-6">
                <div
                    className="flex items-center justify-center cursor-pointer"
                    onClick={() => setAvatarUploadVisible(true)} // Show AvatarUpload on click
                >
                    {user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt="Profile"
                            className="rounded-full w-20 h-20 object-cover"
                        />
                    ) : (
                        <div>
                            <FaUserCircle size={70} />
                        </div>
                    )}
                </div>

                {/* User Information */}
                <div className="flex flex-col gap-2 text-sm">
                    <p>
                        First Name:
                        <span className="font-bold font-ink-free ml-4">
                            {user?.firstName || "N/A"}
                        </span>
                    </p>
                    <p>
                        Last Name:
                        <span className="font-bold font-ink-free ml-4">
                            {user?.lastName || "N/A"}
                        </span>
                    </p>
                    <p>
                        Phone Number:
                        <span className="font-bold font-ink-free ml-4">
                            {user?.phoneNumber || "N/A"}
                        </span>
                    </p>
                    <p>
                        Email:
                        <span className="font-bold font-ink-free ml-4">
                            {user?.email || "N/A"}
                        </span>
                    </p>
                    <p>
                        Address:
                        <span className="font-bold font-ink-free ml-4">
                            {user?.address || "N/A"}
                        </span>
                    </p>
                    <p>
                        Category:
                        <span className="font-bold font-ink-free ml-4">
                            {user?.category || "N/A"}
                        </span>
                    </p>
                </div>
            </div>

            <div>
                <Link to="/profile-edit">
                    <FaPenSquare size={24} color="#960057" />
                </Link>
            </div>

            {/* Avatar Upload Modal */}
            {isAvatarUploadVisible && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-4 rounded shadow-lg relative border-2">
                        <AvatarUpload />
                        <button
                            onClick={() => setAvatarUploadVisible(false)}
                            className="mt-4 p-2 bg-red-500 text-white rounded hover:bg-red-600 absolute top-0 right-4"
                        >
                            <FaTimes/>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
