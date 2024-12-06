import { useState, useEffect } from 'react';
import { getUserData } from '../services/api';
import PropTypes from 'prop-types';
import { AuthContext } from './AuthContext';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const data = await getUserData();
      console.log('Fetched user data:', data);
      setUser(data.data);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.message || 'Failed to fetch user data.');
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = () => {
    fetchUserData();
  };

  useEffect(() => {
    const token = localStorage.getItem('access_Token');
    if (token) {
      fetchUserData();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        fetchUserData,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
