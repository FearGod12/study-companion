import {jwtDecode} from "jwt-decode";

export const isTokenExpired = () => {
    const token = localStorage.getItem("access_Token");
    if (token) {
        const decoded = jwtDecode(token);
        const expirationTime = decoded.exp * 1000; // Convert expiration time to milliseconds
        const currentTime = Date.now();

        if (expirationTime < currentTime) {
            return true;
        }
    }
    return false;
};
