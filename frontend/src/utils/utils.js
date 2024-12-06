// import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = () => {
  const token = localStorage.getItem('access_Token');
  if (token) {
    let expirationTime = localStorage.getItem('tokenExpiresAt');
    if (expirationTime) {
      const expirationDate = new Date(expirationTime);
      const currentTime = new Date();

      if (expirationDate < currentTime) {
        return true;
      }
      return false;
    }
  }
  return true;
};
