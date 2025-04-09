import { Formik, Form, Field, ErrorMessage } from "formik";
import { AiOutlineLock, AiOutlineMail } from "react-icons/ai";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useAuthResetPass } from "@/hooks/useAuthResetPass";
import { resetPassSchema } from "@/validations/resetPassSchema";
import { withZodSchema } from "formik-validator-zod";
import Button from "@/components/common/Button";
import Spinner from "@/components/common/Spinner";

const PasswordReset = () => {
  const { handleSubmit, initialValues, showPassword, togglePassword } =
    useAuthResetPass();

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="lg:max-w-lg md:max-w-md max-w-md w-full p-6 bg-white shadow-md rounded">
        <h1 className="lg:text-2xl md:text-1xl text-xl font-bold text-center text-accent">
          Reset Password
        </h1>
        <div className="w-32 h-1 bg-accent text-center mt-2 mb-4 mx-auto"></div>
        <p className="text-center mb-4 lg:text-lg md:text-base text-sm">
          Enter the reset token we sent to your email, along with your new
          password, to reset your account access.
        </p>
        <Formik
          initialValues={initialValues}
          validate={withZodSchema(resetPassSchema)}
          onSubmit={handleSubmit}
          validateOnBlur={true}
        >
          {({ isValid, isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              {/* Token Field */}
              <div className="flex flex-col w-full lg:text-lg md:text-base text-sm">
                <label htmlFor="token">
                  <AiOutlineLock className="mr-2" />
                  Token
                </label>
                <Field
                  type="text"
                  id="token"
                  name="token"
                  placeholder="Enter the token sent to your email"
                  className="border py-2 px-4 rounded w-full text-sm focus:outline-none focus:ring focus:ring-secondary"
                  aria-label="Enter your token"
                  aria-describedby="token-error"
                />
                <ErrorMessage
                  name="token"
                  component="div"
                  className="text-red-500 text-sm"
                  id="token-error"
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-col w-full">
                <label htmlFor="email" className="font-ink-free flex">
                  <AiOutlineMail className="mr-2" />
                  Email
                </label>
                <div className="relative">
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    className="border py-2 px-4 rounded w-full text-sm focus:outline-none focus:ring focus:ring-secondary"
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
              </div>

              {/* Password and Confirm Password */}
              {["password", "confirmPassword"].map((field) => (
                <div key={field} className="flex flex-col w-full relative">
                  <label
                    htmlFor={field}
                    className="font-ink-free flex items-center"
                  >
                    <AiOutlineLock className="mr-2" />{" "}
                    {field === "password" ? "Password" : "Confirm Password"}
                  </label>
                  <div className="relative">
                    <Field
                      type={showPassword[field] ? "text" : "password"}
                      id={field}
                      name={field}
                      placeholder={
                        field === "password"
                          ? "Enter your password"
                          : "Confirm your password"
                      }
                      className="border py-2 px-4 rounded w-full text-sm focus:outline-none focus:ring focus:ring-secondary"
                      aria-label="Input Password"
                      aria-describedby="password-error"
                    />
                    <button
                      type="button"
                      onClick={() => togglePassword(field)}
                      className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500"
                    >
                      {showPassword[field] ? <HiEyeOff /> : <HiEye />}
                    </button>
                  </div>
                  <ErrorMessage
                    name={field}
                    component="div"
                    className="text-red-500 text-sm mt-1"
                    id="password-error"
                  />
                </div>
              ))}

              {/* Submit Button */}
              <Button
                text={isSubmitting ? <Spinner /> : "Reset Password"}
                className={`mt-6 group bg-secondary text-white hover:bg-white hover:text-secondary hover:border-secondary hover:border ${
                  isSubmitting || !isValid
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={!isValid || isSubmitting}
                loading={isSubmitting}
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PasswordReset;
