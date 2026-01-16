import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LogInPage from "./pages/LoginPage.jsx";
import { AuthProvider } from "./AuthContext.jsx";
import CarList from "./components/CarList.jsx";
import EditForm from "./components/layouts/EditForm.jsx";
import AddCarInfo from "./components/layouts/AddCarInfo.jsx";
import FormToUpload from "./pages/UploadPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import VehicleList from "./pages/VehicleList.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <App />
      </AuthProvider>
    ),
    children: [
      {
        path: "/",
        element: (
          <AuthProvider>
            <Dashboard />
          </AuthProvider>
        ),
      },
      {
        path: "/list",
        element: (
          <AuthProvider>
            <VehicleList />
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
      {
        path: "/upload",
        element: (
          <AuthProvider>
            <FormToUpload />
          </AuthProvider>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <AuthProvider>
        <LogInPage />
      </AuthProvider>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
