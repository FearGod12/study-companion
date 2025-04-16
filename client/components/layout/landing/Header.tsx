import LightLogo from "@/components/common/logo/LightLogo";
import Navbar from "@/components/common/Navbar";
import Link from "next/link";

const Header = () => {
  return (
    <header className="flex justify-between items-center pl-4 pr-10 py-4 bg-accent fixed w-full shadow">
      <LightLogo />
      <div className="flex items-center gap-6 flex-row-reverse lg:flex-row md:flex-row">
        <Navbar />
        <div className="text-accent hover:bg-accent bg-gray-100 hover:text-gray-100 hover:border-gray-100 hover:border rounded-lg px-4 py-2 font-bold">
          <button>
            <Link href="/auth/login">Login</Link>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
