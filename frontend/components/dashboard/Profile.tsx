import { FaSpinner } from "react-icons/fa6";
import { FaTimes, FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import useUser from "@/hooks/useUser";
import { FocusTrap } from "focus-trap-react";

const Profile = () => {
  const {
    user,
    loading,
    onFileUpload,
    uploading,
    toggleModal,
    isModalOpen,
    isAuthenticated,
  } = useUser();

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <FaSpinner className="animate-spin text-gray-500" size={24} />
        <p className="ml-2 p-6">Loading user data...</p>
      </div>
    );

  return (
    <section className="flex py-4 px-4 lg:justify-start md:justify-start justify-center w-full">
      {isAuthenticated ? (
        <div className="flex flex-col lg:flex-row md:flex-row gap-8 w-full">
          {/* Left Section: Greeting and Text */}
          <div className="flex flex-col justify-center lg:items-start md:items-start items-center w-full lg:w-1/2 md:w-1/2">
            <h1 className="lg:text-3xl md:text-3xl text-2xl font-bold">
              Hi, {user?.firstName}
            </h1>
            <p className="lg:text-lg mt-2">
              Ready to start your day with some learning?
            </p>
          </div>

          {/* Right Section: Profile Image and Update Button */}
          <div className="flex flex-col items-center lg:w-1/2 md:w-1/2">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt="User Avatar"
                className="rounded-full w-48 h-55 object-cover"
                width={240}
                height={240}
              />
            ) : (
              <FaUserCircle
                size={96}
                className="text-gray-400"
                aria-label="Default User Avatar"
              />
            )}
            <button
              onClick={toggleModal}
              className="mt-4 p-2 rounded-md bg-accent text-gray-100 hover:bg-pink-800 w-32"
              aria-label="Open avatar update modal"
            >
              Update Avatar
            </button>
          </div>
        </div>
      ) : (
        <p>No user data available.</p>
      )}

      {/* Avatar Update Modal */}
      {isModalOpen && (
        <FocusTrap>
          <div
            className="fixed inset-0 bg-black/75 flex items-center justify-center z-50"
            onClick={toggleModal}
          >
            <div
              className="bg-gray-100 rounded-lg p-6 w-80 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="file"
                accept="image/*"
                onChange={onFileUpload}
                className="mb-4 p-2 rounded-lg mt-4 text-sm bg-pink-200"
              />
              
              <button
                onClick={uploading ? undefined : toggleModal}
                className={`mt-2 p-1.5 rounded-md bg-red-500 hover:bg-red-400 text-gray-100 absolute top-0 right-2 ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <FaTimes size={15}/>
              </button>
            </div>
          </div>
        </FocusTrap>
      )}
    </section>
  );
};

export default Profile;
