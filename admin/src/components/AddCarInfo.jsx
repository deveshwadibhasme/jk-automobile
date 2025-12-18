import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AddCarInfo = () => {
  const { token, logOut } = useAuth();

  const LOCAL_URL = "http://localhost:3000";
  const PUBLIC_URL = "https://jk-automobile-9xtf.onrender.com";

  const url = location.hostname === "localhost" ? LOCAL_URL : PUBLIC_URL;

  const idToPost = location.pathname.split("/")[2];
  const { moduleType } = useLocation().state;

  const [preData, setPreData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    module_photo: "",
    sticker_photo: "",
    module_type: moduleType,
    km_miles: "",
    engine_type: "",
    transmission: "",
    note: "",
    module_number: idToPost,
  });

  const [files, setFiles] = useState({
    module: null,
    sticker: null,
    zip: null,
  });

  const FilesData = new FormData();

  Object.values(files).forEach((file) => {
    FilesData.append("file", file);
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
  FilesData.append("car_id", idToPost);

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    try {
      setLoading(true);
      let formToUpload = { ...formData };
      if (files.module !== null) {
        const uploadResponse = await axios.post(
          `${url}/file/upload`,
          FilesData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        formToUpload = {
          ...formToUpload,
          module_photo: uploadResponse.data.files[0].url,
          sticker_photo: uploadResponse.data.files[1].url,
        };
      }
      const postModuleResponse = await axios.post(
        `${url}/data/post-module-data`,
        formToUpload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      alert(postModuleResponse.data.message);
      setLoading(false);
      // location.reload()
    } catch (error) {
      console.error("Error uploading data:", error);
      alert(
        error.response?.data?.message || "Failed to upload data or try to login"
      );
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
    const fetchCars = async () => {
      try {
        const response = await axios.get(
          `${url}/data/get-module-data/${idToPost}`,
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
  }, []);

  useEffect(() => {
    if (!preData) return;

    setFormData((prev) => ({
      ...prev,
      km_miles: preData.km_miles ?? "",
      engine_type: preData.engine_type ?? "",
      transmission: preData.transmission ?? "",
    }));
  }, [preData]);

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
              type="file"
              accept=".png,.jpg,.jpeg,.svg,.webp,.avif"
              label="Module Photo"
              name="picture"
              onChange={(e) => handleFile(e, "module")}
              placeholder="Photo of Module"
            />
            <Input
              type="file"
              accept=".png,.jpg,.jpeg,.svg,.webp,.avif"
              label="Sticker Photo"
              name="picture"
              onChange={(e) => handleFile(e, "sticker")}
              placeholder="Enter Sticker of Module"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              readOnly
              label="Module Type"
              name="module_type"
              value={formData.module_type}
              placeholder="Enter module type"
            />
            <Input
              // disabled
              type="file"
              accept=".zip,.bin,.rar"
              label="Bin File ()"
              name="bin_file"
              onChange={(e) => handleFile(e, "zip")}
              placeholder="Enter Bin File"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="KM/Miles"
              name="km_miles"
              value={formData.km_miles}
              onChange={handleChange}
              placeholder="Enter KM/Miles"
            />
            <Input
              label="Engine Type"
              name="engine_type"
              value={formData.engine_type}
              onChange={handleChange}
              placeholder="Enter engine type"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Transmission"
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              placeholder="Enter transmission type"
            />
            <Input
              readOnly
              label="Module Number"
              name="module_number"
              value={formData.module_number}
              onChange={handleChange}
              placeholder="Enter module number"
            />
          </div>
          <div className="grid md:grid-cols-1 gap-6">
            <Input
              label="Note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Enter Note"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-10">
            <button
              type="submit"
              className="flex-1 max-w-[150px] py-3 text-white font-semibold rounded-lg shadow-lg bg-linear-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 transition transform hover:scale-105"
            >
              {loading ? "Updating.." : "Update"}
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
              Car List
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
    />
  </div>
);

export default AddCarInfo;
