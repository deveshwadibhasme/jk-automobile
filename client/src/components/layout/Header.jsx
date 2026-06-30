import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faInfo,
  faBucket,
  faUser,
  faSignInAlt,
  faUserPlus,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "/jk_Logo.jpeg";

const Header = () => {
  const { token, logOut, name } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for sticky header with blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogin = () => {
    if (token) {
      logOut();
      closeMobileMenu();
    } else {
      navigate("/login");
      closeMobileMenu();
    }
  };

  const handleRegister = () => {
    navigate("/registration");
    closeMobileMenu();
  };

  // Check if link is active
  const isActive = (path) => location.pathname === path;

  // Navigation items
  const navItems = [
    { path: "/", label: "Home", icon: faHouse },
    { path: "/terms", label: "Terms & Conditions", icon: faInfo },
    
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-400 ${
          isScrolled
            ? "bg-[#0A0F1C]/95 backdrop-blur-xl shadow-[0_8px_32px_-4px_rgba(0,0,0,0.3)] border-b border-[#1E2933]"
            : "bg-[#0A0F1C] border-b border-[#1E2933]"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo Section - EXACTLY as original */}
            <Link
              to="/"
              className="flex items-center shrink-0"
              onClick={closeMobileMenu}
            >
              <div
                className="flex items-center w-52 h-12"
                style={{ borderRadius: "20px" }}
              >
                <img
                  src={logo}
                  className="h-full w-full object-contain"
                  alt="Logo"
                  style={{
                    height: "60px",
                    borderRadius: "30px",
                  }}
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navItems.map((item, idx) => (
                <div key={idx}>
                  {item?.external ? (
                    <a
                      href={item?.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative px-4 lg:px-5 py-2 rounded-full flex items-center gap-2 text-sm lg:text-base font-medium text-gray-300 hover:text-blue-400 transition-all duration-300"
                    >
                      <FontAwesomeIcon
                        icon={item?.icon}
                        className="text-gray-500 group-hover:text-blue-400 transition-all duration-300 text-sm lg:text-base"
                      />
                      <span>{item?.label}</span>
                      <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-500 rounded-full transition-all duration-300 group-hover:w-4/12 group-hover:left-1/2 group-hover:-translate-x-1/2"></span>
                    </a>
                  ) : (
                    <Link
                      to={item.path}
                      className={`group relative px-4 lg:px-5 py-2 rounded-full flex items-center gap-2 text-sm lg:text-base font-medium transition-all duration-300 ${
                        isActive(item.path)
                          ? "text-blue-400"
                          : "text-gray-300 hover:text-blue-400"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={item.icon}
                        className={`transition-all duration-300 text-sm lg:text-base ${
                          isActive(item.path)
                            ? "text-blue-400"
                            : "text-gray-500 group-hover:text-blue-400"
                        }`}
                      />
                      <span>{item.label}</span>
                      <span
                        className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-blue-500 rounded-full transition-all duration-300 ${
                          isActive(item.path)
                            ? "w-4/12"
                            : "w-0 group-hover:w-4/12"
                        }`}
                      ></span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center gap-3 lg:gap-4">
              {/* User Greeting */}
              {token && name && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A2333] border border-[#2A3444]">
                  <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-sm">
                    <FontAwesomeIcon icon={faUser} className="text-xs lg:text-sm" />
                  </div>
                  <span className="text-sm font-medium text-gray-200">
                    {name.split(" ")[0]}
                  </span>
                </div>
              )}

              {/* Login/Logout Button */}
              <button
                onClick={handleLogin}
                className="group relative px-4 lg:px-5 py-2 rounded-full flex items-center gap-2 text-sm lg:text-base font-semibold transition-all duration-300 overflow-hidden border border-[#2A3444] hover:border-blue-500 bg-transparent text-gray-300 hover:text-blue-400"
              >
                <FontAwesomeIcon
                  icon={faSignInAlt}
                  className="text-gray-500 group-hover:text-blue-400 transition-all duration-300 text-sm lg:text-base"
                />
                <span>{!token ? "Log in" : "Log out"}</span>
              </button>

              {/* Register Button - Only show when not logged in */}
              {!token && (
                <button
                  onClick={handleRegister}
                  className="px-5 lg:px-6 py-2 rounded-full flex items-center gap-2 text-sm lg:text-base font-semibold transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5"
                >
                  <FontAwesomeIcon icon={faUserPlus} className="text-sm lg:text-base" />
                  <span>Register</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-full bg-[#1A2333] text-gray-300 hover:bg-[#2A3444] hover:text-blue-400 transition-all duration-300 focus:outline-none"
              aria-label="Menu"
            >
              <FontAwesomeIcon
                icon={isMobileMenuOpen ? faTimes : faBars}
                className="text-xl transition-all duration-300"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-all duration-400 md:hidden ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeMobileMenu}
      />

      {/* Mobile Menu Panel - Slide Animation */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-[#0A0F1C] z-50 shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#1E2933]">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center w-40 h-10"
                style={{ borderRadius: "20px" }}
              >
                <img
                  src={logo}
                  className="h-full w-full object-contain"
                  alt="Logo"
                  style={{
                    height: "50px",
                    borderRadius: "25px",
                  }}
                />
              </div>
            </div>
            <button
              onClick={toggleMobileMenu}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1A2333] text-gray-400 hover:bg-[#2A3444] hover:text-blue-400 transition-all duration-200"
            >
              <FontAwesomeIcon icon={faTimes} className="text-lg" />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex-1 p-5 space-y-2">
            {navItems.map((item, idx) => (
              <div key={idx}>
                {item?.external ? (
                  <a
                    href={item?.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl bg-[#1A2333] text-gray-300 font-medium hover:bg-[#2A3444] hover:text-blue-400 transition-all duration-200 group"
                    onClick={closeMobileMenu}
                  >
                    <FontAwesomeIcon
                      icon={item?.icon}
                      className="text-gray-500 group-hover:text-blue-400 transition-colors w-5"
                    />
                    <span>{item?.label}</span>
                  </a>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 p-4 rounded-xl font-medium transition-all duration-200 group ${
                      isActive(item.path)
                        ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                        : "bg-[#1A2333] text-gray-300 hover:bg-[#2A3444] hover:text-blue-400"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <FontAwesomeIcon
                      icon={item.icon}
                      className={`transition-colors w-5 ${
                        isActive(item.path)
                          ? "text-blue-400"
                          : "text-gray-500 group-hover:text-blue-400"
                      }`}
                    />
                    <span>{item.label}</span>
                    {isActive(item.path) && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    )}
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile Auth Section */}
            <div className="pt-6 mt-6 border-t border-[#1E2933] space-y-3">
              {token && name && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-600/10 to-[#1A2333] border border-blue-500/20">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-sm">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Welcome back,</p>
                    <p className="font-semibold text-gray-200">{name}</p>
                  </div>
                </div>
              )}

              <button
                onClick={handleLogin}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-[#2A3444] bg-transparent text-gray-300 font-semibold hover:border-blue-500 hover:text-blue-400 transition-all duration-200"
              >
                <FontAwesomeIcon icon={faSignInAlt} />
                <span>{!token ? "Log in" : "Log out"}</span>
              </button>

              {!token && (
                <button
                  onClick={handleRegister}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <FontAwesomeIcon icon={faUserPlus} />
                  <span>Create Account</span>
                </button>
              )}
            </div>
          </nav>

          {/* Mobile Footer */}
          <div className="p-5 border-t border-[#1E2933]">
            <p className="text-xs text-center text-gray-500">
              © {new Date().getFullYear()} JK Automobile Electronic Works
            </p>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-20"></div>
    </>
  );
};

export default Header;
