import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AddCarInfo = () => {
  const { token, logOut } = useAuth();

  const idToPost = location.pathname.split("/")[2];
  const { moduleType } = useLocation().state;

  const [formData, setFormData] = useState({
    module_type: moduleType,
    photo_of_the_module: "",
    sticker_photo: "",
    km_miles: "",
    engine_type: "",
    transmission: "",
    module_number: idToPost,
  });

  const [pictures, setPictures] = useState({ picture: [] });

  const pictureData = new FormData();
  pictures.picture.forEach((file) => pictureData.append("file", file));

  const LOCAL_URL = "http://localhost:3000";
  const PUBLIC_URL = "https://jk-automobile-9xtf.onrender.com";

  const url = location.hostname === "localhost" ? LOCAL_URL : PUBLIC_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // useEffect(() => {
  //   const fetchCars = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${url}/data/get-car-data/${idToPost}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       const [data] = response.data.result;
  //     } catch (err) {
  //       setError("Failed to fetch car data Try to Log in.");
  //       console.error("Error fetching car data:", err);
  //     }
  //   };
  //   fetchCars();
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const uploadResponse = await axios.post(
        `${url}/file/upload`,
        pictureData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFormData((prev) => ({
        ...prev,
        photo_of_the_module: uploadResponse.data.files[0].url,
        sticker_photo: uploadResponse.data.files[1].url,
      }));
      const postModuleResponse = await axios.post(
        `${url}/data/post-module-data`,
        {
          ...formData,
          photo_of_the_module: uploadResponse.data.files[0].url,
          sticker_photo: uploadResponse.data.files[1].url,
        },
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
        photo_of_the_module: "",
        sticker_photo: "",
        km_miles: "",
        engine_type: "",
        transmission: "",
        module_number: "",
      });
      alert(postModuleResponse.data.message);
      alert(response.data.message);
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
      photo_of_the_module: "",
      sticker_photo: "",
      km_miles: "",
      engine_type: "",
      transmission: "",
      module_number: "",
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

  console.log(formData);

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
              // value={pictures[0]}
              onChange={(e) =>
                setPictures((state) => ({
                  ...state,
                  picture: [...state.picture, e.target.files[0]],
                }))
              }
              placeholder="Photo of Module"
            />
            <Input
              type="file"
              accept=".png,.jpg,.jpeg,.svg,.webp,.avif"
              label="Sticker Photo"
              name="picture"
              // value={pictures[1]}
              onChange={(e) =>
                setPictures((state) => ({
                  ...state,
                  picture: [...state.picture, e.target.files[0]],
                }))
              }
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
              disabled
              type="file"
              accept=".zip,.bin,.rar"
              label="Bin File (Disabled)"
              name="bin_file"
              value={formData.bin_file}
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

          {/* Add fields for sticker_photo and notes if needed */}

          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-10">
            <button
              type="submit"
              className="flex-1 max-w-[150px] py-3 text-white font-semibold rounded-lg shadow-lg bg-linear-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 transition transform hover:scale-105"
            >
              Update
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
