import { EmailVerifyValues } from "@/interfaces/interface";
import { useAuthStore } from "@/store/useAuthStore";
import { FormikHelpers } from "formik";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export const useAuthEmailVerify = () => {
  const router = useRouter();
  const verifyEmail = useAuthStore((state) => state.verifyEmail);
  const emailForVerification = useAuthStore(
    (state) => state.emailForVerification
  );

  if (!emailForVerification) {
    return {
      email: "",
      error: "Email is missing for verification.",
      handleSubmit: async () => {},
      handleKeyDown: () => {},
    };
  }

  const handleSubmit = async (
    values: EmailVerifyValues,
    { setSubmitting }: FormikHelpers<EmailVerifyValues>
  ) => {
    setSubmitting(true);
    const token = values.otp.join("");
    try {
      await verifyEmail(emailForVerification, token);
      toast.success("Email verified successfully!");
      router.push("/auth/login");
    } catch (error: unknown) {
      let userMessage = "Failed to verify email. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes("Token expired")) {
          userMessage = "Your OTP has expired. Please request a new one.";
        } else if (error.message.includes("Invalid OTP")) {
          userMessage =
            "The OTP you entered is incorrect. Please check and try again.";
        }
      }
      toast.error(userMessage);
    } finally {
      setSubmitting(false);
    }
  };


  return { handleSubmit, email: emailForVerification };
};

