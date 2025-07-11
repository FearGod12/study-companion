import { Formik, Form, Field, ErrorMessage } from "formik";
import { AiOutlineMail } from "react-icons/ai";
import { forgotPassSchema } from "@/validations/forgotPassSchema";
import { useAuthForgotPass } from "@/hooks/useAuthForgotPass";
import { withZodSchema } from "formik-validator-zod";
import Button from "@/components/common/Button";
import Spinner from "@/components/common/Spinner";

const ForgotPassword = () => {
  const { initialValues, handleSubmit } = useAuthForgotPass();

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="lg:max-w-lg md:max-w-md max-w-md w-full p-6 bg-white shadow-md rounded">
        <h1 className="lg:text-2xl md:text-1xl text-xl font-bold text-center text-accent">
          Forgot Password
        </h1>
        <div className="w-32 h-1 bg-accent text-center mt-2 mb-4 mx-auto"></div>
        <p className="text-center mb-4 lg:text-lg md:text-base text-sm">
          Enter your email address below, and we&apos;ll send you password reset
          instructions.
        </p>
        <Formik
          initialValues={initialValues}
          validate={withZodSchema(forgotPassSchema)}
          onSubmit={handleSubmit}
          validateOnBlur={true}
        >
          {({ isValid, isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              {/* Email Field */}
              <div className="relative lg:text-lg md:text-base text-sm">
                <AiOutlineMail className="absolute top-4 left-3 text-gray-400" />
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="border border-accent py-3 pl-10 pr-4 rounded w-full focus:outline-none focus:ring focus:ring-accent"
                  aria-label="Enter your email"
                  aria-describedby="email-error"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                  id="email-error"
                />
              </div>

              {/* Loader and button */}
              <Button
                text={isSubmitting ? <Spinner /> : "Request Password Reset"}
                type="submit"
                className={`text-white hover:bg-white hover:text-accent hover:border-accent hover:border mt-4 px-12 py-3 ${
                  isSubmitting || !isValid
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={!isValid || isSubmitting}
                loading={isSubmitting}
              />

              {/* Instructions */}
              <div className="lg:text-base md:text-base text-sm text-center text-gray-600 mt-2 font-semibold">
                <p>
                  Didn’t receive the email? Check your spam folder or try again.
                  If the issue persists, contact support.
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ForgotPassword;
