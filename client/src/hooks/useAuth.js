import { useState, useEffect } from 'react';
import axios from 'axios';
import { URL } from '../config';
import * as jose from 'jose';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("token")));

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!token) {
          setIsLoggedIn(false);
          return;
        }

        axios.defaults.headers.common["Authorization"] = token;
        const response = await axios.post(`${URL}/users/verify_token`);
        
        if (response.data.ok) {
          login(token);
        } else {
          logout();
        }
      } catch (error) {
        console.log(error);
        logout();
      }
    };

    verifyToken();
  }, [token]);

  const login = (token) => {
    const decodedToken = jose.decodeJwt(token);
    const user = { email: decodedToken.userEmail };

    localStorage.setItem("token", JSON.stringify(token));
    localStorage.setItem("user", JSON.stringify(user));
    setIsLoggedIn(true);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  return { isLoggedIn, user, login, logout };
};

export default useAuth;
