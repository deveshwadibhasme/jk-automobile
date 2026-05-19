import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
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
  FaSpinner,
} from "react-icons/fa";

const AddCarInfo = () => {
  const { token, logOut } = useAuth();
  const navigate = useNavigate();
  const { id: idToPost } = useParams();
  const location = useLocation();
  const moduleType = location.state?.moduleType ?? "";

  const [preData, setPreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadingFiles, setUploadingFiles] = useState({
    module: false,
    sticker: false,
    zip: false
  });

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
    const file = e.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [fileKey]: file }));
      // Clear previous error when new file is selected
      setError("");
    }
  };

  // Upload a single file to the server
  const uploadFile = async (file, carId) => {
    if (!file) return null;
    
    const formDataToUpload = new FormData();
    formDataToUpload.append("file", file);
    formDataToUpload.append("car_id", carId);
    
    try {
      const response = await axios.post(
        `https://jk-backend.onthewifi.com/api/v1/file/upload`,
        formDataToUpload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // The API returns { result: [{ url: "...", file_name: "..." }] }
      console.log("Upload response:", response.data);
      
      if (response.data.result && response.data.result.length > 0) {
        return response.data.result[0].url;
      } else if (response.data.url) {
        return response.data.url;
      } else if (response.data.file_url) {
        return response.data.file_url;
      }
      
      return null;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      navigate("/login");
      return;
    }

    if (!idToPost) {
      setError("Invalid car ID");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      let modulePhotoUrl = formData.module_photo;
      let stickerPhotoUrl = formData.sticker_photo;
      
      // Upload module photo if selected
      if (files.module) {
        setUploadingFiles(prev => ({ ...prev, module: true }));
        try {
          modulePhotoUrl = await uploadFile(files.module, idToPost);
          console.log("Module photo uploaded:", modulePhotoUrl);
        } catch (err) {
          throw new Error("Failed to upload module photo: " + err.message);
        } finally {
          setUploadingFiles(prev => ({ ...prev, module: false }));
        }
      }
      
      // Upload sticker photo if selected
      if (files.sticker) {
        setUploadingFiles(prev => ({ ...prev, sticker: true }));
        try {
          stickerPhotoUrl = await uploadFile(files.sticker, idToPost);
          console.log("Sticker photo uploaded:", stickerPhotoUrl);
        } catch (err) {
          throw new Error("Failed to upload sticker photo: " + err.message);
        } finally {
          setUploadingFiles(prev => ({ ...prev, sticker: false }));
        }
      }
      
      // Upload binary/zip file if selected
      if (files.zip) {
        setUploadingFiles(prev => ({ ...prev, zip: true }));
        try {
          await uploadFile(files.zip, idToPost);
          console.log("Binary file uploaded");
        } catch (err) {
          throw new Error("Failed to upload binary file: " + err.message);
        } finally {
          setUploadingFiles(prev => ({ ...prev, zip: false }));
        }
      }
      
      // Prepare data for module posting - matching the exact API format
      const moduleData = {
        module_type: formData.module_type,
        module_number: formData.module_number,
        km_miles: formData.km_miles,
        engine_type: formData.engine_type,
        transmission: formData.transmission,
        price: formData.price,
      };
      
      // Only add fields if they have values (not empty strings)
      if (modulePhotoUrl) moduleData.module_photo = modulePhotoUrl;
      if (stickerPhotoUrl) moduleData.sticker_photo = stickerPhotoUrl;
      if (formData.note && formData.note.trim()) moduleData.note = formData.note;
      
      console.log("Posting module data:", moduleData);
      
      const postModuleResponse = await axios.post(
        `https://jk-backend.onthewifi.com/api/v1/data/post-module-data`,
        moduleData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("Post response:", postModuleResponse.data);
      
      // Check for successful response
      if (postModuleResponse.status === 200 || postModuleResponse.status === 201) {
        alert(postModuleResponse.data.message || "Module data saved successfully!");
        // Reset files after successful submission
        setFiles({ module: null, sticker: null, zip: null });
        navigate("/list");
      } else {
        throw new Error(postModuleResponse.data.message || "Failed to save module data");
      }
      
    } catch (error) {
      console.error("Error uploading data:", error);
      console.error("Error response:", error.response?.data);
      
      let errorMessage = "Failed to upload data. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
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
    setFiles({
      module: null,
      sticker: null,
      zip: null,
    });
    // Reset file input elements
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
      if (input) input.value = '';
    });
    setError("");
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
        const data = response.data.result?.[0];
        if (data) {
          setPreData(data);
        }
      } catch (err) {
        console.error("Error fetching car data:", err);
        // Don't set error for fetch - it might be a new car
      }
    };
    fetchCars();
  }, [idToPost, token, navigate]);

  useEffect(() => {
    if (!preData) return;

    setFormData((prev) => ({
      ...prev,
      km_miles: preData.km_miles || preData.km_miles === 0 ? preData.km_miles : "",
      engine_type: preData.engine_type || "",
      transmission: preData.transmission || "",
      price: preData.price || "",
      sticker_photo: preData.sticker_photo || "",
      module_photo: preData.module_photo || "",
      note: preData.notes || preData.note || "",
    }));
  }, [preData]);

  const handleLog = () => {
    logOut();
    navigate("/login");
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
            <div>
              <Label title="Module Photo" icon={<FaImage className="inline mr-2" />} />
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.svg,.webp,.avif"
                name="module_photo"
                onChange={(e) => handleFile(e, "module")}
                className="w-full border-2 border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none transition"
                disabled={uploadingFiles.module}
              />
              {uploadingFiles.module && (
                <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                  <FaSpinner className="animate-spin" /> Uploading...
                </p>
              )}
              {formData.module_photo && !files.module && !uploadingFiles.module && (
                <p className="text-sm text-green-600 mt-1">✓ Current photo saved</p>
              )}
              {files.module && !uploadingFiles.module && (
                <p className="text-sm text-blue-600 mt-1">✓ Ready to upload: {files.module.name}</p>
              )}
            </div>
            
            <div>
              <Label title="Sticker Photo" icon={<FaImage className="inline mr-2 opacity-70" />} />
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.svg,.webp,.avif"
                name="sticker_photo"
                onChange={(e) => handleFile(e, "sticker")}
                className="w-full border-2 border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none transition"
                disabled={uploadingFiles.sticker}
              />
              {uploadingFiles.sticker && (
                <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                  <FaSpinner className="animate-spin" /> Uploading...
                </p>
              )}
              {formData.sticker_photo && !files.sticker && !uploadingFiles.sticker && (
                <p className="text-sm text-green-600 mt-1">✓ Current photo saved</p>
              )}
              {files.sticker && !uploadingFiles.sticker && (
                <p className="text-sm text-blue-600 mt-1">✓ Ready to upload: {files.sticker.name}</p>
              )}
            </div>
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
            <div>
              <Label title="Binary/ ZIP File" icon={<FaFileArchive className="inline mr-2" />} />
              <input
                type="file"
                accept=".zip,.bin,.rar,.hex"
                name="bin_file"
                onChange={(e) => handleFile(e, "zip")}
                className="w-full border-2 border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none transition"
                disabled={uploadingFiles.zip}
              />
              {uploadingFiles.zip && (
                <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                  <FaSpinner className="animate-spin" /> Uploading...
                </p>
              )}
              {files.zip && !uploadingFiles.zip && (
                <p className="text-sm text-blue-600 mt-1">✓ Ready to upload: {files.zip.name}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">Binary file will be uploaded separately</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="KM/Miles"
              icon={<FaRoad className="inline mr-2" />}
              name="km_miles"
              value={formData.km_miles}
              onChange={handleChange}
              placeholder="Enter KM/Miles"
              type="number"
            />
            <div>
              <Label title="Engine Type" icon={<FaCogs className="inline mr-2" />} />
              <select
                name="engine_type"
                value={formData.engine_type}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none transition"
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
              <Label title="Transmission" icon={<FaCogs className="inline mr-2" />} />
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none transition"
                required
              >
                <option value="">Select type</option>
                <option value="auto">Auto</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <Input
              readOnly
              label="Module Number"
              icon={<FaHashtag className="inline mr-2" />}
              name="module_number"
              value={formData.module_number}
              placeholder="Enter module number"
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Input
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
              step="0.01"
            />
          </div>

          <div className="flex flex-wrap gap-4 justify-center mt-10">
            <button
              type="submit"
              disabled={loading || !token || uploadingFiles.module || uploadingFiles.sticker || uploadingFiles.zip}
              className="flex-1 min-w-[140px] max-w-[180px] py-3 text-white font-semibold rounded-lg shadow-lg bg-gradient-to-br from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 transition transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaSave size={18} />}
              {loading ? "Updating..." : "Update"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="flex-1 min-w-[140px] max-w-[180px] py-3 text-gray-600 font-semibold rounded-lg shadow-sm bg-gray-50 border-2 border-gray-200 hover:bg-gray-100 transition transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FaUndo size={16} />
              Reset
            </button>
            
            <Link
              to="/list"
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
              Sign Out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Label = ({ title, icon, children }) => (
  <label className="text-gray-700 font-semibold mb-2 flex items-center">
    {icon}
    {title}
    {children}
  </label>
);

const Input = ({ label, icon, ...props }) => (
  <div>
    <Label title={label} icon={icon} />
    <input
      {...props}
      className="w-full border-2 border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none transition"
    />
  </div>
);

export default AddCarInfo;