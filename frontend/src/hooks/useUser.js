import { useState, useEffect } from "react";
import { getUserData, updateAvatar } from "../services/api"; 
import { toast } from "react-toastify";


const useUser = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError ] = useState()
    const [loading, setLoading] = useState(true);
    const [avatarFile, setAvatarFile] = useState(null);

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

    // Update the user's avatar
    const updateUserAvatar = async (avatarFile) => {
        try {
            const updatedUser = await updateAvatar(avatarFile);
            setUserData(updatedUser.data); 
            return updatedUser;
        } catch (err) {
            setError(err.message || "Failed to update avatar.");
            throw err;
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
        }
    };

    const handleAvatarUpdate = async () => {
        if (!avatarFile) {
            toast.info("Please select a file first.");
            return;
        }

        try {
            await updateAvatar(avatarFile);
            fetchUserData();
            toast.success("Avatar updated successfully!");
        } catch (err) {
            console.err(err.message)
            toast.error("Failed to update avatar. Please try again.");
        } finally {
            setAvatarFile(null);
        }
    };

    const refreshUserData = () => {
        fetchUserData();
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return {
        userData,
        loading,
        error,
        fetchUserData,
        handleFileChange, 
        handleAvatarUpdate, 
        refreshUserData,
        updateAvatar: updateUserAvatar,
    };
};

export default useUser;
