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
  FaUpload,
} from "react-icons/fa";

const AddCarInfo = () => {
  const { token, logOut } = useAuth();
  const navigate = useNavigate();
  const { id: idToPost } = useParams();
  const location = useLocation();
  const moduleType = location.state?.moduleType ?? "";

  const [preData, setPreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const [moduleSaved, setModuleSaved] = useState(false);
  const [moduleId, setModuleId] = useState(null);
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
      setError("");
    }
  };

  // Upload file to server (called after module is saved)
  const uploadFile = async (file, carId, fileType = 'image') => {
    if (!file) return null;
    
    const formDataToUpload = new FormData();
    formDataToUpload.append("file", file);
    formDataToUpload.append("car_id", carId);
    formDataToUpload.append("file_type", fileType);
    
    try {
      const response = await axios.post(
        `https://jk-backend.onthewifi.com/api/v1/admin/upload`,
        formDataToUpload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("Upload response:", response.data);
      
      if (response.data.statusCode === 200 && response.data.data) {
        return response.data.data.url;
      }
      
      return null;
    } catch (error) {
      console.error("Error uploading file:", error);
      console.error("Error response data:", error.response?.data);
      throw error;
    }
  };

  // Save module data first (without binary file)
  const saveModuleData = async () => {
    const moduleData = {
      module_type: formData.module_type,
      module_number: formData.module_number,
      km_miles: formData.km_miles || "0",
      engine_type: formData.engine_type,
      transmission: formData.transmission,
      price: formData.price ? parseFloat(formData.price) : 0,
    };
    
    // Only add fields if they have values
    if (formData.module_photo && typeof formData.module_photo === 'string') moduleData.module_photo = formData.module_photo;
    if (formData.sticker_photo && typeof formData.sticker_photo === 'string') moduleData.sticker_photo = formData.sticker_photo;
    if (formData.note && formData.note.trim()) moduleData.note = formData.note;
    
    console.log("Saving module data:", moduleData);
    
    const response = await axios.post(
      `https://jk-backend.onthewifi.com/api/v1/admin/modules`,
      moduleData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response;
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
      
      // STEP 1: Save module data first
      let modulePhotoUrl = formData.module_photo;
      let stickerPhotoUrl = formData.sticker_photo;
      
      // Upload module photo if selected
      if (files.module) {
        setUploadingFiles(prev => ({ ...prev, module: true }));
        try {
          const uploadedUrl = await uploadFile(files.module, idToPost, 'image');
          if (uploadedUrl) {
            modulePhotoUrl = uploadedUrl;
          }
          console.log("Module photo uploaded:", modulePhotoUrl);
        } catch (err) {
          console.error("Module photo upload error:", err);
          throw new Error("Failed to upload module photo: " + (err.response?.data?.message || err.message));
        } finally {
          setUploadingFiles(prev => ({ ...prev, module: false }));
        }
      }
      
      // Upload sticker photo if selected
      if (files.sticker) {
        setUploadingFiles(prev => ({ ...prev, sticker: true }));
        try {
          const uploadedUrl = await uploadFile(files.sticker, idToPost, 'image');
          if (uploadedUrl) {
            stickerPhotoUrl = uploadedUrl;
          }
          console.log("Sticker photo uploaded:", stickerPhotoUrl);
        } catch (err) {
          console.error("Sticker photo upload error:", err);
          throw new Error("Failed to upload sticker photo: " + (err.response?.data?.message || err.message));
        } finally {
          setUploadingFiles(prev => ({ ...prev, sticker: false }));
        }
      }
      
      // Update formData with uploaded photo URLs
      if (modulePhotoUrl !== formData.module_photo) {
        setFormData(prev => ({ ...prev, module_photo: modulePhotoUrl }));
      }
      if (stickerPhotoUrl !== formData.sticker_photo) {
        setFormData(prev => ({ ...prev, sticker_photo: stickerPhotoUrl }));
      }
      
      // Prepare module data with uploaded photo URLs
      const moduleData = {
        module_type: formData.module_type,
        module_number: formData.module_number,
        km_miles: formData.km_miles || "0",
        engine_type: formData.engine_type,
        transmission: formData.transmission,
        price: formData.price ? parseFloat(formData.price) : 0,
      };
      
      if (modulePhotoUrl && typeof modulePhotoUrl === 'string') moduleData.module_photo = modulePhotoUrl;
      if (stickerPhotoUrl && typeof stickerPhotoUrl === 'string') moduleData.sticker_photo = stickerPhotoUrl;
      if (formData.note && formData.note.trim()) moduleData.note = formData.note;
      
      console.log("Posting module data:", moduleData);
      
      const postModuleResponse = await axios.post(
        `https://jk-backend.onthewifi.com/api/v1/admin/modules`,
        moduleData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("Post response:", postModuleResponse.data);
      
      if (postModuleResponse.data.statusCode === 200 || postModuleResponse.status === 200 || postModuleResponse.status === 201) {
        setModuleSaved(true);
        
        // Get the saved module ID from response if available
        if (postModuleResponse.data.data?.id) {
          setModuleId(postModuleResponse.data.data.id);
        }
        
        // STEP 2: Upload binary file if selected (after module is saved)
        if (files.zip) {
          setUploadingFiles(prev => ({ ...prev, zip: true }));
          try {
            const result = await uploadFile(files.zip, idToPost, 'binary');
            console.log("Binary file uploaded successfully:", result);
            alert("Module data saved and binary file uploaded successfully!");
          } catch (err) {
            console.error("Binary file upload error:", err);
            alert("Module data saved! However, binary file upload failed. You can upload it again later from the edit page.");
          } finally {
            setUploadingFiles(prev => ({ ...prev, zip: false }));
          }
        } else {
          alert(postModuleResponse.data.message || "Module data saved successfully!");
        }
        
        // Reset files after successful submission
        setFiles({ module: null, sticker: null, zip: null });
        
        // Reset file input elements
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
          if (input) input.value = '';
        });
        
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
      setIsFetching(true);
      try {
        const response = await axios.get(
          `https://jk-backend.onthewifi.com/api/v1/data/get-car-data/${idToPost}?includeDeleted=false`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        console.log("API Response:", response.data);
        
        if (response.data.statusCode === 200 && response.data.data) {
          const data = response.data.data;
          
          if (data.carInfos && data.carInfos.length > 0) {
            const carInfoData = data.carInfos[0];
            setPreData(carInfoData);
          } else {
            setPreData(null);
          }
        } else if (response.data.result && response.data.result.length > 0) {
          setPreData(response.data.result[0]);
        } else {
          setPreData(null);
        }
      } catch (err) {
        console.error("Error fetching car data:", err);
        
        if (err.response?.status === 404 || err.response?.status === 400) {
          console.log("No existing module data found for this car. This is a new module.");
          setPreData(null);
        } else {
          console.warn("Failed to check existing module data:", err.message);
          setError("Could not check existing module data. You can still create a new module.");
          setTimeout(() => {
            setError("");
          }, 5000);
        }
      } finally {
        setIsFetching(false);
      }
    };
    
    fetchCars();
  }, [idToPost, token, navigate]);

  useEffect(() => {
    if (!preData) return;

    setFormData((prev) => ({
      ...prev,
      km_miles: preData.kmMiles || preData.km_miles || "",
      engine_type: preData.engineType || preData.engine_type || "",
      transmission: preData.transmission || "",
      price: preData.price || "",
      sticker_photo: preData.stickerPhoto || preData.sticker_photo || "",
      module_photo: preData.modulePhoto || preData.module_photo || "",
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

        {isFetching && (
          <div className="bg-gray-100 border-l-4 border-gray-500 text-gray-700 p-4 mb-6 rounded flex items-center gap-2">
            <FaSpinner className="animate-spin" /> 
            Checking for existing module data...
          </div>
        )}

        {error && !isFetching && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            {error}
          </div>
        )}

        {!isFetching && !error && !preData && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded">
            No existing module data found. Fill out the form below to create a new module for car #{idToPost}.
          </div>
        )}

        {!isFetching && !error && preData && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
            Editing existing module data for car #{idToPost}
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
              <p className="text-sm text-gray-500 mt-1">Binary file will be uploaded AFTER module data is saved</p>
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
              step="1"
              min="0"
            />
          </div>

          <div className="flex flex-wrap gap-4 justify-center mt-10">
            <button
              type="submit"
              disabled={loading || !token || uploadingFiles.module || uploadingFiles.sticker || uploadingFiles.zip}
              className="flex-1 min-w-[140px] max-w-[180px] py-3 text-white font-semibold rounded-lg shadow-lg bg-gradient-to-br from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 transition transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaSave size={18} />}
              {loading ? "Saving..." : "Save Module"}
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