"use client";

import { LoginFormValues } from "@/interfaces/interface";
import { useAuthStore } from "@/store/useAuthStore";
import { usePasswordStore } from "@/store/usePasswordStore";
import { FormikHelpers } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const useAuthLogin = () => {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const showPassword = usePasswordStore((state) => state.showPassword);
  const togglePassword = usePasswordStore((state) => state.togglePassword);

  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: FormikHelpers<LoginFormValues>
  ) => {
    setSubmitting(true);
    try {
      await login(values.email ?? "", values.password ?? "");
    } catch (error: unknown) {
      let userMessage = "An unexpected error occurred.";
      if (error instanceof Error && error.message) {
        if (error.message.includes("Email not verified")) {
          toast.info("Please create an account.");
          router.push("/auth");
          return;
        } else if (error.message.includes("User not found")) {
          userMessage = "No account found with this email.";
        } else if (error.message.includes("Incorrect password")) {
          userMessage = "The password you entered is incorrect.";
        }
      } else {
        userMessage = "A network error occurred. Please try again.";
      }
      toast.error(userMessage);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const firstInvalidElement = document.querySelector(
      ".text-red-500, [aria-invalid='true']"
    );
    if (firstInvalidElement) {
      firstInvalidElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      (firstInvalidElement as HTMLElement).focus();
    }
  }, []);

  return {
    handleSubmit,
    initialValues,
    showPassword,
    togglePassword,
  };
};
