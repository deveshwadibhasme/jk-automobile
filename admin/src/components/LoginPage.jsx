import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext.jsx";

const LogInPage = () => {
  const { loginAction } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const LOCAL_URL = "http://localhost:3000";
  const PUBLIC_URL = "https://jk-automobile-9xtf.onrender.com";

  const url = location.hostname === "localhost" ? LOCAL_URL : PUBLIC_URL;

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${url}/auth/admin/login`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setLoading(true);
        alert(response.data.message);
        loginAction(response.data);
      })
      .catch((error) => {
        console.error(
          "Error during login:",
          error.response ? error.response.data : error.message
        );
        alert(
          error.response?.data?.message ||
            "Login failed. Please check your credentials."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div
      className="min-h-screen text-white font-sans bg-center
      bg-black/60 bg-blend-darken max-w-screen bg-cover"
      //   style={{ backgroundImage: `url(${})` }}
    >
      <div className="px-10 py-5 border-b border-gray-700">
        <h1 className="text-3xl font-bold tracking-wider">J.K Automobile</h1>
        <p className="text-sm text-gray-300 tracking-wide">Motors Group</p>
      </div>

      <div className="grid md:grid-cols-2 min-h-[calc(100vh-80px)] items-center">
        {/* Hero Section */}
        <div className="p-14 md:p-20">
          <h2 className="text-5xl font-light">Drive Into</h2>
          <h2 className="text-5xl font-extrabold bg-linear-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent mt-1">
            The Future
          </h2>

          <p className="text-gray-300 max-w-md mt-6 leading-relaxed">
            Experience luxury, performance, and innovation. Access your account
            to explore our exclusive collection of premium automobiles.
          </p>

          <div className="flex gap-10 mt-12">
            <div className="text-center">
              <span className="text-3xl font-bold text-orange-500 block">
                50+
              </span>
              <span className="text-sm text-gray-300">Premium Brands</span>
            </div>

            <div className="text-center">
              <span className="text-3xl font-bold text-orange-500 block">
                200+
              </span>
              <span className="text-sm text-gray-300">Global Locations</span>
            </div>

            <div className="text-center">
              <span className="text-3xl font-bold text-orange-500 block">
                10K+
              </span>
              <span className="text-sm text-gray-300">Happy Clients</span>
            </div>
          </div>
        </div>

        {/* Login Section */}
        <div className="flex justify-center items-center p-10 max-w-3xl backdrop-blur-md">
          <div className="bg-white/20 border border-white/30 p-10 rounded-xl w-full max-w-2xl">
            <h3 className="text-3xl font-bold">Welcome Back Admin</h3>
            <p className="text-gray-300 mb-6">Sign in to access your account</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email */}
              <div>
                <label className="font-semibold mb-2 block">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/80 text-gray-800 border-2 border-gray-300
                             focus:outline-none focus:border-indigo-400 focus:bg-white"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="font-semibold mb-2 block">Password</label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/80 text-gray-800 border-2 border-gray-300
                               focus:outline-none focus:border-indigo-400 focus:bg-white pr-12"
                    placeholder="Enter your password"
                    required
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 accent-orange-500"
                />
                Remember me
              </label>

              {/* Submit */}
              <button
                type="submit"
                className="py-3 rounded-lg bg-linear-to-r from-orange-500 to-orange-400 font-semibold
                           hover:-translate-y-1 transition shadow-lg"
              >
                {!loading ? "Sign in" : "Signing...."}
              </button>

              <div className="text-center">
                <a href="#forgot" className="text-orange-400 hover:underline">
                  Forgot password?
                </a>
              </div>
            </form>

            <div className="text-center border-t border-gray-500 mt-6 pt-6">
              <p>
                Don't have an account?{" "}
                <Link
                  to="/registration"
                  className="text-orange-400 hover:underline"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
