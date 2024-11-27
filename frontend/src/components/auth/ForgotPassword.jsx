import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../common/Button";
import { useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { requestPasswordReset } from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // Form initial values
    const initialValues = { email: "" };

    // Validation schema using Yup
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Invalid email address.")
            .required("Email is required."),
    });

    // Handle form submission
  const handleSubmit = async (values, { resetForm }) => {
      setIsSubmitting(true);

      try {
          const response = await requestPasswordReset(values.email);


         if (response && response.data && response.data.message) {
             toast.success(
                 response.data.message ||
                     "Password reset instructions sent to your email."
             );
             resetForm();
             navigate("/reset-password");
         } else {
             throw new Error("No valid response data received.");
         }
      } catch (error) {
          console.error("Forgot Password Error:", error);

          if (error.response.data) {
              toast.error(
                  error.response?.data?.message ||
                      "Unable to send reset instructions. Please try again."
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
                    Forgot Password
                </h1>
                <p className="text-sm text-gray-600 text-center mb-4">
                    Enter your email address below, and we'll send you password
                    reset instructions.
                </p>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isValid }) => (
                        <Form className="flex flex-col gap-4">
                            {/* Email Field */}
                            <div className="relative">
                                <AiOutlineMail className="absolute top-3 left-3 text-gray-400" />
                                <Field
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    className="border py-2 pl-10 pr-4 rounded w-full text-sm focus:outline-none focus:ring focus:ring-secondary"
                                    aria-label="Enter your email"
                                />
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            {/* Loader and button */}
                            <Button
                                text={
                                    isSubmitting ? (
                                        <span className="">
                                            <span className=""></span>
                                            Requesting...
                                        </span>
                                    ) : (
                                        "Request Password Reset"
                                    )
                                }
                                type="submit"
                                className="text-white hover:bg-white hover:text-secondary hover:border-secondary hover:border mt-4"
                                disabled={!isValid || isSubmitting}
                            />

                            {/* Instructions */}
                            <div className="text-sm text-center text-gray-600 mt-2">
                                <p>
                                    If you don't see the email, check your spam
                                    or junk folder.
                                </p>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default ForgotPassword;
