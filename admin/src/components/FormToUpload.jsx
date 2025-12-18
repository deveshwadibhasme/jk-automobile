import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { Link, useNavigate } from "react-router-dom";

const FormToUpload = () => {
  const { token, logOut } = useAuth();

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    module: "",
    memory: "",
    block_number: "",
    file_type: "",
  });
  const [loading, setLoading] = useState(false);

  const LOCAL_URL = "http://localhost:3000";
  const PUBLIC_URL = "https://jk-automobile-9xtf.onrender.com";

  const url = location.hostname === "localhost" ? LOCAL_URL : PUBLIC_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/data/post-car-data`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      alert(response.data.message);
      setLoading(false)
    } catch (error) {
      console.error("Error uploading data:", error);
      alert(
        error.response?.data?.message || "Failed to upload data or try to login"
      );
    }
  };

  const handleReset = () => {
    setFormData({
      brand: "",
      model: "",
      year: "",
      module: "",
      memory: "",
      block_number: "",
      file_type: "",
    });
  };

  const navigate = useNavigate();

  const handleLog = () => {
    if (token) {
      navigate("/login");
      logOut();
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="relative min-h-screen py-5 max-w-screen-2xl mx-auto bg-[#302e2e] overflow-hidden font-sans">
      <div className="relative bg-white/90 backdrop-blur-md p-5 rounded-xl shadow-xl w-full max-w-5xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Enter brand name"
            />
            <span>{!token ? "Log In First" : ""}</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="Enter model number"
            />
            <Input
              label="Year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="Enter year"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Module"
              name="module"
              value={formData.module}
              onChange={handleChange}
              placeholder="Enter module name"
            />
            <Input
              label="Memory Size"
              name="memory"
              value={formData.memory}
              onChange={handleChange}
              placeholder="Enter memory size"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Block Number"
              name="block_number"
              value={formData.block_number}
              onChange={handleChange}
              placeholder="Enter block number"
            />

            <div>
              <Label title="File Type" />
              <select
                name="file_type"
                value={formData.file_type}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none transition"
                required
              >
                <option value="">Select file type</option>
                <option value="Eeprom">EEprom</option>
                <option value="Flash">Flash</option>
                <option value="Full">Full</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-10">
            <button
              type="submit"
              className="flex-1 max-w-[150px] py-3 text-white font-semibold rounded-lg shadow-lg bg-linear-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 transition transform hover:scale-105"
            >
              {!loading ? 'Upload' : 'Uploading...'} 
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex-1 max-w-[150px] py-3 text-gray-800 font-semibold rounded-lg shadow-lg bg-transparent border-2 border-gray-400 hover:bg-gray-100 transition transform hover:scale-105"
            >
              Reset
            </button>
            <Link
              to={"/list"}
              className="flex-1 max-w-[150px] text-center py-3 text-gray-800 font-semibold rounded-lg shadow-lg bg-transparent border-2 border-gray-400 hover:bg-gray-100 transition transform hover:scale-105"
            >
              Vehicle List
            </Link>
            <button
              type="button"
              onClick={handleLog}
              className="flex-1 max-w-[150px] text-center py-3 text-gray-800 font-semibold rounded-lg shadow-lg bg-transparent border-2 border-gray-400 hover:bg-gray-100 transition transform hover:scale-105"
            >
              Log In/Out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Label = ({ title }) => (
  <label className="text-gray-700 font-semibold mb-2 block">{title}</label>
);

const Input = ({ label, ...props }) => (
  <div>
    <Label title={label} />
    <input
      {...props}
      className="w-full border-2 border-gray-300 rounded-md px-4 py-3 text-gray-800
      focus:ring-2 focus:ring-blue-400 outline-none transition"
      required
    />
  </div>
);

export default FormToUpload;
