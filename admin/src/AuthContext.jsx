/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from "react";
import { useContext } from "react";
import { createContext } from "react";

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

  // Load saved user data on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedName = localStorage.getItem("name");
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedName) setName(savedName);
  }, []);

  const loginAction = (data) => {
    // Handle both direct and nested response structures
    let tokenValue, userData, usernameValue;
    
    if (data.data) {
      // If response has nested data structure (like from your API)
      tokenValue = data.data.token;
      userData = {
        email: data.data.email || data.data.user?.email,
        role: data.data.role,
      };
      usernameValue = data.data.username;
    } else {
      // If response is already flattened
      tokenValue = data.token;
      userData = data.user;
      usernameValue = data.username;
    }
    
    setToken(tokenValue);
    setUser(userData);
    setName(usernameValue);
    
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("name", usernameValue);
  };

  const logOut = () => {
    setUser(null);
    setName("");
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("name");
  };

  const value = {
    token,
    user,
    name,
    isAuthenticated: Boolean(token),
    loginAction,
    logOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};