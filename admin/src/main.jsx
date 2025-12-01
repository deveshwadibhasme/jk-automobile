import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LogInPage from "./components/LoginPage.jsx";
import { AuthProvider } from "./AuthContext.jsx";
import CarList from "./components/CarList.jsx";

const router = createBrowserRouter([
  {
    path: "/",

    element: (
      <AuthProvider>
        <App />
      </AuthProvider>
    ),
  },
  {
    path: "/login",
    element: (
      <AuthProvider>
        <LogInPage />
      </AuthProvider>
    ),
  },
  {
    path: "/list",
    element: (
      <AuthProvider>
        <CarList />
      </AuthProvider>
    ),
  },
  // Add other routes here as needed
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
