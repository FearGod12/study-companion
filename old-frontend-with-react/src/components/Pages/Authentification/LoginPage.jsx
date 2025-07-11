import Login from "../../auth/Login";
import LoginBackground from "../../../assets/Image/img-3.png";
// import Button from "../../common/Button";
// import { Link } from "react-router-dom"; // Import Link for navigation

const LoginPage = () => {
    return (
        <div className="flex h-screen w-screen">
            {/* Left section with login form */}
            <div className="flex-1 p-6 lg:px-12 flex flex-col justify-center">
                <Login />
            </div>

            {/* Right section with background image and welcome message */}
            <div className="flex-1 lg:flex lg:flex-col hidden bg-secondary shadow-lg shadow-secondary h-screen justify-center items-center relative">
                <div className="py-4 mt-6 text-center mx-4">
                    <h2 className="text-4xl font-inria-sans font-bold text-gray-100">
                        Welcome to{" "}
                        <span className="font-light">Study Companion</span>
                    </h2>
                    <p className="text-sm text-gray-100 mt-2">
                        Login to access your account
                    </p>
                </div>
                {/* Responsive image */}
                <div className="mt-4 w-full h-full flex justify-center items-center">
                    <img
                        src={LoginBackground}
                        alt="Study Companion"
                        className="w-full h-auto max-w-md" // Ensure the image is responsive
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
