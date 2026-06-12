import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext.jsx";
import { API_BASE_URL } from "../config/api";
import logo from '../assets/jk_Logo.jpeg'
const LogInPage = () => {
  const { loginAction } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

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
    setLoading(true);
    axios
      .post(
        `https://jkauto-backend.onthewifi.com/api/v1/admin/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        alert(response.data.message);
        loginAction({
          token: response.data.data.token,
          user: {
            email: formData.email,
            role: response.data.data.role,
          },
          username: response.data.data.username,
        });
        navigate("/");
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
    <div className="min-h-screen flex overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Left Side - Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/50 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&h=1200&fit=crop"
          alt="Luxury Car"
          className="absolute inset-0 w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
        />
        <div className="relative z-20 flex flex-col justify-between h-full p-12 text-white">
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <img src={logo} className="rounded-xl" ></img>
              
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-5xl font-bold leading-tight">
                Drive Into
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-300">
                  The Future
                </span>
              </h2>
              <p className="text-gray-200 text-lg leading-relaxed max-w-md">
                Experience luxury, performance, and innovation. Access your account
                to explore our exclusive collection of premium automobiles.
              </p>
            </div>
            
            <div className="flex items-center space-x-4 pt-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 border-2 border-white/20 flex items-center justify-center text-xs font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-white">50+</span> trusted dealers
              </p>
            </div>
          </div>
          
          <div className="text-sm text-gray-400">
            © 2026 JK Auto Electronic Works. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold text-white">JK Auto</h1>
                <p className="text-xs text-gray-400">Electronic Works</p>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Welcome Back</h3>
              <p className="text-gray-300">Sign in to access your admin account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-200 block">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400
                             focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20
                             transition-all duration-200"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-200 block">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400
                             focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20
                             transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-white/30 bg-white/10 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    Remember me
                  </span>
                </label>
                <a href="#forgot" className="text-sm text-orange-400 hover:text-orange-300 transition-colors hover:underline">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700
                         text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02]
                         shadow-lg hover:shadow-orange-500/25 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Sign Up Link */}
              <div className="text-center pt-4 border-t border-white/10">
                <p className="text-sm text-gray-300">
                  Don't have an account?{" "}
                  <Link
                    to="/registration"
                    className="text-orange-400 hover:text-orange-300 font-semibold hover:underline transition-colors"
                  >
                    Create Account
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Features */}
         
        </div>
      </div>
    </div>
  );
};

export default LogInPage;