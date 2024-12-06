import { useState } from "react";
import { updateAvatar } from "../services/api";
import { toast } from "react-toastify";
import { useAuth } from "./useAuth";


const useUser = () => {
    const { user, fetchUserData } = useAuth(); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type and size (optional)
            if (!file.type.startsWith("image/")) {
                toast.error("Please select an image file.");
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                toast.error("File size should not exceed 2MB.");
                return;
            }
            setAvatarFile(file);
        }
    };

    // Update avatar function
    const handleAvatarUpdate = async () => {
        if (!avatarFile) {
            toast.info("Please select a file first.");
            return;
        }
        setLoading(true);
        setError(null);

        try {
            await updateAvatar(avatarFile); // Call API to update avatar
            await fetchUserData(); // Refresh user data from AuthContext
            toast.success("Avatar updated successfully!");
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to update avatar.");
            toast.error("Error updating avatar. Please try again.");
        } finally {
            setAvatarFile(null); // Reset selected file
            setLoading(false); // Stop loading
        }
    };

    return {
        user,
        loading,
        error,
        handleFileChange,
        handleAvatarUpdate,
    };
};

export default useUser;
