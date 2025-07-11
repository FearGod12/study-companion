"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { FormikHelpers } from "formik";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { ForgotPassValues } from "@/interfaces";

export const useAuthForgotPass = () => {
  const router = useRouter();
  const requestPasswordReset = useAuthStore(
    (state) => state.requestPasswordReset
  );

  const initialValues = { email: "" };

  const handleSubmit = async (
    values: ForgotPassValues,
    { setSubmitting, resetForm }: FormikHelpers<ForgotPassValues>
  ) => {
    setSubmitting(true);
    toast.dismiss();
    try {
      await requestPasswordReset(values.email);
      resetForm();
      router.push("/auth/reset-password");
    } catch (error: unknown) {
      console.error("Password reset error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong. Try again!";
      console.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return { initialValues, handleSubmit };
};
