import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../../common/Button";
import { useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import axios from "axios";

const ForgotPassword = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // For specific error messages

    const initialValues = {
        email: "",
    };

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Invalid email address.")
            .required("Email is required."),
    });

    const handleSubmit = async (values, { resetForm }) => {
        setIsSubmitting(true);
        setMessage("");
        setErrorMessage(""); // Reset error message

        try {
            const response = await axios.post("/forgot-password", {
                email: values.email,
            });

            console.log("Response:", response.data);
            setMessage("Password reset instructions sent to your email.");
            resetForm();
        } catch (error) {
            console.error(
                "Forgot Password Error:",
                error.response?.data || error.message
            );

            if (error.response?.data?.message) {
                setErrorMessage(error.response?.data?.message);
            } else {
                setErrorMessage(
                    "Unable to send reset instructions. Please try again."
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full p-6 bg-white shadow-md rounded">
                <h1 className="text-2xl font-bold text-center text-secondary mb-6">
                    Forgot Password
                </h1>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isValid }) => (
                        <Form className="flex flex-col gap-4">
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
                                    className="border py-2 pl-10 pr-4 rounded w-full focus:outline-none focus:ring focus:ring-secondary text-sm"
                                    aria-label="Enter your email"
                                />
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>

                            {message && (
                                <div className="text-sm text-center text-green-500">
                                    {message}
                                </div>
                            )}

                            {errorMessage && (
                                <div className="text-sm text-center text-red-500">
                                    {errorMessage}
                                </div>
                            )}

                            <Button
                                text={
                                    isSubmitting
                                        ? "Sending..."
                                        : "Send Reset Instructions"
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

export default ForgotPassword;
