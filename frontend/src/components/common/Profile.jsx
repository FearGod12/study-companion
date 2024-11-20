import { FaUserCircle } from "react-icons/fa";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext

const Profile = () => {
    // Access user data from AuthContext
    const { auth } = useContext(AuthContext);
    const [userData, setUserData] = useState({
        fullName: "",
        phoneNumber: "",
        email: "",
        address: "",
        category: "",
        profilePicture: null, // This could be a URL or local file
    });

    useEffect(() => {
        // Check if user data is available in AuthContext
        if (auth?.user) {
            setUserData({
                fullName: auth.user.name,
                phoneNumber: auth.user.phoneNumber,
                email: auth.user.email,
                address: auth.user.address,
                category: auth.user.category,
                profilePicture: auth.user.profilePicture,
            });
        }
    }, [auth]); // Re-run if auth changes

    const handleEditProfile = () => {
        // You can implement a redirect to an edit page or toggle an edit state
        console.log("Edit profile clicked");
    };

    return (
        <div className="flex py-4 px-6 gap-12">
            {/* Profile picture */}
            <div className="outline outline-secondary p-12 rounded-full">
                {userData.profilePicture ? (
                    <img
                        src={userData.profilePicture}
                        alt="Profile"
                        className="rounded-full w-20 h-20 object-cover"
                    />
                ) : (
                    <FaUserCircle size={70} />
                )}
            </div>

            {/* User Information */}
            <div className="flex flex-col gap-2 text-sm">
                <p className="">
                    Full Name:
                    <span className="font-bold font-ink-free ml-4">
                        {userData.fullName}
                    </span>
                </p>
                <p className="">
                    Phone Number:
                    <span className="font-bold font-ink-free ml-4">
                        {userData.phoneNumber}
                    </span>
                </p>
                <p className="">
                    Email:
                    <span className="font-bold font-ink-free ml-4">
                        {userData.email}
                    </span>
                </p>
                <p className="">
                    Address:
                    <span className="font-bold font-ink-free ml-4">
                        {userData.address}
                    </span>
                </p>
                <p className="">
                    Category:
                    <span className="font-bold font-ink-free ml-4">
                        {userData.category}
                    </span>
                </p>
            </div>

            {/* Edit Button */}
            <div className="mt-4">
                <button
                    onClick={handleEditProfile}
                    className="text-sm font-medium text-secondary hover:text-primary"
                >
                    Edit Profile
                </button>
            </div>
        </div>
    );
};

export default Profile;
