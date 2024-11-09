import Navbar from "./Common/Navbar";
import Logo from "./Common/Logo";

const Header = () => {
    return (
        <div className="flex justify-between items-center px-20 h-32">
            <Logo />
            <Navbar />
        </div>
    );
};

export default Header;
