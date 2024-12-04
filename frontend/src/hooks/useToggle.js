import { useState } from "react";

/**
 * Custom hook for managing toggle state
 * @param {boolean} initialState - Initial state of the toggle (default: false)
 * @returns {[boolean, Function]} - The current state and a function to toggle it
 */
const useToggle = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);

    // Function to toggle the state
    const toggle = () => setIsOpen((prevState) => !prevState);

    return [isOpen, toggle];
};

export default useToggle;
