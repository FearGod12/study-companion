import Navbar from "./Navbar";
import LightLogo from "./LightLogo";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <div className="flex justify-between items-center px-20 py-4 bg-secondary">
            <LightLogo />
            <div className="flex items-center gap-6 flex-row-reverse lg:flex-row md:flex-row">
               <Navbar /> 
               <div className="text-secondary hover:bg-secondary bg-white hover:text-white hover:border-white hover:border rounded-lg px-4 py-2 font-bold">
                        
                        <button>
                            <Link to='/login'>
                            Login
                            </Link>
                        </button>
                        
                    </div>
            </div>
            
        </div>
    );
};

export default Header;
