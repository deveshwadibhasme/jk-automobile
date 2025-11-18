import React from "react";
import { Navigate, Outlet } from "react-router-dom"; 

import "./App.css";
import { useAuth } from "./context/AuthContext";

import Header from './components/layout/Header'

const App = () => {
  const { token, logOut } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      {/* <Header />
      <Outlet /> */}
    </>
  );
};

export default App;
