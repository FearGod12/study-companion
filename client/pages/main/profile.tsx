import React, { ReactElement, useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import Image from "next/image";
import { User } from "lucide-react";
import Layout from "@/components/layout/main/layout";

const Profile = () => {
  const [hasChanged, setHasChanged] = useState(false);
  const { user, fetchUserData } = useAuthStore();
  const { updateUserDetails, uploadAvatar, loading, error, successMessage } =
    useUserStore();

  const [editableFields, setEditableFields] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    category: "",
    address: "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // 🧠 Populate editableFields from user on load
  useEffect(() => {
    if (user) {
      setEditableFields({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
        category: user.category || "",
        address: user.address || "",
      });
    }
  }, [user]);

  // 🔍 Track form changes to enable save button
  useEffect(() => {
    if (!user) return;

    const somethingChanged =
      editableFields.firstName !== user.firstName ||
      editableFields.lastName !== user.lastName ||
      editableFields.phoneNumber !== user.phoneNumber ||
      editableFields.category !== user.category ||
      editableFields.address !== user.address ||
      !!avatarFile;

    setHasChanged(somethingChanged);
  }, [editableFields, avatarFile, user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditableFields({ ...editableFields, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserDetails(editableFields);
    if (avatarFile) {
      await uploadAvatar(avatarFile);
    }
    fetchUserData();
  };

  return (
    <div className="lg:max-w-3xl md:max-w-xl max-w-md p-6 bg-gray-100 shadow-md rounded-xl mt-10 mx-auto min-h-screen h-full">
      <h2 className="lg:text-3xl md:text-2xl text-xl font-bold mb-6 text-accent">
        Your Profile
      </h2>

      {user && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-accent">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt="avatar"
                  className="w-20 h-20 rounded-full object-cover border"
                  width={400}
                  height={400}
                />
              ) : (
                <User className="w-10 h-10" />
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="text-sm"
            />
          </div>

          {/* Read-only Info */}
          <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <span className="font-medium">Email:</span> {user.email}
            </div>
            <div>
              <span className="font-medium">Created At:</span>{" "}
              {new Date(user.createdAt ?? "").toLocaleString()}
            </div>
            <div>
              <span className="font-medium">Last Updated:</span>{" "}
              {new Date(user.updatedAt ?? "").toLocaleString()}
            </div>
          </div>

          {/* Editable Fields */}
          <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={editableFields.firstName}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={editableFields.lastName}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={editableFields.phoneNumber}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                value={editableFields.category}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
              >
                <option value="">Select Category</option>
                <option value="OLEVEL">O Level</option>
                <option value="UNDERGRADUATE">Undergraduate</option>
                <option value="GRADUATE">Graduate</option>
              </select>
            </div>

            <div className="lg:col-span-2 md:col-span-2 col-span-1">
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={editableFields.address}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>
          </div>

          {/* Actions + Feedback */}
          <button
            type="submit"
            className={`px-4 py-2 rounded-md text-gray-100 transition-colors ${
              hasChanged && !loading
                ? "bg-accent hover:bg-accent/90"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
            disabled={!hasChanged || loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {successMessage && (
            <p className="text-green-600 text-sm mt-2">{successMessage}</p>
          )}
        </form>
      )}
    </div>
  );
};

Profile.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Profile;
