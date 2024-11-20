import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Button from "../common/Button";
import DarkLogo from "../common/DarkLogo";
import { useNavigate } from "react-router-dom";
import { verifyEmail } from "../../services/api";


const EmailVerification = ({ email }) => {
    const [isResending, setIsResending] = useState(false); // Track resend status
    const navigate = useNavigate();

    // Validation schema for Formik
    const validationSchema = Yup.object({
        otp: Yup.string()
            .matches(/^\d{6}$/, "Please enter a 6-digit OTP.")
            .required("OTP is required."),
    });

    // Handle form submission
    const handleSubmit = async (values, { setSubmitting, setStatus }) => {
        setSubmitting(true);
        setStatus(null);

        try {
            const response = await verifyEmail(values.email, values.otp);
           
            // Handle successful response
            if (response.success) {
                console.log("Email verified:", response.data);
                navigate("/dashboard"); // Redirect on success
            } else {
                setStatus({
                    error: response.message || "Verification failed.",
                });
            }
        } catch (err) {
            // Handle error response
            console.error("Error:", err.response?.data || err.message);
            setStatus({
                error: err.response?.data?.message || "An error occurred. Please try again.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    // Handle OTP resend
    const handleResendOtp = async () => {
        setIsResending(true);

        try {
            const response = await axios.post("/resend-otp", { email });
            console.log("OTP Resent:", response.data);
            alert("A new OTP has been sent to your email.");
        } catch (err) {
            console.error("Error:", err.response?.data || err.message);
            alert("Failed to resend OTP. Please try again.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="flex h-screen w-screen bg-secondary justify-center items-center font-inria-sans">
            <div className="bg-white lg:w-2/5 w-1/2 h-1/2 shadow-lg rounded flex flex-col justify-center items-center gap-2">
                <DarkLogo />
                <p className="text-sm -mt-2 pb-2 font-ink-free">
                    We've sent a 6-digit code to{" "}
                    <span className="font-bold">{email}</span>
                </p>
                <p className="text-sm font-bold mt-2 pb-2 font-inria-sans">
                    Enter the code
                </p>

                <Formik
                    initialValues={{ otp: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({
                        values,
                        errors,
                        touched,
                        isSubmitting,
                        handleChange,
                        handleBlur,
                        setFieldValue,
                        setFieldTouched,                        status,
                    }) => (
                        <Form className="flex flex-col items-center gap-4">
                            <div className="flex gap-1">
                                {[...Array(6)].map((_, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        name="otp"
                                        type="text"
                                        value={values.otp[index] || ""}
                                        onChange={(e) => {
                                            const newOtp = values.otp.split("");
                                            newOtp[index] =
                                                e.target.value.replace(
                                                    /\D/,
                                                    ""
                                                );
                                            setFieldValue(
                                                "otp",
                                                newOtp.join("")
                                            );
                                            if (e.target.value && index < 5) {
                                                document
                                                    .getElementById(
                                                        `otp-${index + 1}`
                                                    )
                                                    .focus();
                                            }
                                        }}
                                        onBlur={(e) => {
                                            setFieldTouched("otp", true);
                                            handleBlur(e);
                                        }}
                                        className={`border rounded-xl w-10 h-12 text-center ${
                                            errors.otp && touched.otp
                                                ? "border-red-500"
                                                : "border-secondary"
                                        }`}
                                        maxLength="1"
                                    />
                                ))}
                            </div>

                            {errors.otp && touched.otp && (
                                <p className="text-red-500 text-sm">
                                    {errors.otp}
                                </p>
                            )}

                            {status?.error && (
                                <p className="text-red-500 text-sm">
                                    {status.error}
                                </p>
                            )}

                            <Button
                                text={
                                    isSubmitting ? "Verifying..." : "Continue"
                                }
                                type="submit"
                                className="bg-secondary text-white border border-white hover:bg-white hover:text-secondary hover:border-secondary"
                                disabled={isSubmitting}
                            />

                            <p
                                className="text-sm pt-3 font-ink-free cursor-pointer"
                                onClick={handleResendOtp}
                            >
                                {isResending
                                    ? "Resending OTP..."
                                    : "Resend OTP"}
                            </p>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default EmailVerification;
