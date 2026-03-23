import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { sortedBrand, sortModel } from "../searchBrand";
import { API_BASE_URL } from "../config/api";
import {
  FaCloudUploadAlt,
  FaUndo,
  FaCarSide,
  FaMicrochip,
  FaMemory,
  FaHashtag,
  FaFileAlt,
} from "react-icons/fa";

const FormToUpload = () => {
  const { token } = useAuth();

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
  const [option, setOption] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "brand") {
      const models = sortModel(value) ?? [];
      setOption(models);
      setFormData((prev) => ({ ...prev, model: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please login first.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `https://jk-automobile-9xtf.onrender.com/data/post-car-data`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data.message);
      setFormData({
        brand: "",
        model: "",
        year: "",
        module: "",
        memory: "",
        block_number: "",
        file_type: "",
      });
      setLoading(false);
    } catch (error) {
      console.error("Error uploading data:", error);
      alert(
        error.response?.data?.message || "Failed to upload data or try to login"
      );
    } finally {
      setLoading(false);
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

  return (
    <div className="relative min-h-screen py-5 max-w-screen-2xl mx-auto bg-[#302e2e] overflow-hidden font-sans">
      <div className="relative bg-white/90 backdrop-blur-md p-5 rounded-xl shadow-xl w-full max-w-5xl ml-auto mr-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Upload Car Data</h1>
          <p className="text-gray-600 mt-2">
            Add new vehicle specifications to the database
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label
                title="Brand"
                icon={<FaCarSide className="inline mr-2" />}
              />
              <select
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none transition bg-white"
                required
              >
                <option value="">Select brand</option>
                {sortedBrand().map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              {!token && (
                <span className="text-red-500 font-medium animate-pulse">
                  ⚠️ Please Log In First to enable upload
                </span>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label
                title="Model"
                icon={<FaCarSide className="inline mr-2 opacity-50" />}
              />
              <select
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none transition bg-white"
                required
                disabled={!formData.brand}
              >
                <option value="">Select model</option>
                {option &&
                  option.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <Label title="Year" />
              <input
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="e.g. 2022"
                className="w-full border-2 border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Module"
              icon={<FaMicrochip className="inline mr-2" />}
              name="module"
              value={formData.module}
              onChange={handleChange}
              placeholder="e.g. Bosch EDC17"
            />
            <Input
              label="Memory Size"
              icon={<FaMemory className="inline mr-2" />}
              name="memory"
              value={formData.memory}
              onChange={handleChange}
              placeholder="e.g. 2MB"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Block Number"
              icon={<FaHashtag className="inline mr-2" />}
              name="block_number"
              value={formData.block_number}
              onChange={handleChange}
              placeholder="e.g. 0281012345"
            />

            <div>
              <Label
                title="File Type"
                icon={<FaFileAlt className="inline mr-2" />}
              />
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <button
              type="submit"
              disabled={loading || !token}
              className="flex-1 max-w-[200px] py-3 text-white mx-auto w-full font-semibold rounded-lg shadow-lg bg-linear-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaCloudUploadAlt size={20} />
              {!loading ? "Upload Data" : "Uploading..."}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex-1 max-w-[200px] py-3 mx-auto w-full text-gray-600 font-semibold rounded-lg shadow-sm bg-gray-50 border-2 border-gray-200 hover:bg-gray-100 transition transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <FaUndo size={16} />
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Label = ({ title, icon }) => (
  <label className="text-gray-700 font-semibold mb-2 flex items-center">
    {icon}
    {title}
  </label>
);

const Input = ({ label, icon, ...props }) => (
  <div>
    <Label title={label} icon={icon} />
    <input
      {...props}
      className="w-full border-2 border-gray-300 rounded-md px-4 py-3 text-gray-800
      focus:ring-2 focus:ring-blue-400 outline-none transition"
      required
    />
  </div>
);

export default FormToUpload;
