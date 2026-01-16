import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logOut } = useAuth();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 text-white bg-gray-800 rounded-md lg:hidden"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out
        bg-gray-800 text-white w-64 p-5 space-y-6 z-40`}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <button onClick={toggleSidebar} className="text-white lg:hidden">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <nav className="space-y-4">
          <Link
            to="/"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
            onClick={toggleSidebar}
          >
            Dashboard
          </Link>
          <Link
            to="/upload"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
            onClick={toggleSidebar}
          >
            Upload Data
          </Link>
          <Link
            to="/list"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
            onClick={toggleSidebar}
          >
            View List
          </Link>
          <button
            onClick={logOut}
            className="w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
          >
            Logout
          </button>
        </nav>
      </div>
    </>
  );
};

export default SideBar;
