import Login from "./auth/Login";
import LoginBackground from "../assets/Image/img-3.png";
import Button from "./Common/Button";

const LoginPage = () => {
    return (
        <div className="flex h-screen w-screen">
            <div className="flex-1">
                <Login />
                <div className="border">
                    <p>Dont have an account? </p>
                    <Button text="Sign Up" />
                </div>
            </div>
            <div className="flex-1 lg:flex lg:flex-col hidden bg-secondary shadow-lg shadow-secondary h-screen justify-center items-center ">
                <div className="py-4">
                    <h2 className="text-4xl font-inria-sans font-bold text-gray-100 text-wrap mx-4">
                        Welcome to <span className="font-light">study companion</span>
                    </h2>
                    <p className="text-sm text-gray-100 mt-2 mx-4">Login to access your account</p>
                </div>
                <div className="mt-4">
                    <img
                        src={LoginBackground}
                        alt=""
                        className="flex justify-center items-center"
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
