import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../common/Button";
import { useState } from "react";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/api";

const Login = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false); // To toggle password visibility
    const navigate = useNavigate();

    const initialValues = {
        email: "",
        password: "",
    };

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Invalid email address.")
            .required("Email is required."),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters long.")
            .required("Password is required."),
    });

    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        try {
            const response = await loginUser(values.email, values.password);
            console.log("Login successful:", response.data);

            // Store the access token securely (example: localStorage)
            localStorage.setItem("accessToken", response.data.access_Token);

            // Navigate to the dashboard
            navigate("/dashboard");
        } catch (error) {
            console.error(
                "Login Error:",
                error.response?.data || error.message
            );
            setErrorMessage("Invalid email or password. Please try again.");
        } finally {
            setSubmitting(false);
            resetForm();
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, isValid }) => (
                <Form className="h-screen flex flex-col gap-6 max-w-sm mx-auto justify-center">
                    <div className="text-center">
                        <h1 className="font-bold font-inria-sans pb-4 text-2xl text-secondary">
                            Log In
                        </h1>
                    </div>

                    {/* Email Field */}
                    <div className="flex flex-col relative">
                        <label
                            htmlFor="email"
                            className="font-ink-free flex items-center"
                        >
                            <AiOutlineMail className="mr-2" />
                            Email
                        </label>
                        <Field
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            className="border py-2 pl-10 pr-4 rounded w-full focus:outline-none focus:ring focus:ring-secondary text-sm"
                        />
                        <ErrorMessage
                            name="email"
                            component="div"
                            className="text-red-500 text-sm"
                        />
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col relative">
                        <label
                            htmlFor="password"
                            className="font-ink-free flex items-center"
                        >
                            <AiOutlineLock className="mr-2" />
                            Password
                        </label>
                        <div className="relative">
                            <Field
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                className="border py-2 pl-10 pr-4 rounded w-full focus:outline-none focus:ring focus:ring-secondary text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        <ErrorMessage
                            name="password"
                            component="div"
                            className="text-red-500 text-sm"
                        />
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="text-red-500 text-sm text-center">
                            {errorMessage}
                        </div>
                    )}

                    <Link to="/forgot-password" className="text-sm">
                        Forgot Password?
                    </Link>

                    {/* Login Button */}
                    <Button
                        text={isSubmitting ? "Logging in..." : "Login"}
                        type="submit"
                        className="text-white hover:bg-white hover:text-secondary hover:border-secondary hover:border"
                        disabled={!isValid || isSubmitting}
                    />

                    <div className="mt-8 font-inria-sans text-sm">
                        <p>
                            Don't have an account?{" "}
                            <span className="font-bold transition ease-in-out duration-300 hover:text-secondary">
                                <Link to="/signup">Sign Up</Link>
                            </span>
                        </p>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default Login;
