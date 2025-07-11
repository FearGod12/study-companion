import { OtpInputProps } from "@/interfaces";
import { useField } from "formik";


const OtpInput: React.FC<OtpInputProps> = ({ name, length = 6 }) => {
  const [field, meta, helpers] = useField<string[]>(name);
  const { value } = field;
  const { setValue } = helpers;

  const getDigit = (index: number) => (Array.isArray(value) ? value[index] || "" : "");

  const handleChange = (index: number, digit: string) => {
    const cleaned = digit.replace(/\D/g, "");
    const updated = Array.from({ length }, (_, i) => getDigit(i));
    updated[index] = cleaned;
    setValue(updated);

    if (cleaned && index < length - 1) {
      const next = document.getElementById(`otp-${index + 1}`) as HTMLInputElement | null;
      next?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    const current = getDigit(index);

    if (e.key === "Backspace" && !current && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`) as HTMLInputElement | null;
      prev?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`) as HTMLInputElement | null;
      prev?.focus();
    }

    if (e.key === "ArrowRight" && index < length - 1) {
      const next = document.getElementById(`otp-${index + 1}`) as HTMLInputElement | null;
      next?.focus();
    }

    if (e.key === "Enter") {
      e.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <div className="flex gap-1">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          id={`otp-${index}`}
          type="text"
          inputMode="numeric"
          value={getDigit(index)}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          maxLength={1}
          className={`border rounded-xl w-10 h-12 text-center focus:outline-none ${
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
