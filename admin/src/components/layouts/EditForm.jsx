import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";
import { sortedBrand, sortModel } from "../../searchBrand";
import {
  FaCarSide,
  FaMicrochip,
  FaMemory,
  FaHashtag,
  FaFileAlt,
  FaSave,
  FaUndo,
  FaInfoCircle,
  FaSignOutAlt,
} from "react-icons/fa";

const EditForm = () => {
  const { token, logOut } = useAuth();
  const navigate = useNavigate();
  const { id: idToEdit } = useParams();

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
  const [error, setError] = useState("");
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

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (!idToEdit) {
      setError("Invalid car id.");
      return;
    }

    const fetchCars = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/data/get-car-data/${idToEdit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const [data] = response.data.result ?? [];
        if (!data) {
          setError("Car data not found.");
          return;
        }
        setFormData({
          brand: data.brand,
          model: data.model,
          year: data.year,
          module: data.module,
          memory: data.memory,
          block_number: data.block_number,
          file_type: data.file_type,
        });
      } catch (err) {
        setError("Failed to fetch car data Try to Log in.");
        console.error("Error fetching car data:", err);
      }
    };
    fetchCars();
  }, [idToEdit, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/data/edit-car-data/${idToEdit}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error uploading data:", error);
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
      <div className="relative bg-white/90 backdrop-blur-md p-5 rounded-xl shadow-xl w-full max-w-5xl ml-auto mr-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Edit Car Data</h1>
          <p className="text-gray-600 mt-2">
            Update vehicle specifications in the database
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            {error}
          </div>
        )}

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
                  ⚠️ Please Log In First
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
            <Input
              label="Year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="e.g. 2022"
            />
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

          <div className="flex flex-wrap gap-4 justify-center mt-10">
            <button
              type="submit"
              disabled={loading || !token}
              className="flex-1 min-w-[140px] max-w-[180px] py-3 text-white font-semibold rounded-lg shadow-lg bg-gradient-to-br from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 transition transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FaSave size={18} />
              {!loading ? "Update" : "Updating..."}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex-1 min-w-[140px] max-w-[180px] py-3 text-gray-600 font-semibold rounded-lg shadow-sm bg-gray-50 border-2 border-gray-200 hover:bg-gray-100 transition transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <FaUndo size={16} />
              Reset
            </button>

            <Link
              to={`/car-info/${idToEdit}`}
              state={{ moduleType: formData.module }}
              className="flex-1 min-w-[140px] max-w-[180px] text-center py-3 text-blue-600 font-semibold rounded-lg shadow-sm bg-blue-50 border-2 border-blue-200 hover:bg-blue-100 transition transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <FaInfoCircle size={18} />
              Module Info
            </Link>

            <button
              type="button"
              onClick={handleLog}
              className="flex-1 min-w-[140px] max-w-[180px] text-center py-3 text-red-500 font-semibold rounded-lg shadow-sm bg-red-50 border-2 border-red-200 hover:bg-red-100 transition transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <FaSignOutAlt size={18} />
              {token ? "Sign Out" : "Sign In"}
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

export default EditForm;
