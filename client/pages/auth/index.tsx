import SignUp from "@/components/common/SignUp";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <section className="flex w-full min-h-screen">
      {/* Left Div */}
      <div className="hidden lg:flex flex-1 bg-accent min-h-screen">
        <div className="flex justify-center items-center w-full h-full">
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
