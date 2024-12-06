import { useAuth } from '../../context/useAuth';
import useUser from '../../hooks/useUser';
import { FaSpinner, FaUserCircle } from 'react-icons/fa';

const Profile = () => {
  const { loading, error, handleFileChange, handleAvatarUpdate } = useUser();

  const { user, refreshUserData } = useAuth();

  if (loading && !user)
    return (
      <div className="flex items-center justify-center">
        <FaSpinner className="animate-spin text-gray-500" size={24} />
        <p className="ml-2">Loading user data...</p>
      </div>
    );

  if (error) return <p className="text-red-500">An error occurred: {error}</p>;

  return (
    <div className="flex py-4 px-6 justify-between w-full">
      {user ? (
        <div className="flex lg:flex-row md:flex-row flex-col gap-4">
          {/* Profile Picture Section */}
          <div className="flex flex-col">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="User Avatar"
                className="rounded-full w-40 h-40 object-cover"
              />
            ) : (
              <FaUserCircle size={70} />
            )}

            {/* Avatar Update Section */}
            <div className="mt-4 flex flex-col gap-2">
              <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
              <button
                onClick={handleAvatarUpdate}
                disabled={loading}
                className={`p-2 rounded-md w-32 ${
                  loading
                    ? 'bg-gray-400 text-gray-600'
                    : 'bg-secondary text-white hover:bg-pink-800'
                }`}
              >
                {loading ? 'Updating...' : 'Update Avatar'}
              </button>
            </div>
          </div>

          {/* User Information */}
          <div className="flex flex-col gap-2 text-sm">
            {[
              { label: 'First Name', value: user.firstName },
              { label: 'Last Name', value: user.lastName },
              { label: 'Phone Number', value: user.phoneNumber },
              { label: 'Email', value: user.email },
              { label: 'Address', value: user.address },
              { label: 'Category', value: user.category },
            ].map(({ label, value }) => (
              <p key={label}>
                {label}:<span className="font-bold ml-4">{value || 'N/A'}</span>
              </p>
            ))}
          </div>
        </div>
      ) : (
        <p>No user data available.</p>
      )}

      {/* Refresh Button */}
      <div className="flex items-center">
        <button
          onClick={refreshUserData}
          disabled={loading}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          <FaSpinner
            size={24}
            className={`${loading ? 'animate-spin text-gray-500' : 'text-gray-700'}`}
          />
        </button>
      </div>
    </div>
  );
};

export default Profile;
