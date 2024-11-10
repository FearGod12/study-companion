import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../Home/Common/Button";
import { useState } from "react";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { Link } from "react-router-dom";

const Login = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const initialValues = {
        email: "",
        password: "",
    };

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Invalid email address.")
            .required("Email is required."),
        password: Yup.string()
            .min(8, "Password must be at least 8 characters long.")
            .required("Password is required."),
    });

    const handleSubmit = (values, { resetForm }) => {
        setIsSubmitting(true);
        setTimeout(() => {
            console.log("Logged in successfully!", values);
            resetForm();
            setIsSubmitting(false);
        }, 2000); // Simulate async login
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isValid }) => (
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
                        <Field
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            className="border py-2 pl-10 pr-4 rounded w-full focus:outline-none focus:ring focus:ring-secondary text-sm"
                        />
                        <ErrorMessage
                            name="password"
                            component="div"
                            className="text-red-500 text-sm"
                        />
                    </div>

                    <Link to="/signup" className="text-sm">
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
                            Dont have an account?{" "}
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
