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
          const token = response.data.data?.token || response.data.token;
          const userData = response.data.data;
          
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
          loginAction(response.data.data, state);
          navigate("/");
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
      className="min-h-screen font-sans bg-center bg-cover bg-no-repeat relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/70" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="px-8 py-5 border-b border-white/10">
          <h1 className="text-2xl md:text-3xl font-bold tracking-wide text-white text-center">
            JK Auto Electronics Works
          </h1>
        </div>

        {/* Main Content - Two Columns */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="grid md:grid-cols-2 max-w-6xl w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            
            {/* Left Side - Brand/Logo Section */}
            <div className="hidden md:flex flex-col justify-center items-center p-10 bg-gradient-to-br from-orange-600/40 to-orange-800/40 backdrop-blur-sm">
              <div className="text-center space-y-6">
                {/* Logo Placeholder */}
                <div className="w-32 h-32 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                  <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 13c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z"/>
                  </svg>
                </div>
                
                <h2 className="text-3xl font-bold text-white">Welcome Back!</h2>
                <p className="text-white/80 text-lg max-w-sm mx-auto">
                  Sign in to access your dashboard and manage your automotive electronics services.
                </p>
                
                <div className="pt-8 space-y-3">
                  <div className="flex items-center gap-3 text-white/70">
                    <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>24/7 Customer Support</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/70">
                    <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Secure & Fast Service</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="p-8 md:p-12">
              <div className="max-w-md mx-auto">
                <div className="text-center md:text-left mb-8">
                  <h3 className="text-3xl font-bold text-white">Sign In</h3>
                  <p className="text-white/60 mt-2">Enter your credentials to access your account</p>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm flex items-center gap-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label className="block text-white/80 font-medium mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40
                                   focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-white/80 font-medium mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40
                                   focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-all"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-white/30 bg-white/10 text-orange-500 focus:ring-orange-500/20 focus:ring-2"
                      />
                      <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
                        Remember me
                      </span>
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-all hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold
                               hover:from-orange-600 hover:to-orange-700 transform hover:scale-[1.02] transition-all duration-300 
                               shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {!loading ? (
                      <span className="flex items-center justify-center gap-2">
                        Sign In
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </span>
                    )}
                  </button>
                </form>

                {/* Sign Up Link */}
                <div className="mt-8 text-center">
                  <p className="text-white/60">
                    Don't have an account?{" "}
                    <Link
                      to="/registration"
                      className="text-orange-400 hover:text-orange-300 font-medium transition-all hover:underline"
                    >
                      Create Account
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;