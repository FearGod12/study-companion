import Image from "next/image";

const LoginRight = () => {
  return (
    <div className="flex-1 lg:flex lg:flex-col hidden bg-accent shadow-lg shadow-accent h-screen justify-center items-center relative">
      <div className="py-4 mt-6 text-center mx-4">
        <h2 className="text-4xl font-inria-sans font-bold text-gray-100">
          Welcome to <span className="font-light">Study Companion</span>
        </h2>
        <p className="text-sm text-gray-100 mt-2">
          Login to access your account
        </p>
      </div>
      {/* Responsive image */}
      <div className="mt-4 w-full h-full flex justify-center items-center">
        <Image
          src="/image/img-3.png"
          alt="Study Companion"
          className="w-full h-auto max-w-md"
          width={300}
          height={400}
        />
      </div>
    </div>
  );
};

export default LoginRight;
