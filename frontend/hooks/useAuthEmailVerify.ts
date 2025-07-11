import { EmailVerifyValues } from "@/interfaces";
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

  const handleSubmit = async (
    values: EmailVerifyValues,
    { setSubmitting, resetForm }: FormikHelpers<EmailVerifyValues>
  ) => {
    setSubmitting(true);
    const token = values.otp.join("");

    try {
      if (!emailForVerification) {
        toast.error("Email is missing for verification.");
        return;
      }

      await verifyEmail(emailForVerification, token);
      resetForm();
      router.push("/auth/login");
    } catch (err) {
      console.error("Email verification failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    handleSubmit,
    email: emailForVerification || "",
  };
};
