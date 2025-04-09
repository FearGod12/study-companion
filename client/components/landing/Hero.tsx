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
      <h1 className="font-bold text-accent mb-3 text-center lg:text-left md:text-left lg:text-4xl md:text-3xl text-xl">
        Study Companion
      </h1>
      <p className="lg:max-w-lg md:max-w-md max-w-md lg:text-left md:text-left text-center lg:text-lg md:text-base text-sm">
        Plan your study sessions, stay focused, and achieve your academic goals
        with ease.
      </p>
      <Link href="/memberRegistration">
        <Button
          text="Get Started"
          className="mt-4 text-white hover:bg-white hover:text-accent hover:border-accent hover:border"
        />
      </Link>
    </motion.div>
  );
};


export default Hero;