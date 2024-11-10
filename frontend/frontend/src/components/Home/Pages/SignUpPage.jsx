import SignUp from "../../auth/SignUp";
import SignUpBackground from "../../../assets/Image/img-2.png";

const SignUpPage = () => {
    return (
        <div className="flex h-screen w-screen">
            <div className="flex-1 lg:flex hidden bg-secondary shadow-lg shadow-secondary">
                <div className="flex justify-center items-center h-screen flex-1">
                    <img
                        src={SignUpBackground}
                        alt=""
                        className="flex justify-center items-center"
                    />
                </div>
            </div>
            <div className="flex-1">
                <SignUp />
            </div>
        </div>
    );
};

export default SignUpPage;
