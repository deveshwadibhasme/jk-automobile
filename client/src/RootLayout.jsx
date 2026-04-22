import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

const RootLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
      <Footer />
    </AuthProvider>
  );
};

export default RootLayout;
