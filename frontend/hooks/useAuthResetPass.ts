"use client";

import { resetPassValues } from "@/interfaces";
import { useAuthStore } from "@/store/useAuthStore";
import { usePasswordStore } from "@/store/usePasswordStore";
import { FormikHelpers } from "formik";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const useAuthResetPass = () => {
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const showPassword = usePasswordStore((state) => state.showPassword);
  const togglePassword = usePasswordStore((state) => state.togglePassword);
  const initialValues = {
    token: "",
    password: "",
    confirmPassword: "",
    email: "",
  };

  const handleSubmit = async (
    values: resetPassValues,
    { setSubmitting, resetForm }: FormikHelpers<resetPassValues>
  ) => {
    setSubmitting(true);
    toast.dismiss();
    try {
      await resetPassword(
        values.token,
        values.password,
        values.confirmPassword,
        values.email
      );
      resetForm();
    } catch (error: unknown) {
      console.error("Password reset error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const invalidElement = document.querySelector(".text-red-500");
    if (invalidElement) {
      (invalidElement as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      (invalidElement as HTMLElement).focus();
    }
  }, []);

  return { initialValues, handleSubmit, showPassword, togglePassword };
};
