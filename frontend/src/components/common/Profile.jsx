import React, { useState, useEffect } from "react";
import { FaPenSquare, FaUserCircle } from "react-icons/fa";
import { getUserData } from "../../services/api";
import { Link } from "react-router-dom";
import { set } from "date-fns";

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getUserData();
                setUserData(data.data); 
            } catch (error) {
                console.error(error.message);
                setError(error.message)
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (error) {
        return <p className="text-red-500">Error: {error}</p>;
    }

    return (
        <div className="flex py-4 px-6 gap-12">
            {/* Profile Picture */}
            <div className="">
                {userData?.avatar ? (
                    <img
                        src={userData.avatar}
                        alt="Profile"
                        className="rounded-full w-20 h-20 object-cover"
                    />
                ) : (
                    <div className="outline outline-secondary p-12 rounded-full">
                        <FaUserCircle size={70} />
                    </div>
                )}
            </div>

            {/* User Information */}
            <div className="flex flex-col gap-2 text-sm">
                <p>
                    First Name:
                    <span className="font-bold font-ink-free ml-4">
                        {userData?.firstName || "N/A"}
                    </span>
                </p>
                <p>
                    Last Name:
                    <span className="font-bold font-ink-free ml-4">
                        {userData?.lastName || "N/A"}
                    </span>
                </p>
                <p>
                    Phone Number:
                    <span className="font-bold font-ink-free ml-4">
                        {userData?.phoneNumber || "N/A"}
                    </span>
                </p>
                <p>
                    Email:
                    <span className="font-bold font-ink-free ml-4">
                        {userData?.email || "N/A"}
                    </span>
                </p>
                <p>
                    Address:
                    <span className="font-bold font-ink-free ml-4">
                        {userData?.address || "N/A"}
                    </span>
                </p>
                <p>
                    Category:
                    <span className="font-bold font-ink-free ml-4">
                        {userData?.category || "N/A"}
                    </span>
                </p>
            </div>
            <div className="">
                <Link to="/profile-edit">
                    <FaPenSquare size={24} color="#960057" />
                </Link>
            </div>
        </div>
    );
};

export default Profile;
