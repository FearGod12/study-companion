import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../common/Button";
import { useState } from "react";
import { AiOutlineLock, AiOutlineMail } from "react-icons/ai";
import { resetPassword } from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";

const PasswordReset = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false,
    });
    const navigate = useNavigate();

    const initialValues = {
        token: "",
        password: "",
        confirmPassword: "",
        email: "",
    };

    const validationSchema = Yup.object().shape({
        token: Yup.string().required(
            "Token is required. Please check your email."
        ),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters long.")
            .matches(
                /[A-Z]/,
                "Password must contain at least one uppercase letter."
            )
            .matches(/[0-9]/, "Password must contain at least one number.")
            .required("Password is required."),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match.")
            .required("Confirm password is required."),
        email: Yup.string()
            .email("Invalid email address.")
            .required("Email is required."),
    });

    const handleSubmit = async (values, { resetForm }) => {
        setIsSubmitting(true);

        try {
            const response = await resetPassword(
                values.token,
                values.password,
                values.confirmPassword,
                values.email
            );

            if (response && response.data && response.data.message) {
                console.log("Response received:", response);
                toast.success(
                    response.data.message || "Password reset successful."
                );
                resetForm();
                navigate("/login");
            } else {
                throw new Error("No valid response data received.");
            }
        } catch (error) {
            console.error("Error resetting password:", error);

            if (error.response.data) {
                toast.error(
                    error.response?.data?.message ||
                        "Unable to reset password. Please try again."
                );
            } else if (error.request) {
                toast.error(
                    "Network error. Please check your internet connection."
                );
            } else {
                toast.error(error.message || "An unexpected error occurred.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full p-6 bg-white shadow-md rounded">
                <h1 className="text-2xl font-bold text-center text-secondary mb-6">
                    Reset Password
                </h1>
                <p className="text-sm text-center text-gray-600 mb-4">
                    Enter the token sent to your email along with your new
                    password.
                </p>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isValid }) => (
                        <Form className="flex flex-col gap-4">
                            {/* Token Field */}
                            <div className="flex flex-col w-full">
                                <label
                                    htmlFor="token"
                                    className="font-ink-free flex"
                                >
                                    <AiOutlineLock className="mr-2" />
                                    Token
                                </label>
                                <Field
                                    type="text"
                                    id="token"
                                    name="token"
                                    placeholder="Enter the token sent to your email"
                                    className="border py-2 px-4 rounded w-full text-sm focus:outline-none focus:ring focus:ring-secondary"
                                />
                                <ErrorMessage
                                    name="token"
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>

                            
                                {/* Email Field */}
                                <div className="flex flex-col w-full">
                                    <label
                                        htmlFor="email"
                                        className="font-ink-free flex"
                                    >
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
                                        />
                                        <ErrorMessage
                                            name="email"
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                    </div>
                                    </div>


                            {/* Password Field */}
                            <div className="flex flex-col w-full">
                                <label
                                    htmlFor="password"
                                    className="font-ink-free flex"
                                >
                                    <AiOutlineLock className="mr-2" />
                                    Password
                                </label>
                                <div className="relative">
                                    <Field
                                        type={
                                            showPassword.password
                                                ? "text"
                                                : "password"
                                        }
                                        id="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        className="border py-2 px-4 rounded w-full text-sm focus:outline-none focus:ring focus:ring-secondary"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((prev) => ({
                                                ...prev,
                                                password: !prev.password,
                                            }))
                                        }
                                        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword.password ? (
                                            <HiEyeOff />
                                        ) : (
                                            <HiEye />
                                        )}
                                    </button>
                                </div>
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>

                            {/* Confirm Password Field */}
                            <div className="flex flex-col w-full">
                                <label
                                    htmlFor="confirmPassword"
                                    className="font-ink-free flex"
                                >
                                    <AiOutlineLock className="mr-2" />
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Field
                                        type={
                                            showPassword.confirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="Confirm your password"
                                        className="border py-2 px-4 rounded w-full text-sm focus:outline-none focus:ring focus:ring-secondary"
                                    />
                                     <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((prev) => ({
                                                ...prev,
                                                confirmPassword:
                                                    !prev.confirmPassword,
                                            }))
                                        }
                                        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword.confirmPassword ? (
                                            <HiEyeOff />
                                        ) : (
                                            <HiEye />
                                        )}
                                    </button>
                                </div>
                                <ErrorMessage
                                    name="confirmPassword"
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>

                               
                            {/* Submit Button */}
                            <Button
                                text={
                                    isSubmitting
                                        ? "Resetting..."
                                        : "Reset Password"
                                }
                                type="submit"
                                className="text-white hover:bg-white hover:text-secondary hover:border-secondary hover:border mt-4"
                                disabled={!isValid || isSubmitting}
                            />
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default PasswordReset;
