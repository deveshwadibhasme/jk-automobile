import React from "react";
import FormToUpload from "./components/FormToUpload";
import SideBar from "./components/layouts/SideBar";
import Dashboard from "./pages/Dashboard";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <SideBar />
      <Outlet />
    </>
  );
}

export default App;
