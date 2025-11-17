import React, { useState } from "react";
import bgImage from "../assets/car-bg.avif";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";


const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile_no: "",
    otp: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const { loginAction } = useAuth();

  const LOCAL_URL = 'http://localhost:3000'
  const PUBLIC_URL = 'https://jk-automobile.onrender.com'

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOTP = () => {

    axios.post(
        `${PUBLIC_URL}/auth/user/sign-up`,
        { email: formData.email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        alert(response.data.message);
      })
      .catch((error) => {
        console.error("Error sending OTP:", error.response ? error.response.data : error.message);
        alert(error.response?.data?.message || "Failed to send OTP. Please try again.");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
     axios.post(
        `${PUBLIC_URL}/auth/user/verify-and-register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        alert("Registration successful!");
        loginAction(response.data);
      })
      .catch((error) => {
        console.error("Error during registration:", error.response ? error.response.data : error.message);
        alert(error.response?.data?.message || "Registration failed. Please check your details.");
      });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="p-10 max-w-2xl w-full bg-white/80">
        <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-600 mt-2 mb-8">
          Join our platform and start your journey.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="flex gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="w-full mt-2 px-4 py-3 border rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                required
              />
            </div>

            <button
              className="h-full py-3 cursor-pointer px-3 mt-auto bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-lg text-lg shadow-md"
              type="button"
              onClick={handleOTP}
            >
              Verify
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              One Time Password
            </label>

            <div id="otp" className="relative mt-2">
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                className="w-1/3 px-4 py-3 border rounded-lg pr-12 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                required
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full mt-2 px-4 py-3 border rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full px-4 py-3 border rounded-lg pr-12 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mobile Number
            </label>

            <div className="relative mt-2">
              <input
                type="text" 
                name="mobile_no"
                value={formData.mobile_no}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg pr-12 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                required
              />
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              className="w-4 h-4 accent-indigo-600"
              required
            />
            <span className="text-sm text-gray-700">
              I agree to the Terms & Conditions
            </span>
          </div>

          {/* Submit */}
          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-3 rounded-lg font-semibold shadow-md"
            type="submit"
          >
            Create Account
          </button>

          <p className="text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-medium">
              Sign In
            </Link>
          </p>
        </form>
      </div>

      {/* RIGHT — Community Section */}
      {/* <div className="hidden md:flex flex-col justify-center p-10 bg-indigo-600 text-white">
          <h2 className="text-4xl font-bold leading-tight">
            Join our growing community
          </h2>
          <p className="mt-4 text-indigo-200">
            Be part of something bigger — connect, learn, and grow with access
            to premium features and content.
          </p>
        </div> */}
    </div>
  );
};

export default RegistrationPage;
