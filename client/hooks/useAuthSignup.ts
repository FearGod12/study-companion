"use client";

import { FormValues } from "@/interfaces";
import { useAuthStore } from "@/store/useAuthStore";
import { usePasswordStore } from "@/store/usePasswordStore";
import { FormikHelpers } from "formik";
import { toast } from "react-toastify";

export const useAuthSignup = () => {
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
    await register(values);
    setSubmitting(false);
  };

  return {
    handleSubmit,
    initialValues,
    showPassword,
    togglePassword,
  };
};
