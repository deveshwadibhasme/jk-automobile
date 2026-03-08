import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { FaBars, FaCross, FaDashcube, FaList, FaUpload } from "react-icons/fa";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logOut } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logOut();
    navigate("/login");
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: FaDashcube },
    { path: "/upload", label: "Upload Data", icon: FaUpload },
    { path: "/list", label: "View List", icon: FaList },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 text-white bg-gray-900 rounded-lg lg:hidden shadow-lg hover:bg-gray-800 transition-colors"
      >
        {isOpen ? <FaCross size={24} /> : <FaBars size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out
        bg-gray-900 text-gray-100 w-64 flex flex-col z-40 border-r border-gray-800 shadow-2xl`}
      >
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            JK Automobile
          </h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
            Admin Portal
          </p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                    : "hover:bg-gray-800 text-gray-400 hover:text-white"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon
                  size={20}
                  className={
                    isActive ? "text-white" : "group-hover:text-blue-400"
                  }
                />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full py-3 px-4 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors font-medium"
          >
            {/* <LogOut size={20} /> */}
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SideBar;
