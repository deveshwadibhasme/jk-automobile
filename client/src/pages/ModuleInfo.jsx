import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

const ModuleInfo = () => {
  const [data, setData] = useState();
  const [fileData, setFileData] = useState();
  const LOCAL_URL = "http://localhost:3000";
  const PUBLIC_URL = "https://jk-automobile-9xtf.onrender.com";

  const url = location.hostname === "localhost" ? LOCAL_URL : PUBLIC_URL;

  const id = location.pathname.split("/")[2];

  useEffect(() => {
    function fetchData() {
      axios.get(`${url}/data/get-module-data/${id}`).then((result) => {
        setData(result.data.result);
      });
      axios.get(`${url}/bin/get-file-data/${id}`).then((result) => {
        setFileData(result.data.result);
      });
    }
    fetchData();
  }, []);

  console.log(fileData);

  return (
    <div className="max-w-screen min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Link
        className="absolute top-10 right-10 bg-amber-950 p-2 text-amber-50"
        to={"/"}
      >
        Go Back
      </Link>
      {data ? (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl w-full">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Module Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="font-semibold text-gray-700">Module Type:</p>
              <p className="text-gray-600 capitalize">{data[0]?.module_type}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">KM/Miles:</p>
              <p className="text-gray-600">{data[0]?.km_miles}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Engine Type:</p>
              <p className="text-gray-600 capitalize">{data[0]?.engine_type}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Transmission:</p>
              <p className="text-gray-600 capitalize">
                {data[0]?.transmission}
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Module Number:</p>
              <p className="text-gray-600">{data[0]?.module_number}</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            {data[0].module_photo && (
              <div className="flex flex-col items-center">
                <p className="font-semibold text-gray-700 mb-2">
                  Module Photo:
                </p>
                <img
                  className="w-64 h-64 object-contain border rounded-md shadow-sm"
                  src={data[0]?.module_photo}
                  alt="Module"
                />
              </div>
            )}
            {data[0].sticker_photo && (
              <div className="flex flex-col items-center">
                <p className="font-semibold text-gray-700 mb-2">
                  Sticker Photo:
                </p>
                <img
                  className="w-64 h-64 object-contain border rounded-md shadow-sm"
                  src={data[0]?.sticker_photo}
                  alt="Sticker"
                />
              </div>
            )}
            {fileData[0] && (
              <div className="flex flex-col items-center text-center">
                <p className="font-semibold text-gray-700 mb-2">
                  File Information:
                </p>
                <p className="text-gray-600">
                  File Name: {fileData[0]?.file_name}
                </p>
                <p className="text-gray-600">
                  File Size: {fileData[0]?.archive_size / 1000} KB
                </p>
                <p className="rounded-xl p-1 my-1 px-3 bg-green-800 text-white">
                  File Price: Rs {fileData[0]?.file_price}
                </p>
                <button 
                  className="mt-4 px-6 py-2 rounded-md text-white bg-linear-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105"
                  onClick={() => alert("Payment functionality to be implemented with user login! under Development")}
                >
                  Pay Now
                </button>
                  {/* Add a pay button here, interactive only when user is logged in */}
                  {/* You'll need to implement user authentication and state management for login */}
                  {/* For demonstration, let's assume `isLoggedIn` is a state variable */}
                  {/* <button
                    className={`mt-4 px-6 py-2 rounded-md text-white ${
                      isLoggedIn
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!isLoggedIn}
                    onClick={() => alert("Proceeding to payment!")}
                  >
                    Pay Now
                  </button> */}
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-600 text-lg">Loading module information...</p>
      )}
    </div>
  );
};

export default ModuleInfo;
