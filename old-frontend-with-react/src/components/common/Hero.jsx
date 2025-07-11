import { Link } from "react-router-dom";
import Button from "./Button";

const Hero = () => {
    return (
        <div className="flex flex-col lg:items-left md:items-start items-center">
            <h1 className="font-inria-sans text-4xl font-bold text-secondary mb-3 text-center lg:text-left md:text-left">
                Study Campanion
            </h1>
            <p className="w-64 font-ink-free lg:text-left md:text-left text-center">
                Plan your study sessions, stay focused, and achieve your academic goals with ease.
            </p>
            <Link to="/welcome">
                <Button
                    text="Get Started"
                    className="mt-4 text-white hover:bg-white hover:text-secondary hover:border-secondary hover:border"
                />
            </Link>
        </div>
    );
};

export default Hero;
