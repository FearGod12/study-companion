import { useState } from "react";
import Button from "../../common/Button";

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

    // Handle form submission (just an example)
    const handleSaveSettings = (e) => {
        e.preventDefault();
        console.log("Settings saved:", { theme, notifications, password });
        // You can add logic here to save the settings to a server or local storage
    };

    return (
        <div className="p-6">
            <h2 className="md:text-2xl font-bold text-secondary text-pretty mb-4 mt-20">
                Settings
            </h2>

            {/* Theme Setting */}
            <div className="mb-4 flex gap-6 items-center text-sm">
                <label htmlFor="theme" className="">
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
            <div className="lg:text-2xl md:text-2xl text-sm mb-6 flex gap-8 items-center">
                <label htmlFor="notifications" className="">
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

            {/* Save Settings Button */}
            <Button
                onClick={handleSaveSettings}
                className="p-2 bg-secondary text-white rounded-lg"
                text='Save'
          />
        </div>
    );
};

export default Setting;
