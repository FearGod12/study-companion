import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../common/Button";
import { AiOutlineUser, AiOutlineMail, AiOutlineLock, AiOutlinePhone } from "react-icons/ai";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { registerUser } from "../../services/api";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useState } from "react";
import { toast } from "react-toastify";

const SignUp = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false,
    });

    const initialValues = {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        category: "",
        address: "",
    };

    const validationSchema = Yup.object({
        firstName: Yup.string()
            .min(2, "First name must be at least 2 characters long.")
            .required("First name is required."),
        lastName: Yup.string()
            .min(2, "Last name must be at least 2 characters long.")
            .required("Last name is required."),
        email: Yup.string()
            .email("Invalid email address.")
            .required("Email is required."),
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
        category: Yup.string().required("Please select a category."),
        address: Yup.string()
            .min(5, "Address must be at least 5 characters long.")
            .required("Address is required."),
        phoneNumber: Yup.string()
            .matches(
                /^[+]?[0-9]{10,15}$/,
                "Phone number must be valid and contain 10-15 digits."
            )
            .required("Phone number is required."),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);
        toast.dismiss();
        try {
            const response = await registerUser(values);
            if (response.success) {
                localStorage.setItem("email", values.email);
                toast.success(response.data.message || "Signup successful!");
                navigate("/verify-email"); 
            }
        }  catch (error) {
                toast.error(error.response?.data || error.message );
                throw error;
            
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, isValid }) => (
                <Form className="h-full flex flex-col gap-4 max-w-md mx-auto justify-center my-8 px-2">
                    <div className="text-center ">
                        <h1 className="font-bold font-inria-sans pb-2 text-lg text-secondary mt-9 text-left">
                            Create Account
                        </h1>
                    </div>
                    <span className="underline bg-secondary h-0.5 mb-6 w-36"></span>

                    {/* First Name and Last Name */}
                    <div className="flex gap-4 flex-col md:flex-row lg:flex-row">
                        <div className="flex flex-col w-full">
                            <label
                                htmlFor="firstName"
                                className="font-ink-free flex items-center"
                            >
                                <AiOutlineUser className="mr-2" />
                                First Name
                            </label>
                            <Field
                                type="text"
                                id="firstName"
                                name="firstName"
                                placeholder="Enter your first name"
                                className="border py-2 px-4 rounded w-full text-sm focus:outline-none focus:ring focus:ring-secondary"
                            />
                            <ErrorMessage
                                name="firstName"
                                component="div"
                                className="text-red-500 text-sm"
                            />
                        </div>

                        <div className="flex flex-col w-full">
                            <label
                                htmlFor="lastName"
                                className="font-ink-free flex items-center"
                            >
                                <AiOutlineUser className="mr-2" />
                                Last Name
                            </label>
                            <Field
                                type="text"
                                id="lastName"
                                name="lastName"
                                placeholder="Enter your last name"
                                className="border py-2 px-4 rounded w-full text-sm focus:outline-none focus:ring focus:ring-secondary"
                            />
                            <ErrorMessage
                                name="lastName"
                                component="div"
                                className="text-red-500 text-sm"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
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
                            className="border py-2 px-4 rounded w-full focus:outline-none focus:ring focus:ring-secondary"
                        />
                        <ErrorMessage
                            name="email"
                            component="div"
                            className="text-red-500 text-sm"
                        />
                    </div>

                    {/* Phone Number Field */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="phoneNumber"
                            className="font-ink-free flex items-center"
                        >
                            <AiOutlinePhone className="mr-2" />
                            Phone Number
                        </label>
                        <Field
                            type="text"
                            id="phoneNumber"
                            name="phoneNumber"
                            placeholder="Enter your phone number"
                            className="border py-2 px-4 rounded w-full text-sm focus:outline-none focus:ring focus:ring-secondary"
                        />
                        <ErrorMessage
                            name="phoneNumber"
                            component="div"
                            className="text-red-500 text-sm"
                        />
                    </div>

                    {/* Password and Confirm Password */}
                    <div className="flex gap-4 flex-col md:flex-row lg:flex-row">
                        <div className="flex flex-col w-full relative">
                            <label
                                htmlFor="password"
                                className="font-ink-free flex items-center"
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

                        <div className="flex flex-col w-full relative">
                            <label
                                htmlFor="confirmPassword"
                                className="font-ink-free flex items-center"
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
                    </div>

                    {/* Category */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="category"
                            className="font-ink-free flex items-center"
                        >
                            <AiOutlineUser className="mr-2" />
                            Category
                        </label>
                        <Field
                            as="select"
                            id="category"
                            name="category"
                            className="border py-2 px-4 rounded w-full focus:outline-none focus:ring focus:ring-secondary"
                        >
                            <option value="">Select category</option>
                            <option value="O level">O Level</option>
                            <option value="undergraduate">
                                {" "}
                                undergraduate
                            </option>
                            <option value="graduate">graduate</option>
                        </Field>
                        <ErrorMessage
                            name="category"
                            component="div"
                            className="text-red-500 text-sm"
                        />
                    </div>

                    {/* Address */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="address"
                            className="font-ink-free flex items-center"
                        >
                            <FaMapMarkerAlt className="mr-2" />
                            Address
                        </label>
                        <Field
                            type="text"
                            id="address"
                            name="address"
                            placeholder="City, State"
                            className="border py-2 px-4 rounded w-full focus:outline-none focus:ring focus:ring-secondary"
                        />
                        <ErrorMessage
                            name="address"
                            component="div"
                            className="text-red-500 text-sm"
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        text={isSubmitting ? "Submitting..." : "Register"}
                        type="submit"
                        className="mt-6 text-white hover:bg-white hover:text-secondary hover:border-secondary hover:border"
                        disabled={!isValid || isSubmitting}
                        loading={isSubmitting}
                    />

                    <div className="mt-8 text-sm text-center">
                        <p>
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-bold hover:text-secondary hover:underline transition duration-300 ease-in-out"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default SignUp;
