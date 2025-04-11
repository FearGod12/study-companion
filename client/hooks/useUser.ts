"use client";

import { UpdateFormValues } from "@/interfaces/interface";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import router from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const useUser = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  const toggleModal = () => setModalOpen(!isModalOpen);

  // Zustand Store Hooks
  const { updateUserDetails, uploadAvatar, loading } = useUserStore();
  const fetchUserData = useAuthStore((state) => state.fetchUserData);
  const user = useAuthStore((state) => state.user);
  const error = useAuthStore((state) => state.error);
  const logoutUser = useAuthStore((state) => state.logoutUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!user && isAuthenticated) {
      fetchUserData();
    }
  }, [user, isAuthenticated]);
  

  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []);

  const handleFormSubmit = async (data: UpdateFormValues) => {
    try {
      await updateUserDetails(data);
      toast.success("Profile updated successfully!");
    } catch (error: unknown) {
      toast.error("Failed to update profile.");
      console.error("Profile update error:", error);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      await uploadAvatar(file);
      await fetchUserData();
      toast.success("Avatar upload successfully!");
    } catch (error: unknown) {
      toast.error("Failed to upload avatar.");
      console.error("Avatar upload error:", error);
    }
  };

  const onFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        await handleFileUpload(file);
        setModalOpen(false);
        toast.success("Avatar updated successfully!");
      } catch (error: unknown) {
        toast.error("File upload failed.");
        console.error("Avatar update error:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleLogout = () => {
    logoutUser();
    router.push("/auth/login");
  };

  return {
    handleFormSubmit,
    handleFileUpload,
    loading,
    error,
    fetchUserData,
    onFileUpload,
    user,
    uploading,
    toggleModal,
    isModalOpen,
    handleLogout,
    currentDate,
    isAuthenticated,
  };
};

export default useUser;
