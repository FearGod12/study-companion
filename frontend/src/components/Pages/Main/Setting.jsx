import { useState } from "react";

const Setting = () => {
    const [theme, setTheme] = useState("light");
    const [notifications, setNotifications] = useState(true);
    const [password, setPassword] = useState("");

    // Handle theme change
    const handleThemeChange = (e) => {
        setTheme(e.target.value);
    };

    // Handle notifications toggle
    const handleNotificationsToggle = () => {
        setNotifications(!notifications);
    };

    // Handle password change
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    // Handle form submission (just an example)
    const handleSaveSettings = (e) => {
        e.preventDefault();
        console.log("Settings saved:", { theme, notifications, password });
        // You can add logic here to save the settings to a server or local storage
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl mb-4">Settings</h2>

            {/* Theme Setting */}
            <div className="mb-4">
                <label htmlFor="theme" className="block text-lg">
                    Theme
                </label>
                <select
                    id="theme"
                    value={theme}
                    onChange={handleThemeChange}
                    className="mt-1 p-2 border rounded"
                >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>
            </div>

            {/* Notifications Setting */}
            <div className="mb-4">
                <label htmlFor="notifications" className="block text-lg">
                    Notifications
                </label>
                <div className="flex items-center mt-2">
                    <input
                        id="notifications"
                        type="checkbox"
                        checked={notifications}
                        onChange={handleNotificationsToggle}
                        className="mr-2"
                    />
                    <span>{notifications ? "Enabled" : "Disabled"}</span>
                </div>
            </div>

            {/* Password Change */}
            <div className="mb-4">
                <label htmlFor="password" className="block text-lg">
                    Change Password
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    className="mt-1 p-2 border rounded w-full"
                />
            </div>

            {/* Save Settings Button */}
            <button
                onClick={handleSaveSettings}
                className="p-2 bg-blue-500 text-white rounded-lg"
            >
                Save Settings
            </button>
        </div>
    );
};

export default Setting;
