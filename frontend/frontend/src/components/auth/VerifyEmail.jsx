import Button from "../Common/Button";
import Logo from "../Common/Logo";

const VerifyEmail = () => {
    return (
        <div className="flex h-screen w-screen bg-secondary justify-center items-center font-inria-sans">
            <div className="bg-white lg:w-2/5 w-1/2 h-1/2 shadow-lg shadow-white rounded flex flex-col justify-center items-center gap-2">
                <Logo />
                <h2 className="text-lg">Enter Verification code</h2>
                <p className="text-sm -mt-2 pb-2">We've sent a code to <span className="font-bold"></span></p>
                <div className="flex gap-1">
                    <input
                        type="number"
                        name=""
                        id=""
                        className=" border border-secondary rounded w-6 px-6 py-2"
                    />
                    <input
                        type="number"
                        name=""
                        id=""
                        className=" border border-secondary rounded w-6 px-6 py-2"
                    />
                    <input
                        type="number"
                        name=""
                        id=""
                        className=" border border-secondary rounded w-6 px-6 py-2"
                    />
                    <input
                        type="number"
                        name=""
                        id=""
                        className=" border border-secondary rounded w-6 px-6 py-2"
                    />
                </div>
                <p className="text-sm pt-3">
                    Didn't get a code? <span className="font-bold">Click to resend</span>{" "}
                </p>
                <div className="flex gap-2">
                    <Button text="Cancel" className="bg-white text-secondary border border-secondary hover:bg-secondary hover:text-white"
        />
                    <Button text="Verify"
                    className="bg-secondary text-white border border-white hover:bg-white hover:text-secondary hover:border-secondary" />
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
