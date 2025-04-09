// OtpInput.tsx
import React from "react";
import { useField } from "formik";

type OtpInputProps = {
  name: string;         // The name of the form field storing the OTP (e.g., "otp")
  length?: number;      // Number of digits in the OTP (default is 6)
};

const OtpInput: React.FC<OtpInputProps> = ({ name, length = 6 }) => {
  // Use Formik’s useField to connect to the form state
  const [field, meta, helpers] = useField<string[]>(name);
  const { value } = field;
  const { setValue } = helpers;

  // Handler for changes in individual OTP inputs
  const handleChange = (index: number, newDigit: string) => {
    const cleaned = newDigit.replace(/\D/g, ""); // Only keep numeric characters
    const otpArray = Array.isArray(value) ? [...value] : Array(length).fill("");
    otpArray[index] = cleaned;
    setValue(otpArray);

    // Automatically move the focus to the next input if a digit was entered
    if (cleaned && index < length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }
  };

  // Handle key down events for navigation between inputs
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otpDigitAt(index) && index > 0) {
      // If the current field is empty, focus the previous input
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) (prevInput as HTMLInputElement).focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) (prevInput as HTMLInputElement).focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    } else if (e.key === "Enter") {
      // Submit the form when Enter is pressed
      e.currentTarget.form?.requestSubmit();
    }
  };

  // Helper to get the digit at a specific index (ensuring a string is returned)
  const otpDigitAt = (index: number) => {
    return Array.isArray(value) ? value[index] || "" : "";
  };

  return (
    <div className="flex gap-1">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          id={`otp-${index}`}
          type="text"
          value={otpDigitAt(index)}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          maxLength={1}
          className={`border rounded-xl w-10 h-12 text-center ${
            meta.touched && meta.error ? "border-red-500" : "border-accent"
          }`}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
      {meta.touched && typeof meta.error === "string" && (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      )}
    </div>
  );
};

export default OtpInput;