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
            await updateAvatar(avatarFile); 
            await fetchUserData();
            toast.success("Avatar updated successfully!");
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to update avatar.");
            toast.error("Error updating avatar. Please try again.");
        } finally {
            setAvatarFile(null); 
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        error,
        handleFileChange,
        handleAvatarUpdate,
    };
import { useState, useEffect } from 'react';
import { getUserData, updateAvatar } from '../services/api';
import { toast } from 'react-toastify';

const useUser = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState(null);

  const fetchUserData = async () => {
    try {
      const data = await getUserData();
      setUserData(data.data);
      setLoading(false);
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update the user's avatar
  const updateUserAvatar = async avatarFile => {
    try {
      const updatedUser = await updateAvatar(avatarFile);
      setUserData(updatedUser.data);
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Failed to update avatar.');
      throw err;
    }
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const handleAvatarUpdate = async () => {
    if (!avatarFile) {
      toast.info('Please select a file first.');
      return;
    }

    try {
      const response = await updateAvatar(avatarFile);
      setUserData(response.data);
      toast.success('Avatar updated successfully!');
    } catch (err) {
      console.err(err.message);
      toast.error('Failed to update avatar. Please try again.');
    } finally {
      setAvatarFile(null);
    }
  };

  const refreshUserData = () => {
    fetchUserData();
  };

  useEffect(() => {
    const token = localStorage.getItem('access_Token');
    if (token) {
      fetchUserData();
    }
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
