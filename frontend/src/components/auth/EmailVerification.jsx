import { useNavigate } from "react-router-dom";
import { useState} from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Button from "../common/Button";
import DarkLogo from "../common/DarkLogo";
import { verifyEmail } from "../../services/api";
import { toast } from "react-toastify";


const EmailVerification = () => {
    const [isResending, setIsResending] = useState(false);
   

    const navigate = useNavigate();

    const email = localStorage.getItem("email");

    const validationSchema = Yup.object({
        otp: Yup.string()
            .matches(/^\d{6}$/, "Please enter a valid 6-digit OTP.")
            .required("OTP is required."),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);
         toast.dismiss();



        // The token (OTP) is entered by the user, so it should be in values.otp
        const token = values.otp; // This will hold the OTP entered by the user

        try {
            // Call verifyEmail function, passing email and token (OTP entered by the user)
            const response = await verifyEmail(email, token);

            if (response.data?.success) {
                toast.success("Email verified successfully!");
                navigate("/login"); // Redirect to login after successful verification
            }
        } catch (error) {
            console.error(
                "Verification Error:",
                error.response?.data || error.message
            );
            toast.error(
                error.response?.data?.message ||
                    "An error occurred during verification."
            );
        } finally {
            setSubmitting(false);
        }
    }

    const handleResendOtp = async () => {
        setIsResending(true);
        toast.dismiss();

        try {
            // Replace with your OTP resend API endpoint
            const response = await axios.post("/user/resend-otp", { email });
            if (response.data?.success) {
               toast.success("A new OTP has been sent to your email.");
            } else {
                toast.error(response.data?.message || "Failed to resend OTP.");
            }
        } catch (err) {
            console.error("Resend OTP Error:", err.response?.data || err.message);
            toast.error("Failed to resend OTP. Please try again.");
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
                    {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                        <Form className="flex flex-col items-center gap-4">
                            {/* OTP Input Fields */}
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
                                            newOtp[index] = e.target.value.replace(/\D/, ""); // Allow only digits
                                            setFieldValue("otp", newOtp.join(""));

                                            // Focus next field if value is entered
                                            if (e.target.value && index < 5) {
                                                document
                                                    .getElementById(`otp-${index + 1}`)
                                                    ?.focus();
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            // Handle backspace navigation
                                            if (e.key === "Backspace" && !values.otp[index] && index > 0) {
                                                document.getElementById(`otp-${index - 1}`)?.focus();
                                            }
                                        }}
                                        className={`border rounded-xl w-10 h-12 text-center ${
                                            errors.otp && touched.otp ? "border-red-500" : "border-secondary"
                                        }`}
                                        maxLength="1"
                                    />
                                ))}
                            </div>

                            {errors.otp && touched.otp && (
                                <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
                            )}

                            <Button
                                text={isSubmitting ? "Verifying..." : "Continue"}
                                type="submit"
                                className="bg-secondary text-white border border-white hover:bg-white hover:text-secondary hover:border-secondary"
                                disabled={isSubmitting}
                            />

                            <p
                                className="text-sm pt-3 font-ink-free cursor-pointer"
                                onClick={!isResending ? handleResendOtp : null}
                            >
                                {isResending ? "Resending OTP..." : "Resend OTP"}
                            </p>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default EmailVerification;