import useUser from "@/hooks/useUser";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import Image from "next/image";

const MainHeader = () => {
  const { user, loading, handleLogout, currentDate } = useUser();

  if (loading) {
    return (
      <header className="flex items-center justify-between px-4">
        <div>
          <h1 className="text-xl font-bold">Loading...</h1>
        </div>
      </header>
    );
  }

  const initials =
    `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase() ||
    "U";

  return (
    <header className="flex justify-between items-center h-full px-4  rounded-lg">
      <div>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-600">{currentDate}</p>
      </div>

      <div className="flex items-center lg:gap-6 gap-2">
        <div className="flex items-center gap-2">
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt={`${user?.firstName} ${user?.lastName}'s profile`}
              className="rounded-full w-8 h-8 object-cover"
              width={32}
              height={32}
            />
          ) : (
            <span
              className="bg-purple-400 text-white text-center rounded-full flex items-center justify-center font-bold text-xs"
              aria-label={`User initials: ${initials}`}
            >
              {initials}
            </span>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="relative group bg-red-500 p-2 rounded-full cursor-pointer"
          aria-label="Logout button"
        >
          <FaArrowRightFromBracket color="white" className="lg:size-4 size-3" />
          <span className="tooltip absolute left-1/2 transform -translate-x-1/2 bottom-10 text-xs bg-gray-700 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100">
            Logout
          </span>
        </button>
      </div>
    </header>
  );
};

export default MainHeader;
