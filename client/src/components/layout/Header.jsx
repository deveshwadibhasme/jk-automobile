import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faWrench,
  faCircleQuestion,
  faUser,
  faBars,
  faTimes,
  faSignInAlt,
  faInfo,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import logo from "/jk-logo.png";

const Header = () => {
  const { token, logOut, name } = useAuth();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogin = () => {
    if (token) {
      logOut();
    } else {
      navigate("/login");
    }
  };
  const handleRegister = () => {
    navigate("/registration");
  };

  return (
    <>
      <header className="w-full bg-[#3d4468] text-white z-10 relative">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center px-5 py-4 border-b border-[#333]">
          {/* Logo */}
          <div className="flex items-center w-32 h-10">
            <img src={logo} className="w-full h-full" alt="" />
          </div>

          <nav className="hidden md:flex gap-5 text-gray-300">
            <div className="flex items-center gap-5">
              <Link
                to={"/"}
                className="cursor-pointer px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#2d2d2d] hover:text-white transition"
              >
                <FontAwesomeIcon icon={faHouse} />
                Home
              </Link>

              <span className="text-gray-500">|</span>

              <Link
                to={"/terms"}
                className="cursor-pointer px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#2d2d2d] hover:text-white transition"
              >
                <FontAwesomeIcon icon={faInfo} />
                Terms and conditions
              </Link>

              <span className="text-gray-500">|</span>

              {/* <div className="cursor-pointer px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#2d2d2d] hover:text-white transition">
                <FontAwesomeIcon icon={faCircleQuestion} />
                Help
              </div> */}
            </div>
          </nav>

          <div className="hidden md:flex items-center gap-5">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold">
                  {" "}
                  {name && "Welcome, " + name.split(" ")[0]}
                </span>
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-gray-400 to-gray-600 flex items-center justify-center text-sm">
                  <FontAwesomeIcon icon={faUser} />
                </div>

                <button
                  className="border cursor-pointer border-gray-500 px-4 py-2 rounded-md text-gray-300 flex items-center gap-2 hover:bg-gray-600 hover:text-white transition"
                  onClick={handleLogin}
                >
                  <FontAwesomeIcon icon={faSignInAlt} />
                  {!token ? "Log in" : "Log Out"}
                </button>
              </div>

              <span className="text-gray-500">|</span>

              <button
                className="bg-linear-to-br cursor-pointer from-blue-500 to-blue-800 px-4 py-2 rounded-md font-bold flex items-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition"
                onClick={handleRegister}
              >
                <FontAwesomeIcon icon={faUser} />
                Register
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white text-xl"
              onClick={toggleMobileMenu}
            >
              <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
            </button>
          </div>

          <button
            className="flex md:hidden text-white text-xl"
            onClick={toggleMobileMenu}
          >
            <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="w-full h-full bg-gray-600 text-white z-10 relative block md:hidden">
            <nav className="flex flex-col p-5 gap-3">
              <div
                className="flex items-center gap-3 text-gray-300 px-4 py-3 rounded-md hover:bg-[#2d2d2d] hover:text-white transition"
                onClick={closeMobileMenu}
              >
                <FontAwesomeIcon icon={faHouse} />
                Home
              </div>

              <div
                className="flex items-center gap-3 text-gray-300 px-4 py-3 rounded-md hover:bg-[#2d2d2d] hover:text-white transition"
                onClick={closeMobileMenu}
              >
                <FontAwesomeIcon icon={faInfo} />
                Term and Condition
              </div>

              {/* <div
                className="flex items-center gap-3 text-gray-300 px-4 py-3 rounded-md hover:bg-[#2d2d2d] hover:text-white transition"
                onClick={closeMobileMenu}
              >
                <FontAwesomeIcon icon={faCircleQuestion} />
                Help
              </div> */}

              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-[#333]">
                <button
                  className="border border-gray-500 text-gray-300 px-4 py-3 rounded-md flex items-center justify-center gap-3 hover:bg-gray-600 hover:text-white transition"
                  onClick={handleLogin}
                >
                  <FontAwesomeIcon icon={faSignInAlt} />
                  Log in
                </button>

                <button
                  className="bg-linear-to-br from-blue-500 to-blue-800 text-white px-4 py-3 rounded-md flex items-center justify-center gap-3 font-bold hover:shadow-lg hover:-translate-y-0.5 transition"
                  onClick={handleRegister}
                >
                  <FontAwesomeIcon icon={faUser} />
                  Register
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={closeMobileMenu}
        ></div>
      )}
    </>
  );
};

export default Header;
