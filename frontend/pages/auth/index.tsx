import SignUp from "@/components/SignUp";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <section className="flex w-full min-h-screen">
      {/* Left Div */}
      <div className="flex-1 lg:flex lg:flex-col hidden bg-accent shadow-lg shadow-accent min-h-screen justify-center items-center relative">
        <div className="mt-12 text-center mx-4">
          <h2 className="text-4xl font-bold text-gray-100">
            Welcome to <span className="font-light">Study Companion</span>
          </h2>
          <p className="lg:text-xl md:text-lg text-base text-gray-100 mt-2">
            Create an account now
          </p>
        </div>
        {/* Responsive image */}
        <div className="w-full h-full flex justify-center items-center">
          <Image
            src="/Image/img-2.png"
            alt="SignUp Background"
            className="object-cover flex justify-center items-center"
            width={300}
            height={400}
          />
        </div>
      </div>

      {/* Right Div */}
      <div className="flex-1 p-4 h-full">
        <SignUp />
      </div>
    </section>
  );
}
