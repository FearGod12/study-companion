import Navbar from "./Navbar";
import DarkLogo from "./DarkLogo";

const Header = () => {
    return (
        <div className="flex justify-between items-center px-20 h-32">
            <DarkLogo />
            <Navbar />
        </div>
    );
};

export default Header;
