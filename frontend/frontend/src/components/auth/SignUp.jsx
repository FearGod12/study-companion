import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../Home/Common/Button";
import { AiOutlineUser, AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const SignUp = () => {
    const navigate = useNavigate();

    const initialValues = {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmpassword: "",
        category: "",
        address: "",
    };

    const validationSchema = Yup.object({
        firstname: Yup.string()
            .min(2, "First name must be at least 2 characters long.")
            .required("First name is required."),
        lastname: Yup.string()
            .min(2, "Last name must be at least 2 characters long.")
            .required("Last name is required."),
        email: Yup.string()
            .email("Invalid email address.")
            .required("Email is required."),
        password: Yup.string()
            .min(8, "Password must be at least 8 characters long.")
            .required("Password is required."),
        confirmpassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match.")
            .required("Confirm password is required."),
        category: Yup.string().required("Please select a category."),
        address: Yup.string()
            .min(5, "Address must be at least 5 characters long.")
            .required("Address is required."),
    });

    const handleSubmit = (event, values, { resetForm, setSubmitting }) => {
        event.preventDefault();
        setSubmitting(true);
        setTimeout(() => {
            console.log("Form submitted successfully!", values);
            resetForm();
            setSubmitting(false);
            navigate("/verify-email");
        }, 2000);
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
                        <div className="flex flex-col">
                            <label
                                htmlFor="firstname"
                                className="font-ink-free flex"
                            >
                                <AiOutlineUser className="mr-2" />
                                First Name
                            </label>
                            <Field
                                type="text"
                                id="firstname"
                                name="firstname"
                                placeholder="Please input firstname"
                                className="border py-2 px-4 rounded w-full text-sm focus:outline-none focus:ring focus:ring-secondary"
                            />
                            <ErrorMessage
                                name="firstname"
                                component="div"
                                className="error text-red-500 text-sm"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label
                                htmlFor="lastname"
                                className="font-ink-free flex"
                            >
                                <AiOutlineUser className="mr-2" />
                                Last Name
                            </label>
                            <Field
                                type="text"
                                id="lastname"
                                name="lastname"
                                placeholder="Please input lastname"
                                className="border py-2 px-4 rounded w-full text-sm focus:outline-none focus:ring focus:ring-secondary"
                            />
                            <ErrorMessage
                                name="lastname"
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
                        <div className="flex flex-col">
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
                                className="border py-2 px-4 rounded w-full focus:outline-none focus:ring focus:ring-secondary"
                            />
                            <ErrorMessage
                                name="password"
                                component="div"
                                className="error text-red-500 text-sm"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label
                                htmlFor="confirmpassword"
                                className="font-ink-free flex"
                            >
                                <AiOutlineLock className="mr-2" />
                                Confirm Password
                            </label>
                            <Field
                                type="password"
                                id="confirmpassword"
                                name="confirmpassword"
                                placeholder="Please verify password"
                                className="border py-2 px-4 rounded w-full focus:outline-none focus:ring focus:ring-secondary"
                            />
                            <ErrorMessage
                                name="confirmpassword"
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
                            <option value="olevel">O Level</option>
                            <option value="undergraduate">Undergraduate</option>
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
