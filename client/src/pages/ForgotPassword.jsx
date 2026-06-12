import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Mail,
  ArrowLeft,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
} from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isValid = validateEmail(email);
  const showError = touched && !isValid && email !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);

    if (!isValid) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://jk-backend.onthewifi.com/api/v1/auth/forgot-password",
        { email }
      );

      if (response.data.success || response.status === 200) {
        setIsSuccess(true);
      } else {
        setError(
          response.data.message ||
            "Failed to send reset link. Please try again."
        );
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      if (err.response) {
        setError(
          err.response.data.message || "Email not found or invalid request."
        );
      } else if (err.request) {
        setError("Network error. Please check your internet connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setIsSuccess(false);
    setEmail("");
    setTouched(false);
    setError("");
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
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 p-8 transition-all duration-300 hover:shadow-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-slate-800 to-orange-700 bg-clip-text text-transparent">
              Forgot Password?
            </h1>
            <p className="text-gray-600 mt-2">
              No worries! Enter your email address and we'll send you a reset
              link.
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
                  Reset Link Sent!
                </h3>
                <p className="text-emerald-700 text-sm">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-emerald-600 text-xs mt-3">
                  Please check your email inbox (and spam folder) and click the
                  link to reset your password.
                </p>
              </div>

              <button
                onClick={handleResend}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
              >
                Send Another Request
              </button>

              <Link
                to="/login"
                className="block text-center mt-4 text-orange-500 hover:text-orange-600 text-sm font-medium"
              >
                Return to Login →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-orange-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (touched) setTouched(true);
                      if (error) setError("");
                    }}
                    onBlur={() => setTouched(true)}
                    placeholder="you@example.com"
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      showError
                        ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                        : "border-gray-200 focus:ring-orange-200 focus:border-orange-500"
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {showError && (
                  <p className="text-red-600 text-xs flex items-center gap-1 mt-1 animate-slide-down">
                    <AlertCircle className="w-3 h-3" />
                    Please enter a valid email address
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
                disabled={isLoading || !isValid}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Reset Link
                  </>
                )}
              </button>

              {/* Help Text */}
              <p className="text-center text-xs text-gray-500 mt-4">
                We'll send a password reset link to your email address.
                <br />
                The link will expire in 1 hour for security reasons.
              </p>
            </form>
          )}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            Need help? Contact our support team at{" "}
            <a
              href="mailto:support@onthewifi.com"
              className="text-orange-500 hover:text-orange-600"
            >
              support@onthewifi.com
            </a>
          </p>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
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

export default ForgotPassword;
