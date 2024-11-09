import Login from "./auth/Login";
import LoginBackground from "../assets/Image/img-3.png";

const LoginPage = () => {
    return (
        <div className="flex h-screen w-screen">
            <div className="flex-1">
                <Login/>
            </div>
            <div className="flex-1 lg:flex hidden bg-secondary shadow-lg shadow-secondary">
                <div className="flex justify-center items-center h-screen flex-1">
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
