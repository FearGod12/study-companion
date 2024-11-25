import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../common/Button";
import { useState} from "react";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { loginUser } from "../../services/api";
import { toast } from "react-toastify";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
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

    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
         setSubmitting(true);

         // Reset any previous toasts
         toast.dismiss();

        try {
            // Simulate API call with the context's login function
            const response = await loginUser(values.email, values.password);

            // Assuming response contains user information
            console.log("Login successful:", response);
            toast.success("Login successful");
            // Navigate to dashboard or home page
            navigate("/dashboard");
        } catch (error) {
            console.error("Login Error:", error.response || error.message);
            toast.error(
                error.response?.data?.message || "Failed to login. Please try again."
            );
        } finally {
            setSubmitting(false);
            resetForm(); // Clear form fields after submission
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, isValid }) => (
                <Form className="h-screen flex flex-col gap-6 max-w-sm mx-auto justify-center">
                    <div className="text-center">
                        <h1 className="font-bold text-2xl text-secondary pb-4">Log In</h1>
                    </div>

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
                                className="border py-2 px-4 rounded focus:outline-none focus:ring focus:ring-secondary"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
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
                        className={`mt-4 ${isSubmitting || !isValid ? "opacity-50" : ""}`}
                        disabled={!isValid || isSubmitting}
                    />

                    <div className="mt-8 text-sm text-center">
                        <p>
                            Don't have an account?{" "}
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