import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineLock,
  AiOutlinePhone,
} from "react-icons/ai";
import { FaMapMarkerAlt } from "react-icons/fa";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useAuthSignup } from "@/hooks/useAuthSignup";
import { signUpSchema } from "@/validations/signUpSchema";
import { withZodSchema } from "formik-validator-zod";
import Link from "next/link";
import { useEffect } from "react";
import Button from "./common/Button";


const ScrollToErrorOnSubmit = () => {
  const { submitCount } = useFormikContext();

  useEffect(() => {
    if (submitCount > 0) {
      const timeout = setTimeout(() => {
        const firstInvalidElement = document.querySelector(
          ".text-red-500, [aria-invalid='true']"
        );
        if (firstInvalidElement) {
          firstInvalidElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          (firstInvalidElement as HTMLElement).focus();
        }
      }, 100); // Let the DOM settle
  
      return () => clearTimeout(timeout);
    }
  }, [submitCount]);

  return null;
};

const SignUp = () => {
  const { initialValues, handleSubmit, showPassword, togglePassword } = useAuthSignup();

  return (
    <Formik
      initialValues={initialValues}
      validate={withZodSchema(signUpSchema)}
      onSubmit={handleSubmit}
      validateOnBlur={true}
    >
      {({ isSubmitting, isValid, values, setFieldValue }) => (
        <Form className="h-full flex flex-col gap-4 max-w-lg mx-auto justify-center my-8 lg:text-base md:text-base text-sm">
          <ScrollToErrorOnSubmit />

          <div className="text-center">
            <h1 className="font-bold pb-2 lg:text-lg md:text-base text-base text-accent mt-9 text-left">
              Register
            </h1>
          </div>
          <span className="underline bg-accent h-0.5 mb-6 w-36"></span>

          {/* First Name and Last Name */}
          <div className="flex gap-4 flex-col md:flex-row lg:flex-row">
            {["firstName", "lastName"].map((name, idx) => (
              <div className="flex flex-col w-full" key={name}>
                <label htmlFor={name} className="flex items-center mb-1">
                  <AiOutlineUser className="mr-2" /> {idx === 0 ? "First Name" : "Last Name"}
                </label>
                <Field
                  type="text"
                  id={name}
                  name={name}
                  placeholder={`Enter your ${idx === 0 ? "first" : "last"} name`}
                  className="border-2 border-accent py-2 px-4 rounded w-full text-sm focus:outline-none focus:ring focus:ring-accent"
                />
                <ErrorMessage
                  name={name}
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            ))}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="flex items-center mb-1">
              <AiOutlineMail className="mr-2" /> Email
            </label>
            <Field
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="border-2 border-accent py-2 px-4 rounded w-full focus:outline-none focus:ring focus:ring-accent"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col">
            <label htmlFor="phoneNumber" className="flex items-center mb-1">
              <AiOutlinePhone className="mr-2" /> Phone Number
            </label>
            <Field
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Enter your phone number"
              className="border-2 border-accent py-2 px-4 rounded w-full text-sm focus:outline-none focus:ring focus:ring-accent"
            />
            <ErrorMessage
              name="phoneNumber"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

            {/* Category */}
            <div className="flex flex-col">
            <label htmlFor="category" className="flex items-center mb-1">
              <AiOutlineUser className="mr-2" /> Category
            </label>
            <Field
              as="select"
              id="category"
              name="category"
              className="border-2 border-accent py-2 px-4 rounded w-full focus:outline-none focus:ring focus:ring-accent"
              value={values.category}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFieldValue("category", e.target.value)
              }
            >
              <option value="" disabled>
                Select category
              </option>
              <option value="OLEVEL">O Level</option>
              <option value="UNDERGRADUATE">Undergraduate</option>
              <option value="GRADUATE">Graduate</option>
            </Field>
            <ErrorMessage
              name="category"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Address */}
          <div className="flex flex-col">
            <label htmlFor="address" className="flex items-center mb-1">
              <FaMapMarkerAlt className="mr-2" /> Address
            </label>
            <Field
              type="text"
              id="address"
              name="address"
              placeholder="City, State"
              className="border-2 border-accent py-2 px-4 rounded w-full focus:outline-none focus:ring focus:ring-accent"
            />
            <ErrorMessage
              name="address"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>


          {/* Password and Confirm Password */}
          {["password", "confirmPassword"].map((field) => (
            <div key={field} className="flex flex-col w-full relative">
              <label htmlFor={field} className="flex items-center mb-1">
                <AiOutlineLock className="mr-2" />
                {field === "password" ? "Password" : "Confirm Password"}
              </label>
              <div className="relative">
                <Field
                  type={showPassword[field] ? "text" : "password"}
                  id={field}
                  name={field}
                  placeholder={
                    field === "password"
                      ? "Enter your password"
                      : "Confirm your password"
                  }
                  className="border-2 border-accent py-2 px-4 rounded w-full text-sm focus:outline-none focus:ring focus:ring-accent"
                />
                <button
                  type="button"
                  onClick={() => togglePassword(field)}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword[field] ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>
              <ErrorMessage
                name={field}
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          ))}

          {/* Submit Button */}
          <Button
            text={isSubmitting ? "Registering..." : "Register"}
            className="mt-6 group bg-accent text-white hover:bg-white hover:text-accent hover:border-accent hover:border px-12 py-3"
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
          />

          {/* Login Redirect */}
          <div className="lg:text-base md:text-base text-sm text-right">
            <p>
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-bold hover:text-accent hover:underline transition duration-300 ease-in-out"
              >
                <span className="text-accent">Login</span>
              </Link>
            </p>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SignUp;
