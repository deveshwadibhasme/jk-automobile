import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && !token) {
      setToken(storedToken);
      // Set default axios header
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
  }, []);

  const loginAction = (data) => {
    // Extract the accessToken from the response data
    const accessToken = data?.tokens?.accessToken || data?.token;
    const userData = data?.user || data;
    
    setToken(accessToken);
    setUser(userData);
    setName(userData?.name || "");
    
    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
    
    // Set default axios header for all future requests
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    
    navigate("/");
  };

  const logOut = () => {
    setUser(null);
    setToken(null);
    setName("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  const value = {
    token,
    user,
    name,
    loginAction,
    logOut,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};