import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import * as jose from 'jose';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Start with null to avoid premature redirects
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("token")));

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        console.log('No token found');
        setIsLoggedIn(false);
        return;
      }

      try {
        axios.defaults.headers.common["Authorization"] = token;
        const response = await axios.post(`${API_URL}/users/verify_token`);
        
        if (response.data.ok) {
          // Token is valid, set login state
          login(token);
        } else {
          console.log('Token invalid');
          // Token is not valid, set logout state
          logout();
        }
      } catch (error) {
        console.log('Error verifying token', error);
        logout();
      }
    };

    verifyToken();
  }, [token]);

  const login = (newToken) => {
    const decodedToken = jose.decodeJwt(newToken);
    const user = { email: decodedToken.userEmail };

    localStorage.setItem("token", JSON.stringify(newToken));
    localStorage.setItem("user", JSON.stringify(user));
    setIsLoggedIn(true);
    setUser(user);
    setToken(newToken); // Ensure token is updated in state
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setToken(null); // Ensure token is cleared from state
  };

  return { isLoggedIn, user, login, logout };
};

export default useAuth;
