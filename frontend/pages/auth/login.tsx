import { Formik, Form, Field, ErrorMessage } from "formik";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useAuthLogin } from "@/hooks/useAuthLogin";
import { loginSchema } from "@/validations/loginSchema";
import { withZodSchema } from "formik-validator-zod";
import Link from "next/link";
import LoginRight from "@/components/common/LoginRight";
import Button from "@/components/common/Button";
import Spinner from "@/components/common/Spinner";

const Login = () => {
  const { initialValues, handleSubmit, showPassword, togglePassword } =
    useAuthLogin();

  return (
    <section className="flex h-screen w-screen">
      {/* Left section with login form */}
      <div className="flex-1 p-6 lg:px-12 flex flex-col justify-center">
        <Formik
          initialValues={initialValues}
          validate={withZodSchema(loginSchema)}
          onSubmit={handleSubmit}
          validateOnBlur={true}
        >
          {({ isSubmitting, isValid }) => (
            <Form className="h-screen flex flex-col gap-6 max-w-sm mx-auto justify-center w-full">
              <div className="text-center">
                <h1 className="font-bold pb-2 text-lg text-accent mt-9 text-left">
                  Login
                </h1>
              </div>
              <span className="underline bg-accent h-0.5 mb-6 w-36"></span>

              {/* Email Field */}
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="flex items-center lg:text-lg md:text-base text-sm"
                >
                  <AiOutlineMail className="mr-2" />
                  Email
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="border-2 border-accent py-2 px-4 rounded focus:outline-none focus:ring focus:ring-accent"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col relative">
                <label
                  htmlFor="password"
                  className="flex items-center lg:text-lg md:text-base text-sm"
                >
                  <AiOutlineLock className="mr-2" />
                  Password
                </label>
                <div className="relative">
                  <Field
                    type={showPassword["password"] ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    className="border-2 border-accent py-2 px-4 rounded focus:outline-none focus:ring focus:ring-accent w-full"
                  />
                  <button
                    type="button"
                    onClick={() => togglePassword("password")}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword.password ? (
                      <HiEyeOff size={20} />
                    ) : (
                      <HiEye size={20} />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <Link
                href="/auth/forgot-password"
                className="text-accent hover:underline lg:text-base md:text-base text-sm"
              >
                Forgot Password?
              </Link>

              {/* Submit Button */}
              <Button
                text={isSubmitting ? <Spinner /> : "Login"}
                type="submit"
                className={`text-gray-100 hover:bg-gray-100 hover:text-accent hover:border-accent hover:border px-12 py-3 ${
                  isSubmitting || !isValid ? "opacity-50" : ""
                }`}
                disabled={!isValid || isSubmitting}
                loading={isSubmitting}
              />

              <div className="lg:text-base md:text-base text-sm text-right">
                <p>
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/auth"
                    className="font-bold text-accent hover:underline"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      {/* Right section with background image and welcome message */}
      <div className="flex-1 lg:flex lg:flex-col hidden bg-accent shadow-lg shadow-accent h-screen justify-center items-center relative">
        <LoginRight />
      </div>
    </section>
  );
};

export default Login;
