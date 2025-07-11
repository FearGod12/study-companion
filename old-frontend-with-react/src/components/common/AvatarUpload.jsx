import { useState } from "react";
import { updateAvatar } from "../../services/api";
import { useAuth } from "../../context/useAuth";

const AvatarUpload = () => {
    const { updateUserAvatar } = useAuth();
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setErrorMessage("Please select a file to upload.");
            return;
        }

        setUploading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const response = await updateAvatar(selectedFile);
            const avatarUrl = response.data.avatar; 
            updateUserAvatar(avatarUrl);
            setSuccessMessage("Avatar updated successfully!");
            console.log("Updated Avatar Data:", response.data.avatar);
        } catch (error) {
            setErrorMessage(error.message || "Failed to upload avatar.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-8">
            <label
                htmlFor="avatar"
                className="block mb-4 font-medium text-gray-700"
            >
                Upload New Avatar
            </label>
            <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-secondary hover:file:bg-pink-100"
            />
            <button
                onClick={handleUpload}
                disabled={uploading}
                className={`mt-4 px-4 py-2 text-white bg-secondary rounded hover:bg-pink-700 ${
                    uploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
                {uploading ? "Uploading..." : "Upload Avatar"}
            </button>

            {errorMessage && (
                <p className="text-red-500 mt-2">{errorMessage}</p>
            )}
            {successMessage && (
                <p className="text-green-500 mt-2">{successMessage}</p>
            )}
        </div>
    );
};

export default AvatarUpload;
