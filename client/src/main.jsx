import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import RegistrationPage from "./pages/RegistrationPage.jsx";
import LogInPage from "./pages/LogInPage.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ChangePassword from "./pages/ChangePassword.jsx"; // Import ChangePassword
import App from "./App.jsx";
import RootLayout from "./RootLayout.jsx";
import FirmwareTable from "./pages/Dashboard.jsx";
import ModuleInfo from "./pages/ModuleInfo.jsx";
import TermsAndConditions from "./pages/Term.jsx";
import Header from "./components/layout/Header.jsx";

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
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/change-password", // Add change password route
        element: <ChangePassword />,
      },
      {
        path: "/registration",
        element: <RegistrationPage />,
      },
      {
        path: "/terms",
        element: (
          <>
            <Header />
            <TermsAndConditions />
          </>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);