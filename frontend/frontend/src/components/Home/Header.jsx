import Navbar from "./Common/Navbar";
import DarkLogo from "./Common/DarkLogo";

const Header = () => {
    return (
        <div className="flex justify-between items-center px-20 h-32">
            <DarkLogo />
            <Navbar />
        </div>
    );
};

export default Header;
