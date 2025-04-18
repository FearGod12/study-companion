import Button from "@/components/common/Button";
import Header from "@/components/layout/landing/Header";
import Link from "next/link";

const MemberRegistration = () => {
  return (
    <section className="container max-w-none overflow-x-hidden flex flex-col">
      <div className="z-10">
        <Header />
      </div>

      <div className="h-screen flex justify-center items-center relative bg-accent-light">
        <div className="lg:flex md:flex flex-col items-center justify-center h-2/5 w-2/5 bg-accent-light shadow hidden absolute lg:top-50 lg:right-80 rounded-tr-4xl rounded-xl border-8 border-accent-dark"></div>
        <div className="flex flex-col items-center justify-center py-8 lg:max-w-lg md:max-w-md max-w-sm bg-gray-100 shadow shadow-accent-dark z-10 rounded-lg mx-4">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl text-accent font-bold py-3 text-center">
              Welcome to Study Companion
            </h1>
            <p className="lg:text-lg md:text-base text-sm lg:max-w-lg md:max-w-md max-w-sm py-3 mb-6 text-center px-2">
              We are glad to have you! TopicalTest is designed to give you a
              smooth studying experience, helping you achieve your academic
              goals with ease.
            </p>
          </div>
          <div className="flex gap-3 text-center lg:flex-row md:flex-row flex-col items-center">
            <Link href="/auth/login">
              <Button
                text="Login"
                className="text-gray-100 hover:border border-gray-100 bg-accent hover:bg-gray-100 hover:text-accent px-12 py-2"
              />
            </Link>

            <Link href="/auth">
              <Button
                text="Sign up"
                className="text-gray-100 hover:border border-gray-100 bg-accent hover:bg-gray-100 hover:text-accent px-12 py-2"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemberRegistration;
