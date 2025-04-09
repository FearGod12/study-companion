import DarkLogo from "@/components/common/logo/DarkLogo";
import Link from "next/link";
import { FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-10 px-6 flex flex-col justify-center items-center">
      <div className="max-w-6xl grid md:grid-cols-3 gap-10 lg:text-base md:text:base text-sm py-2 px-6 justify-items-center">
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold mb-3 text-accent">
            StudyCompanion
          </h2>
          <p className="opacity-80">
            Your personal study partner for planning, focusing, and succeeding.
          </p>
          <DarkLogo />
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li className="hover:underline">Home</li>
            <li className="hover:underline">Features</li>

            <Link href="/auth/login">
              {" "}
              <li className="hover:underline">Login</li>
            </Link>
            <Link href="/memberRegistration">
              <li className="hover:underline">Get Started</li>
            </Link>
          </ul>
        </div>

        {/* Socials / Contact */}
        <div>
          <h3 className="font-semibold mb-3">Connect</h3>
          <div className="flex gap-4 text-lg">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-xs text-accent font-semibold opacity-70">
        &copy; {new Date().getFullYear()} StudyCompanion. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
