import Link from "next/link";

const Custom404 = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg w-11/12 max-w-md">
        <h1 className="text-4xl font-extrabold text-red-600 mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          The page you&lsquo;re looking for doesn&apos;t exist.
        </p>
        <p className="text-lg text-gray-700 mb-6">
          Here are some helpful links:
        </p>
        <ul className="space-y-4">
          <li>
            <Link href="/">
              <p className="text-blue-500 hover:text-blue-700 font-semibold">
                Home
              </p>
            </Link>
          </li>
          <li>
            <Link href="/memberRegistration">
              <p className="text-blue-500 hover:text-blue-700 font-semibold">
                Register
              </p>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Custom404;
