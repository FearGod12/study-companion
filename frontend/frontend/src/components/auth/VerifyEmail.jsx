import Button from "../Common/Button";
import Logo from "../Common/Logo";

const VerifyEmail = () => {
    return (
        <div className="flex h-screen w-screen bg-secondary justify-center items-center font-inria-sans">
            <div className="bg-white lg:w-2/5 w-1/2 h-1/2 shadow-lg shadow-white rounded flex flex-col justify-center items-center gap-2">
                <Logo />
                <p className="text-sm -mt-2 pb-2 font-ink-free">
                    We've sent a 6 digit code to <span className="font-bold"></span>
                </p>
                <p className="text-sm font-bold mt-2 pb-2 font-inria-sans">
                    Enter the code
                </p>
               
                <div className="flex gap-1">
                    <input
                        type="number"
                        name=""
                        id=""
                        className=" border border-secondary rounded-xl md:w-6 lg:w-6 w-4 md:px-6 lg:px-6 px-4 py-2"
                    />
                    <input
                        type="number"
                        name=""
                        id=""
                        className=" border border-secondary rounded-xl md:w-6 lg:w-6 w-4 md:px-6 lg:px-6 px-4 py-2"
                    />
                    <input
                        type="number"
                        name=""
                        id=""
                        className=" border border-secondary rounded-xl md:w-6 lg:w-6 w-4 md:px-6 lg:px-6 px-4 py-2"
                    />
                    <input
                        type="number"
                        name=""
                        id=""
                        className=" border border-secondary rounded-xl md:w-6 lg:w-6 w-4 md:px-6 lg:px-6 px-4 py-2"
                    />
                    <input
                        type="number"
                        name=""
                        id=""
                        className=" border border-secondary rounded-xl md:w-6 lg:w-6 w-4 md:px-6 lg:px-6 px-4 py-2"
                    />
                    <input
                        type="number"
                        name=""
                        id=""
                        className=" border border-secondary rounded-xl md:w-6 lg:w-6 w-4 md:px-6 lg:px-6 px-4 py-2"
                    />
                </div>
                <p className="text-sm pt-3 font-ink-free">
                   Resend OTP
                </p>

                <Button
                    text="Continue"
                    className="bg-secondary text-white border border-white hover:bg-white hover:text-secondary hover:border-secondary"
                />
            </div>
        </div>
    );
};

export default VerifyEmail;
