"use client";

import { FormValues } from "@/interfaces/interface";
import { useAuthStore } from "@/store/useAuthStore";
import { usePasswordStore } from "@/store/usePasswordStore";
import { FormikHelpers } from "formik";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export const useAuthSignup = () => {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const showPassword = usePasswordStore((state) => state.showPassword);
  const togglePassword = usePasswordStore((state) => state.togglePassword);

  const initialValues: FormValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    category: "",
    address: "",
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    setSubmitting(true);
    toast.dismiss();

    try {
      await register(values);
      localStorage.setItem("emailForVerification", values.email); 
      router.push("/auth/verify-email");
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    handleSubmit,
    initialValues,
    showPassword,
    togglePassword,
  };
};
