import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LogInPage from "./components/LoginPage.jsx";
import { AuthProvider } from "./AuthContext.jsx";
import CarList from "./components/CarList.jsx";
import EditForm from "./components/EditForm.jsx";
import AddCarInfo from "./components/addCarInfo.jsx";

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
  {
    path: "/edit-form/:id",
    element: (
      <AuthProvider>
        <EditForm />
      </AuthProvider>
    ),
  },
  {
    path: "/car-info/:id",
    element: (
      <AuthProvider>
        <AddCarInfo />
      </AuthProvider>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
