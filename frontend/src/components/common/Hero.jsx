import { Link } from "react-router-dom";
import Button from "./Button";

const Hero = () => {
    return (
        <div className="flex flex-col lg:items-left md:items-start items-center ">
            <h1 className="font-inria-sans text-4xl font-bold text-secondary mb-3">
                Study Campanion
            </h1>
            <p className="w-64 font-ink-free lg:text-left md:text-left text-center">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
            <Link to="/get-started">
                <Button
                    text="Get Started"
                    className="mt-4 text-white hover:bg-white hover:text-secondary hover:border-secondary hover:border"
                />
            </Link>
        </div>
    );
};

export default Hero;
