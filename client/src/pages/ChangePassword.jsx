import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Lock, 
  Key, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Shield,
  LogOut,
  ArrowLeft
} from "lucide-react";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const [userEmail, setUserEmail] = useState("");
  
  const navigate = useNavigate();

  // Get token from storage (check both localStorage and sessionStorage)
  const getToken = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log("Token retrieved:", token ? "Yes (length: " + token.length + ")" : "No");
    return token;
  };

  // Get user data from storage
  const getUserData = () => {
    const userDataStr = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        setUserEmail(userData.email || userData.user?.email || "");
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  };

  // Check authentication on component mount
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setError("Authentication token not found. Please login again.");
    } else {
      getUserData();
    }
  }, []);

  const validatePassword = (password) => {
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

  const isNewPasswordValid = validatePassword(formData.newPassword);
  const passwordsMatch = formData.newPassword === formData.confirmPassword;
  const isCurrentPasswordFilled = formData.currentPassword !== "";
  const passwordStrength = getPasswordStrength(formData.newPassword);
  
  const isValid = isCurrentPasswordFilled && isNewPasswordValid && passwordsMatch && formData.newPassword !== "";

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
    setTouched({
      currentPassword: true,
      newPassword: true,
      confirmPassword: true
    });
    
    if (!isValid) {
      return;
    }

    setIsLoading(true);
    setError("");

    const token = getToken();
    if (!token) {
      setError("Authentication token not found. Please login again.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Sending password change request...");
      const response = await axios.post(
        "https://jk-backend.onthewifi.com/api/v1/auth/change-password",
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        },
        {
          headers: {
            "accept": "application/json",
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response received:", response.data);

      if (response.data.statusCode === 200 || response.data.success) {
        setIsSuccess(true);
        // Clear form after successful change
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        setError(response.data.message || "Failed to change password. Please try again.");
      }
    } catch (err) {
      console.error("Change password error:", err);
      if (err.response) {
        if (err.response.status === 401) {
          setError("Current password is incorrect or session expired. Please login again.");
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('userData');
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setError(err.response.data?.message || "Failed to change password. Please try again.");
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userData');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-4xl mx-auto">
        {/* Header with Logout and Back Button */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500/10 hover:bg-gray-500/20 text-gray-600 rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-orange-700 bg-clip-text text-transparent">
                Security Settings
              </h1>
              {userEmail && (
                <p className="text-gray-600 text-sm mt-1">
                  Logged in as: <span className="font-medium">{userEmail}</span>
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl mb-4 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800">Password Security</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Keep your account secure
                </p>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>Use strong passwords</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>Don't share your password</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>Update regularly</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                  <span>Enable 2FA recommended</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    <strong>Tip:</strong> A strong password should be at least 8 characters and include uppercase, lowercase, numbers, and special characters.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Form */}
          <div className="md:col-span-2">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
                <p className="text-gray-600 text-sm mt-1">
                  Update your password to keep your account secure
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
                      Password Changed Successfully!
                    </h3>
                    <p className="text-emerald-700 text-sm">
                      Your password has been updated. Redirecting you to dashboard...
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Current Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-orange-500" />
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        onBlur={() => handleBlur("currentPassword")}
                        placeholder="Enter your current password"
                        className={`w-full pl-10 pr-12 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                          touched.currentPassword && !isCurrentPasswordFilled && formData.currentPassword !== ""
                            ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                            : touched.currentPassword && isCurrentPasswordFilled
                            ? "border-green-300 focus:ring-green-200 focus:border-green-500"
                            : "border-gray-200 focus:ring-orange-200 focus:border-orange-500"
                        }`}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      New Password
                    </label>
                    <div className="relative group">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-orange-500" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        onBlur={() => handleBlur("newPassword")}
                        placeholder="Enter new password"
                        className={`w-full pl-10 pr-12 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                          touched.newPassword && !isNewPasswordValid && formData.newPassword !== ""
                            ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                            : touched.newPassword && isNewPasswordValid
                            ? "border-green-300 focus:ring-green-200 focus:border-green-500"
                            : "border-gray-200 focus:ring-orange-200 focus:border-orange-500"
                        }`}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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

                    {touched.newPassword && !isNewPasswordValid && formData.newPassword !== "" && (
                      <p className="text-red-600 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        Password must be at least 8 characters with uppercase, lowercase, number & special character
                      </p>
                    )}
                  </div>

                  {/* Confirm New Password */}
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
                      <p className="text-red-600 text-xs flex items-center gap-1 mt-1">
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

                  {/* Form Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isLoading || !isValid}
                      className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Updating Password...
                        </>
                      ) : (
                        <>
                          <Key className="w-5 h-5" />
                          Update Password
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: ""
                        });
                        setTouched({
                          currentPassword: false,
                          newPassword: false,
                          confirmPassword: false
                        });
                      }}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all"
                    >
                      Clear
                    </button>
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-gray-50 rounded-lg p-4 mt-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Password Requirements:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${formData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          Minimum 8 characters
                        </li>
                        <li className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          Uppercase letter
                        </li>
                        <li className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          Lowercase letter
                        </li>
                      </ul>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          Number
                        </li>
                        <li className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          Special character
                        </li>
                        <li className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${passwordsMatch && formData.confirmPassword !== '' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          Passwords match
                        </li>
                      </ul>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
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

export default ChangePassword;