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
      <div className="bg-gray-150 shadow shadow-accent-dark lg:py-24 lg:px-12 md:py-20 md:px-10 py-12 px-2 rounded-xl">
       <h1 className="font-bold text-accent-dark mb-3 text-center lg:text-left md:text-left lg:text-4xl md:text-3xl text-3xl hover:scale-105 transition delay-200 ease-in-out">
        Study Companion
      </h1>
      <p className="lg:max-w-lg md:max-w-md max-w-md lg:text-left md:text-left text-center lg:text-xl md:text-xl text-lg mt-3">
        Plan your study sessions, stay focused, and achieve your academic goals
        with ease.
      </p>
      <Link href="/memberRegistration">
        <Button
          text="Get Started"
          className="mt-4 bg-accent text-gray-100 hover:bg-accent-dark hover:text-gray-100 hover:border-gray-100 hover:border px-6 py-2 lg:mx-0 md:mx-0 mx-auto"
        />
      </Link> 
      </div>
      
    </motion.div>
  );
};


export default Hero;