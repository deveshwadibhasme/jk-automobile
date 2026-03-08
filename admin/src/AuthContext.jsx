/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
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

  const loginAction = (data) => {
    setToken(data.token);
    setUser(data.user);
    setName(data.username ?? data.user?.name ?? "");
    localStorage.setItem("token", data.token);
  };

  const logOut = () => {
    setUser(null);
    setName("");
    setToken(null);
    localStorage.removeItem("token");
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
