import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token: string) => {
  if (!token) return true;

  try {
    const decodedToken = jwtDecode(token);
    
    if (decodedToken && typeof decodedToken.exp === 'number') {
      return decodedToken.exp * 1000 < Date.now();
    }
    
    return true;
  } catch (e) {
    console.error("Invalid token:", e);
    return true;
  }
};
