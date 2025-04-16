import { motion } from "framer-motion";
import Button from "../common/Button";
import Link from "next/link";

const Hero = () => {
  return (
    <motion.div
      className="flex flex-col lg:items-left md:items-start items-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h1 className="font-bold text-gray-100 mb-3 text-center lg:text-left md:text-left lg:text-4xl md:text-3xl text-xl hover:scale-105 transition delay-200 ease-in-out">
        Study Companion
      </h1>
      <p className="lg:max-w-lg md:max-w-md max-w-md lg:text-left md:text-left text-center lg:text-lg md:text-base text-sm text-gray-100">
        Plan your study sessions, stay focused, and achieve your academic goals
        with ease.
      </p>
      <Link href="/memberRegistration">
        <Button
          text="Get Started"
          className="mt-4 bg-gray-100 text-accent hover:bg-accent hover:text-gray-100 hover:border-gray-100 hover:border p-2"
        />
      </Link>
    </motion.div>
  );
};


export default Hero;