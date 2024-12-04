import { useState, useEffect } from "react";
import {
    getUserData,
    updateUserDetails,
    updateAvatar,
} from "../../services/api";
import { toast } from "react-toastify";

const ProfileEdit = () => {
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        category: "",
        avatar: null,
    });

    const [avatarPreview, setAvatarPreview] = useState(""); // Preview for avatar
    const [loading, setLoading] = useState(false);

    // Fetch user data on component load
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getUserData();
                setUserData((prev) => ({
                    ...prev,
                    ...response.data,
                }));
                setAvatarPreview(response.data.avatar); // Show existing avatar
            } catch (error) {
                console.error("Error fetching user data:", error.message);
                toast.error("Failed to fetch user data.");
            }
        };

        fetchUserData();
    }, []);

    // Handle input change for text fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle avatar file change
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUserData((prev) => ({ ...prev, avatar: file }));
            setAvatarPreview(URL.createObjectURL(file)); // Show preview
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
       toast.dismiss();

        try {
            // Update user details
            const { firstName, lastName, phoneNumber, address, category } =
                userData;
            await updateUserDetails({
                firstName,
                lastName,
                phoneNumber,
                address,
                category,
            });

            // Update avatar if selected
            if (userData.avatar) {
                await updateAvatar(userData.avatar);
            }

            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error.message || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-edit-container p-6">
            <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit}>
                {/* Avatar Section */}
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Avatar
                    </label>
                    <div className="flex items-center gap-4">
                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt="Avatar Preview"
                                className="w-16 h-16 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-secondary hover:file:bg-blue-100"
                        />
                    </div>
                </div>

                {/* Profile Fields */}
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        First Name
                    </label>
                    <input
                        type="text"
                        name="firstName"
                        value={userData.firstName}
                        onChange={handleInputChange}
                        className="block w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Last Name
                    </label>
                    <input
                        type="text"
                        name="lastName"
                        value={userData.lastName}
                        onChange={handleInputChange}
                        className="block w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Phone Number
                    </label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={userData.phoneNumber}
                        onChange={handleInputChange}
                        className="block w-full p-2 border rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Address
                    </label>
                    <input
                        type="text"
                        name="address"
                        value={userData.address}
                        onChange={handleInputChange}
                        className="block w-full p-2 border rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <input
                        type="text"
                        name="category"
                        value={userData.category}
                        onChange={handleInputChange}
                        className="block w-full p-2 border rounded"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`mt-4 px-4 py-2 text-white bg-secondary border border-white hover:bg-white hover:text-secondary hover:border-secondary ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={loading}
                >
                    {loading ? "Updating..." : "Update Profile"}
                </button>
            </form>
        </div>
    );
};

export default ProfileEdit;
