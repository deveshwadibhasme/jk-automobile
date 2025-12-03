import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css'
import RegistrationPage from "./pages/RegistrationPage.jsx";
import LogInPage from "./pages/LogInPage.jsx";
import App from "./App.jsx";
import RootLayout from "./RootLayout.jsx";
import FirmwareTable from "./pages/Dashboard.jsx";
import ModuleInfo from "./pages/ModuleInfo.jsx";


const router = createBrowserRouter([
  {
    element: <RootLayout />, 
    children: [
      {
        path: "/",
        element: <FirmwareTable />,
      },
      {
        path: "/module-info/:id",
        element: <ModuleInfo />,
      },
      {
        path: "/login",
        element: <LogInPage />,
      },
      {
        path: "/registration",
        element: <RegistrationPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
