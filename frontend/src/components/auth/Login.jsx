import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../common/Button";
import { useState } from "react";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { toast } from "react-toastify";
import { useAuth } from "../../context/useAuth"; 

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth(); 
    const navigate = useNavigate();
    
    const initialValues = {
        email: "",
        password: "",
    };

    const LoginSchema = Yup.object().shape({
        email: Yup.string()
            .email("Invalid email address.")
            .required("Email is required."),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters long.")
            .required("Password is required."),
    });

      const handleSubmit = async (values, { setSubmitting }) => {
          setSubmitting(true);
          toast.dismiss();

          try {
              await login(values.email, values.password); 
              toast.success("Login successful");
              navigate('/dashboard')
    
        } catch (error) {
            console.error("Login Error:", error);
            toast.error(error.message || "Login failed. Please try again.");
        
          } finally {
              setSubmitting(false);
          }
      };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, isValid }) => (
                <Form className="h-screen flex flex-col gap-6 max-w-sm mx-auto justify-center w-full">
                    <div className="text-center">
                        <h1 className="font-bold text-lg text-secondary pb-2 text-left">
                            Login
                        </h1>
                    </div>
                    <span className="underline bg-secondary h-0.5 mb-6 w-36"></span>

                    {/* Email Field */}
                    <div className="flex flex-col">
                        <label htmlFor="email" className="flex items-center">
                            <AiOutlineMail className="mr-2" />
                            Email
                        </label>
                        <Field
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            className="border py-2 px-4 rounded focus:outline-none focus:ring focus:ring-secondary"
                        />
                        <ErrorMessage
                            name="email"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                        />
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col relative">
                        <label htmlFor="password" className="flex items-center">
                            <AiOutlineLock className="mr-2" />
                            Password
                        </label>
                        <div className="relative">
                            <Field
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                className="border py-2 px-4 rounded focus:outline-none focus:ring focus:ring-secondary w-full"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? (
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
                        to="/forgot-password"
                        className="text-sm text-secondary hover:underline"
                    >
                        Forgot Password?
                    </Link>

                    {/* Submit Button */}
                    <Button
                        text={isSubmitting ? "Logging in..." : "Login"}
                        type="submit"
                        className={`mt-4 text-white hover:bg-white hover:text-secondary hover:border-secondary hover:border  ${
                            isSubmitting || !isValid ? "opacity-50" : ""
                        }`}
                        disabled={!isValid || isSubmitting}
                    />

                    <div className="mt-8 text-sm text-center">
                        <p>
                            Dont have an account?{" "}
                            <Link
                                to="/signup"
                                className="font-bold text-secondary hover:underline"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default Login;
