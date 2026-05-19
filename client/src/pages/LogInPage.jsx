import React, { useState } from "react";
import bgImage from "../assets/car-bg.avif";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const LogInPage = () => {
  const { loginAction } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const LOCAL_URL = "http://localhost:3000";
  const PUBLIC_URL = "https://jk-backend.onthewifi.com";

  const url = typeof window !== 'undefined' && window.location?.hostname === "localhost" ? LOCAL_URL : PUBLIC_URL;
  const state = useLocation().state;

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    axios
      .post(
        `https://jk-backend.onthewifi.com/api/v1/auth/login`,
        {
          email: formData.email,
          password: formData.password
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data.statusCode === 200) {
          // Extract token from response
          const token = response.data.data?.token || response.data.token;
          const userData = response.data.data;
          
          // Store token based on "Remember Me" checkbox
          if (token) {
            if (formData.rememberMe) {
              localStorage.setItem('token', token);
              localStorage.setItem('userData', JSON.stringify(userData));
              console.log("Token stored in localStorage");
            } else {
              sessionStorage.setItem('token', token);
              sessionStorage.setItem('userData', JSON.stringify(userData));
              console.log("Token stored in sessionStorage");
            }
          } else {
            console.warn("No token found in response:", response.data);
          }
          
          alert(response.data.message);
          // Pass the data object to loginAction
          loginAction(response.data.data, state);
          navigate("/"); // Redirect to dashboard after login
        } else {
          setError(response.data.message || "Login failed");
        }
      })
      .catch((error) => {
        console.error(
          "Error during login:",
          error.response ? error.response.data : error.message
        );
        setError(
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
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="px-10 py-5 border-b border-gray-700">
        <h1 className="text-3xl font-bold tracking-wider">
          J.K Auto Electronics Works
        </h1>
      </div>

      <div className="grid md:grid-cols-2 min-h-[calc(100vh-80px)] items-center">
        {/* Hero Section */}
        <div className="p-14 md:p-20">
          <h2 className="text-5xl font-light">Drive Into</h2>
          <h2 className="text-5xl font-extrabold bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent mt-1">
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
          </div>
        </div>

        {/* Login Section */}
        <div className="flex justify-center items-center p-10 max-w-3xl backdrop-blur-md">
          <div className="bg-white/20 border border-white/30 p-10 rounded-xl w-full max-w-2xl">
            <h3 className="text-3xl font-bold">Welcome Back</h3>
            <p className="text-gray-300 mb-6">Sign in to access your account</p>

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

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
                             focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
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
                               focus:outline-none focus:border-orange-400 focus:bg-white pr-12 transition-all"
                    placeholder="Enter your password"
                    required
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 text-xl"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Checkbox and Forgot Password Row */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <span className="text-sm">Remember me</span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-orange-400 hover:text-orange-300 text-sm font-medium hover:underline transition-all"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 font-semibold
                           hover:-translate-y-1 transition-all duration-300 shadow-lg disabled:opacity-50 
                           disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {!loading ? "Sign in" : "Signing in..."}
              </button>
            </form>

            <div className="text-center border-t border-gray-500 mt-6 pt-6">
              <p>
                Don't have an account?{" "}
                <Link
                  to="/registration"
                  className="text-orange-400 hover:text-orange-300 hover:underline transition-all"
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