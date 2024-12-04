import LightLogo from "./LightLogo";
import Button from "./Button";
import planImage from "../../assets/Image/img-3.png";

const Subscription = () => {
    return (
        <div className="flex gap-1 pl-6 h-full text-gray-100 items-center">
            <div className="">
                <LightLogo />
                <div className="mt-4">
                    <h2 className="font-bold lg:text-xl md:text-xl">Go Premium</h2>
                    <p className="font-ink-free text-sm">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.{" "}
                    </p>
                </div>
                <Button
                    text="Get Access"
                    className="mt-4 mb-4 bg-white text-secondary transition ease-in-out duration-500 hover:scale-105"
                />
            </div>
            <div className="lg:flex hidden">
                <img src={planImage} alt="" 
                />
            </div>
        </div>
    );
};

export default Subscription;
