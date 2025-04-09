"use client";

import { resetPassValues } from "@/interfaces/interface";
import { useAuthStore } from "@/store/useAuthStore";
import { usePasswordStore } from "@/store/usePasswordStore";
import { FormikHelpers } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const useAuthResetPass = () => {
  const router = useRouter();
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
    { setSubmitting }: FormikHelpers<resetPassValues>
  ) => {
    setSubmitting(true);
    toast.dismiss();
    try {
      await resetPassword(values.token, values.password, values.confirmPassword, values.email);
      toast.success("Password reset successful.");
      setTimeout(() => router.push("/auth/login"), 3000);
    } catch (error: unknown) {
        console.error("Password reset error:", error);
      
        let userMessage = "Something went wrong. Try again!";
        if (error instanceof Error) {
          if (error.message.includes("Invalid token")) {
            userMessage = "The reset link is invalid or has expired. Please request a new one.";
          } else if (error.message.includes("Passwords do not match")) {
            userMessage = "Passwords must match. Please re-enter and try again.";
          }
        }
        toast.error(userMessage);
      }finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const invalidElement = document.querySelector(".text-red-500");
    if (invalidElement) {
      (invalidElement as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
      (invalidElement as HTMLElement).focus();
    }
  }, []);

  return { initialValues, handleSubmit, showPassword, togglePassword };
};
