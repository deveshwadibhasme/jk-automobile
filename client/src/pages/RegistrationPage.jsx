import React, { useState } from "react";

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registration:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-4xl grid md:grid-cols-2 overflow-hidden">
        {/* LEFT — Form */}
        <div className="p-10">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600 mt-2 mb-8">
            Join our platform and start your journey.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full mt-2 px-4 py-3 border rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                required
              />
            </div>

            {/* Email */}
            <div>
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
                Confirm Password
              </label>

              <div className="relative mt-2">
                <input
                  type={showPassword2 ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="********"
                  className="w-full px-4 py-3 border rounded-lg pr-12 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword2(!showPassword2)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword2 ? "🙈" : "👁️"}
                </button>
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
              <a href="/login" className="text-indigo-600 font-medium">
                Sign In
              </a>
            </p>
          </form>
        </div>

        {/* RIGHT — Community Section */}
        <div className="hidden md:flex flex-col justify-center p-10 bg-indigo-600 text-white">
          <h2 className="text-4xl font-bold leading-tight">
            Join our growing community
          </h2>
          <p className="mt-4 text-indigo-200">
            Be part of something bigger — connect, learn, and grow with access
            to premium features and content.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
