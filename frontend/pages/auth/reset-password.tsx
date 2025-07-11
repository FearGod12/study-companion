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
      <div className="lg:max-w-lg md:max-w-md max-w-sm mx-2 w-full p-6 bg-gray-50 shadow-md rounded">
        <h1 className="lg:text-2xl md:text-1xl text-xl font-bold text-center text-accent">
          Reset Password
        </h1>
        <div className="w-32 h-1 bg-accent text-center mt-2 mb-4 mx-auto"></div>
        <p className="text-center mb-4 lg:text-lg md:text-base text-sm font-semibold">
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
              <div className="flex flex-col w-full">
                <label htmlFor="token" className="flex">
                  <AiOutlineLock className="mr-2" />
                  Token
                </label>
                <Field
                  type="text"
                  id="token"
                  name="token"
                  placeholder="Enter the token sent to your email"
                  className="border-2 border-accent py-2 px-4 rounded focus:outline-none focus:ring focus:ring-accent w-full"
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
                <label htmlFor="email" className="flex">
                  <AiOutlineMail className="mr-2" />
                  Email
                </label>
                <div className="relative">
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    className="border-2 border-accent py-2 px-4 rounded focus:outline-none focus:ring focus:ring-accent w-full"
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
                    className="flex items-center"
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
                      className="border-2 border-accent py-2 px-4 rounded focus:outline-none focus:ring focus:ring-accent w-full"
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
                type="submit"
                className={`mt-6 group bg-accent text-gray-50 hover:bg-gray-50 hover:text-accent hover:border-accent hover:border px-12 py-3 ${
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
