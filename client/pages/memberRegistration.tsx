import Button from "@/components/common/Button";
import DarkLogo from "@/components/common/logo/DarkLogo";
import Link from "next/link";

const MemberRegistration = () => {
  return (
    <section className="container max-w-none h-screen">
      <div className="py-2 pl-4">
        <DarkLogo />
      </div>
      <div className="h-full flex justify-center items-center relative">
        <div className="lg:flex md:flex  flex-col items-center justify-center h-3/5 w-3/5 bg-accent shadow-2xl shadow-accent hidden absolute lg:top-20 lg:right-40 rounded"></div>
        <div className="flex flex-col items-center justify-center h-3/5 lg:w-3/5 md:w-3/5 w-4/5 bg-accent shadow shadow-white z-10 rounded">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl text-white font-bold py-3">Welcome</h1>
            <p className="lg:text-lg md:text-base text-sm lg:max-w-lg md:max-w-md max-w-sm py-3 mb-6 text-center text-white px-2">
              We are glad to have you! TopicalTest is designed to give you a
              smooth studying experience, helping you achieve your academic
              goals with ease.
            </p>
          </div>
          <div className="flex gap-3 text-center lg:flex-row md:flex-row flex-col items-center">
            <Link href="/auth/login">
              <Button
                text="Login"
                className="text-accent hover:border border-gray-100 bg-white hover:bg-accent hover:text-white px-12 py-3"
              />
            </Link>

            <Link href="/auth">
              <Button
                text="Sign up"
                className="text-accent hover:border border-gray-100 bg-white hover:bg-accent hover:text-white px-12 py-3"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemberRegistration;
