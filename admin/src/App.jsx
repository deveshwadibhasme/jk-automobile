import React from "react";
import SideBar from "./components/layouts/SideBar";
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
