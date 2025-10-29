import { createContext, useState, useEffect } from 'react';
import { captainAPI } from '../services/api';

export const CaptainContext = createContext();

export const CaptainProvider = ({ children }) => {
  const [captain, setCaptain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedCaptain = localStorage.getItem('captain');
    const token = localStorage.getItem('captainToken');
    
    if (storedCaptain && token) {
      setCaptain(JSON.parse(storedCaptain));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await captainAPI.login({ email, password });
      const { token, captain: captainData } = response.data;
      
      localStorage.setItem('captainToken', token);
      localStorage.setItem('captain', JSON.stringify(captainData));
      setCaptain(captainData);
      setIsAuthenticated(true);
      
      return { success: true, message: 'Login successful' };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  };

  const register = async (fullname, email, password, vehicle) => {
    try {
      const response = await captainAPI.register({ 
        fullname,
        email,
        password,
        vehicle
      });
      const { token, captain: captainData } = response.data;
      
      localStorage.setItem('captainToken', token);
      localStorage.setItem('captain', JSON.stringify(captainData));
      setCaptain(captainData);
      setIsAuthenticated(true);
      
      return { success: true, message: 'Registration successful' };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await captainAPI.logout();
      localStorage.removeItem('captainToken');
      localStorage.removeItem('captain');
      setCaptain(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Logout failed' };
    }
  };

  return (
    <CaptainContext.Provider value={{
      captain,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
      setCaptain
    }}>
      {children}
    </CaptainContext.Provider>
  );
};
