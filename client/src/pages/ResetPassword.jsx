import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { 
  Lock, 
  Key, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Eye,
  EyeOff
} from "lucide-react";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: "",      // Changed from 'password' to 'newPassword'
    confirmPassword: ""
  });
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({ newPassword: false, confirmPassword: false });
  
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError("Invalid or missing reset token. Please request a new password reset link.");
    }
  }, [location]);

  const validatePassword = (password) => {
    // Updated validation rules based on your test password "NewTest@123456"
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: "" };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return { strength, text: ["Weak", "Fair", "Good", "Strong", "Very Strong"][strength - 1] };
  };

  const passwordsMatch = formData.newPassword === formData.confirmPassword;
  const isPasswordValid = validatePassword(formData.newPassword);
  const passwordStrength = getPasswordStrength(formData.newPassword);
  
  const isValid = isPasswordValid && passwordsMatch && formData.newPassword !== "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ newPassword: true, confirmPassword: true });
    
    if (!isValid) {
      return;
    }

    if (!token) {
      setError("Reset token is missing. Please request a new password reset link.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Updated to match the exact API format from your cURL command
      const response = await axios.post(
        "https://jkauto-backend.onthewifi.com/api/v1/auth/reset-password",
        {
          token: token,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        },
        {
          headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      // Handle success based on your API response structure
      if (response.data.statusCode === 200 || response.data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(response.data.message || "Failed to reset password. Please try again.");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      if (err.response) {
        if (err.response.status === 404) {
          setError("Password reset endpoint not found. Please contact support.");
        } else {
          setError(err.response.data.message || "Invalid or expired reset token. Please request a new password reset link.");
        }
      } else if (err.request) {
        setError("Network error. Please check your internet connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-md">
        {/* Back to Login Button */}
        <Link
          to="/login"
          className="absolute -top-12 left-0 inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Back to Login
        </Link>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 p-8 transition-all duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl mb-4 shadow-lg">
              <Key className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-orange-700 bg-clip-text text-transparent">
              Create New Password
            </h1>
            <p className="text-gray-600 mt-2">
              Please enter your new password below
            </p>
          </div>

          {/* Success State */}
          {isSuccess ? (
            <div className="animate-fade-in">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-4">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">
                  Password Reset Successful!
                </h3>
                <p className="text-emerald-700 text-sm">
                  Your password has been successfully reset.
                </p>
                <p className="text-emerald-600 text-xs mt-3">
                  Redirecting you to login page...
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  New Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-orange-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    onBlur={() => handleBlur("newPassword")}
                    placeholder="Enter new password"
                    className={`w-full pl-10 pr-12 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      touched.newPassword && !isPasswordValid && formData.newPassword !== ""
                        ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                        : touched.newPassword && isPasswordValid
                        ? "border-green-300 focus:ring-green-200 focus:border-green-500"
                        : "border-gray-200 focus:ring-orange-200 focus:border-orange-500"
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {touched.newPassword && formData.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            passwordStrength.strength === 1 ? 'w-1/5 bg-red-500' :
                            passwordStrength.strength === 2 ? 'w-2/5 bg-orange-500' :
                            passwordStrength.strength === 3 ? 'w-3/5 bg-yellow-500' :
                            passwordStrength.strength === 4 ? 'w-4/5 bg-blue-500' :
                            passwordStrength.strength === 5 ? 'w-full bg-green-500' : 'w-0'
                          }`}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        {passwordStrength.text}
                      </span>
                    </div>
                  </div>
                )}

                {touched.newPassword && !isPasswordValid && formData.newPassword !== "" && (
                  <p className="text-red-600 text-xs flex items-center gap-1 mt-1 animate-slide-down">
                    <AlertCircle className="w-3 h-3" />
                    Password must be at least 8 characters with uppercase, lowercase, number & special character
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-orange-500" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={() => handleBlur("confirmPassword")}
                    placeholder="Confirm your new password"
                    className={`w-full pl-10 pr-12 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      touched.confirmPassword && !passwordsMatch && formData.confirmPassword !== ""
                        ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                        : touched.confirmPassword && passwordsMatch && formData.confirmPassword !== ""
                        ? "border-green-300 focus:ring-green-200 focus:border-green-500"
                        : "border-gray-200 focus:ring-orange-200 focus:border-orange-500"
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {touched.confirmPassword && !passwordsMatch && formData.confirmPassword !== "" && (
                  <p className="text-red-600 text-xs flex items-center gap-1 mt-1 animate-slide-down">
                    <AlertCircle className="w-3 h-3" />
                    Passwords do not match
                  </p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-slide-down">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-red-800 text-sm font-medium">Error</p>
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !isValid || !token}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  <>
                    <Key className="w-5 h-5" />
                    Reset Password
                  </>
                )}
              </button>

              {/* Password Requirements */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-700 mb-2">Password Requirements:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${formData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    Minimum 8 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    At least one uppercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    At least one lowercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    At least one number
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    At least one special character
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${passwordsMatch && formData.confirmPassword !== '' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    Passwords must match
                  </li>
                </ul>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;