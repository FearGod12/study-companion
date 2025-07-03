import { Formik, Form } from "formik";
import Button from "@/components/common/Button";
import DarkLogo from "@/components/common/logo/DarkLogo";
import { useAuthEmailVerify } from "@/hooks/useAuthEmailVerify";
import { emailVerifySchema } from "@/validations/emailVerifySchema";
import { withZodSchema } from "formik-validator-zod";
import { EmailVerifyValues } from "@/interfaces";
import OtpInput from "../../components/common/OtpInput";
import Spinner from "@/components/common/Spinner";

const EmailVerification = () => {
  const { email, handleSubmit } = useAuthEmailVerify();

  return (
    <div className="flex h-screen w-screen bg-accent justify-center items-center">
      <div className="bg-gray-100 lg:max-w-lg md:max-w-lg max-w-md h-1/2 shadow-lg rounded flex flex-col justify-center items-center gap-2 px-6">
        <DarkLogo />
        <p className="lg:text-base md:text-base text-sm mt-2 mb-2 ">
          We&apos;ve sent a 6-digit code to{" "}
          <span className="font-bold text-accent">{email}</span>
        </p>
        <p className="lg:text-base md:text-base text-sm font-bold mt-2 pb-2">
          Enter the code
        </p>

        <Formik<EmailVerifyValues>
          initialValues={{ otp: Array(6).fill("") }}
          validate={withZodSchema(emailVerifySchema)}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, isValid }) => (
            <Form className="flex flex-col items-center gap-4">
              <OtpInput name="otp" />

              <Button
                text={isSubmitting ? <Spinner /> : "Continue"}
                type="submit"
                className="bg-accent text-gray-100 hover:border hover:bg-gray-100 hover:text-accent hover:border-accent px-12 py-3"
                disabled={!isValid || isSubmitting}
                loading={isSubmitting}
              />
            </Form>
          )}
        </Formik>
        <p className="lg:text-base md:text-base text-sm mt-2 pb-2">
          Didn’t receive the code? Check your spam folder.
        </p>
      </div>
    </div>
  );
};

export default EmailVerification;
