import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    }
  }, []);

  const loginAction = (data, state) => {
    setToken(data.token);
    setUser(data.user);
    setName(data.username);
    localStorage.setItem("token", data.token);
    if(state?.length > 0){
      navigate(state.link)
    }

    navigate("/");
  };

  const logOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  const value = {
    token,
    user,
    name,
    loginAction,
    logOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
