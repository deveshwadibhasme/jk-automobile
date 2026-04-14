import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";
import {
  FaImage,
  FaMicrochip,
  FaFileArchive,
  FaRoad,
  FaCogs,
  FaHashtag,
  FaStickyNote,
  FaRupeeSign,
  FaSave,
  FaUndo,
  FaList,
  FaSignOutAlt,
} from "react-icons/fa";

const AddCarInfo = () => {
  const { token, logOut } = useAuth();
  const navigate = useNavigate();
  const { id: idToPost } = useParams();
  const location = useLocation();
  const moduleType = location.state?.moduleType ?? "";

  const [preData, setPreData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    module_photo: "",
    sticker_photo: "",
    module_type: moduleType,
    km_miles: "",
    engine_type: "",
    transmission: "",
    note: "",
    price: "",
    module_number: idToPost,
  });

  const [files, setFiles] = useState({
    module: null,
    sticker: null,
    zip: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e, fileKey) => {
    setFiles((prev) => {
      const copy = { ...prev };
      copy[fileKey] = e.target.files[0];
      return copy;
    });
  };
  console.log(files);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      let formToUpload = { ...formData };
      if (
        files.module !== null ||
        files.sticker !== null ||
        files.zip !== null
      ) {
        const filesData = new FormData();
        if (files.module) filesData.append("file", files.module);
        if (files.sticker) filesData.append("file", files.sticker);
        if (files.zip) filesData.append("file", files.zip);
        filesData.append("car_id", idToPost);

        const uploadResponse = await axios.post(
          `https://jk-automobile-9xtf.onrender.com/file/upload`,
          filesData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const uploadedFiles = uploadResponse.data.result || [];
        let fileIdx = 0;

        formToUpload = {
          ...formToUpload,
          module_photo: files.module
            ? uploadedFiles[fileIdx++]?.url
            : formData.module_photo,
          sticker_photo: files.sticker
            ? uploadedFiles[fileIdx++]?.url
            : formData.sticker_photo,
        };
      }
      const postModuleResponse = await axios.post(
        `https://jk-automobile-9xtf.onrender.com/data/post-module-data`,
        formToUpload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // setFormData({
      //   file_type: "",
      //   module_type: "",
      //   module_photo: "",
      //   sticker_photo: "",
      //   km_miles: "",
      //   engine_type: "",
      //   transmission: "",
      //   module_number: "",
      // });
      alert(postModuleResponse.data.message);
      navigate("/list");
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
      file_type: "",
      module_type: "",
      module_photo: "",
      sticker_photo: "",
      km_miles: "",
      engine_type: "",
      transmission: "",
      module_number: "",
    });
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (!idToPost) {
      setError("Invalid car id.");
      return;
    }

    const fetchCars = async () => {
      try {
        const response = await axios.get(
          `https://jk-automobile-9xtf.onrender.com/data/get-module-data/${idToPost}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data.result[0];
        setPreData(data);
      } catch (err) {
        setError("Failed to fetch car data Try to Log in.");
        console.error("Error fetching car data:", err);
      }
    };
    fetchCars();
  }, [idToPost, token, navigate]);

  useEffect(() => {
    if (!preData) return;

    setFormData((prev) => ({
      ...prev,
      km_miles: preData.km_miles ?? "",
      engine_type: preData.engine_type ?? "",
      transmission: preData.transmission ?? "",
      price: preData.price ?? "",
      sticker_photo: preData.sticker_photo ?? "",
      module_photo: preData.module_photo ?? "",
      note: preData.notes ?? "",
    }));
  }, [preData]);
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
          <h1 className="text-3xl font-bold text-gray-800">
            Module Specifications
          </h1>
          <p className="text-gray-600 mt-2">
            Manage technical details and binary files
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              type="file"
              accept=".png,.jpg,.jpeg,.svg,.webp,.avif"
              label="Module Photo"
              icon={<FaImage className="inline mr-2" />}
              name="picture"
              onChange={(e) => handleFile(e, "module")}
              placeholder="Photo of Module"
            />
            <Input
              type="file"
              accept=".png,.jpg,.jpeg,.svg,.webp,.avif"
              label="Sticker Photo"
              icon={<FaImage className="inline mr-2 opacity-70" />}
              name="picture"
              onChange={(e) => handleFile(e, "sticker")}
              placeholder="Enter Sticker of Module"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              readOnly
              label="Module Type"
              icon={<FaMicrochip className="inline mr-2" />}
              name="module_type"
              value={formData.module_type}
              placeholder="Enter module type"
            />
            <Input
              // disabled
              type="file"
              accept=".zip,.bin,.rar"
              label="Bin File ()"
              icon={<FaFileArchive className="inline mr-2" />}
              name="bin_file"
              onChange={(e) => handleFile(e, "zip")}
              placeholder="Enter Bin File"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="KM/Miles"
              icon={<FaRoad className="inline mr-2" />}
              name="km_miles"
              value={formData.km_miles}
              onChange={handleChange}
              placeholder="Enter KM/Miles"
            />
            <div>
              <label className="text-gray-700 font-semibold mb-2 flex items-center">
                <FaCogs className="inline mr-2" />
                Engine Type
              </label>
              <select
                name="engine_type"
                value={formData.engine_type}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 rounded-md px-4 py-3 text-gray-800
      focus:ring-2 focus:ring-blue-400 outline-none transition inline-block"
                required
              >
                <option value="">Select type</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="hybrid">Hybrid</option>
                <option value="CNG">CNG</option>
                <option value="electronic">Electronic</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-700 font-semibold mb-2 flex items-center">
                <FaCogs className="inline mr-2" />
                Transmission
              </label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 rounded-md px-4 py-3 text-gray-800
      focus:ring-2 focus:ring-blue-400 outline-none transition inline-block"
                required
              >
                <option value="">Select type</option>
                <option value="petrol">Auto</option>
                <option value="diesel">Manual</option>
              </select>
            </div>
            <Input
              readOnly
              label="Module Number"
              icon={<FaHashtag className="inline mr-2" />}
              name="module_number"
              value={formData.module_number}
              onChange={handleChange}
              placeholder="Enter module number"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              // type="textarea"
              label="Note"
              icon={<FaStickyNote className="inline mr-2" />}
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Enter Note"
            />
            <Input
              type="number"
              label="Price of File"
              icon={<FaRupeeSign className="inline mr-2" />}
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter Price"
            />
          </div>

          <div className="flex flex-wrap gap-4 justify-center mt-10">
            <button
              type="submit"
              disabled={loading || !token}
              className="flex-1 min-w-[140px] max-w-[180px] py-3 text-white font-semibold rounded-lg shadow-lg bg-linear-to-br from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 transition transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FaSave size={18} />
              {loading ? "Updating.." : "Update"}
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
              to={"/list"}
              className="flex-1 min-w-[140px] max-w-[180px] text-center py-3 text-blue-600 font-semibold rounded-lg shadow-sm bg-blue-50 border-2 border-blue-200 hover:bg-blue-100 transition transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <FaList size={18} />
              Car List
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
    />
  </div>
);

export default AddCarInfo;
