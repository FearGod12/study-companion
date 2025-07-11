import SignUp from "../../auth/SignUp";
import SignUpBackground from "../../../assets/Image/img-2.png";

const SignUpPage = () => {
    return (
        <div className="flex w-full min-h-screen">
            {/* Left Div */}
            <div className="hidden lg:flex flex-1 bg-secondary min-h-screen">
                <div className="flex justify-center items-center w-full h-full">
                    <img
                        src={SignUpBackground}
                        alt="SignUp Background"
                        className="object-cover flex justify-center items-center"
                    />
                </div>
            </div>

            {/* Right Div */}
            <div className="flex-1 p-4 h-full">
                <SignUp />
            </div>
        </div>
    );
};

export default SignUpPage;
