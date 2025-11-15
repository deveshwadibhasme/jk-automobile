import React from "react";
import { Navigate, Outlet } from "react-router-dom"; // Outlet will render nested routes

import "./App.css";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { token , logOut } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <button onClick={()=>logOut()}>Log Out</button>
      <Outlet />
    </div>
  );
};

export default App;
