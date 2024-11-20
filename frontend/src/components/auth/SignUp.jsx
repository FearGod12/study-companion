import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../common/Button";
import { AiOutlineUser, AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { createUser } from "../../services/api"; // Import createUser API function

const SignUp = () => {
    const navigate = useNavigate();

    const initialValues = {
        firstName: "",
        lastName: "",
        email: "",
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
            .matches(
                /[@$!%*?&]/,
                "Password must contain at least one special character."
            )
            .required("Password is required."),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match.")
            .required("Confirm password is required."),
        category: Yup.string().required("Please select a category."),
        address: Yup.string()
            .min(5, "Address must be at least 5 characters long.")
            .required("Address is required."),
    });

   const handleSubmit = async (values, { setSubmitting }) => {
       try {
           const response = await createUser(values);
           alert(`User created successfully: ${response.message}`);
           console.log("Signup successful:", response.data);

           if (response && response.data && response.data.verificationToken) {
               alert("Please check your email for the verification link.");
               navigate("/verify-email", { state: { email: values.email } });
           }
       } catch (error) {
           console.error(
               "Signup error:",
               error.response?.data || error.message
           );
           const errorMessage =
               error.response?.data?.message ||
               error.message ||
               "An unexpected error occurred.";
           alert(`Error: ${errorMessage}`);
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
            {({ isSubmitting, isValid, touched }) => (
                <Form className="h-screen flex flex-col gap-4 max-w-md mx-auto justify-center">
                    <div className="text-center">
                        <h1 className="font-bold font-inria-sans pb-4 text-2xl text-secondary">
                            Create Account
                        </h1>
                    </div>

                    <div className="flex gap-4 flex-col md:flex-row lg:flex-row">
                        <div className="flex flex-col w-full">
                            <label
                                htmlFor="firstName"
                                className="font-ink-free flex"
                            >
                                <AiOutlineUser className="mr-2" />
                                First Name
                            </label>
                            <Field
                                type="text"
                                id="firstName"
                                name="firstName"
                                placeholder="Please input first name"
                                className="border py-2 px-4 rounded w-full text-sm focus:outline-none focus:ring focus:ring-secondary"
                            />
                            <ErrorMessage
                                name="firstName"
                                component="div"
                                className="error text-red-500 text-sm"
                            />
                        </div>

                        <div className="flex flex-col w-full">
                            <label
                                htmlFor="lastName"
                                className="font-ink-free flex"
                            >
                                <AiOutlineUser className="mr-2" />
                                Last Name
                            </label>
                            <Field
                                type="text"
                                id="lastName"
                                name="lastName"
                                placeholder="Please input last name"
                                className="border py-2 px-4 rounded w-full text-sm focus:outline-none focus:ring focus:ring-secondary"
                            />
                            <ErrorMessage
                                name="lastName"
                                component="div"
                                className="error text-red-500 text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="email" className="font-ink-free flex">
                            <AiOutlineMail className="mr-2" />
                            Email
                        </label>
                        <Field
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            className="border py-2 px-4 rounded w-full focus:outline-none focus:ring focus:ring-secondary"
                        />
                        <ErrorMessage
                            name="email"
                            component="div"
                            className="error text-red-500 text-sm"
                        />
                    </div>

                    <div className="flex gap-4 flex-col md:flex-row lg:flex-row">
                        <div className="flex flex-col w-full">
                            <label
                                htmlFor="password"
                                className="font-ink-free flex"
                            >
                                <AiOutlineLock className="mr-2" />
                                Password
                            </label>
                            <Field
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Please input password"
                                className="border py-2 px-4 rounded w-full text-sm focus:outline-none focus:ring focus:ring-secondary"
                            />
                            <ErrorMessage
                                name="password"
                                component="div"
                                className="error text-red-500 text-sm"
                            />
                        </div>

                        <div className="flex flex-col w-full">
                            <label
                                htmlFor="confirmPassword"
                                className="font-ink-free flex"
                            >
                                <AiOutlineLock className="mr-2" />
                                Confirm Password
                            </label>
                            <Field
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Please verify password"
                                className="border py-2 px-4 rounded w-full text-sm focus:outline-none focus:ring focus:ring-secondary"
                            />
                            <ErrorMessage
                                name="confirmPassword"
                                component="div"
                                className="error text-red-500 text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label
                            htmlFor="category"
                            className="font-ink-free flex"
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
                            <option value="o level">O Level</option>
                            <option value="undergraduate">Undergraduate</option>
                            <option value="graduate">Graduate</option>
                        </Field>
                        <ErrorMessage
                            name="category"
                            component="div"
                            className="error text-red-500 text-sm"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="address" className="font-ink-free flex">
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
                            className="error text-red-500 text-sm"
                        />
                    </div>

                    <Button
                        text={isSubmitting ? "Submitting..." : "Register"}
                        type="submit"
                        className="mt-6 text-white hover:bg-white hover:text-secondary hover:border-secondary hover:border"
                        disabled={!isValid || isSubmitting}
                    />

                    <div className="mt-8 font-inria-sans text-sm">
                        <p>
                            Already have an account?{" "}
                            <span className="font-bold transition ease-in-out duration-300 hover:text-secondary">
                                <Link to="/login">Login</Link>
                            </span>
                        </p>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default SignUp;
