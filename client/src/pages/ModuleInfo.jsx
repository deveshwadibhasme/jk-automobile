import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

const ModuleInfo = () => {
  const [data, setData] = useState();
  const LOCAL_URL = "http://localhost:3000";
  const PUBLIC_URL = "https://jk-automobile-9xtf.onrender.com";

  const url = location.hostname === "localhost" ? LOCAL_URL : PUBLIC_URL;

  const id = location.pathname.split("/")[2];

  useEffect(() => {
    function fetchData() {
      axios.get(`${url}/data/get-module-data/${id}`).then((result) => {
        setData(result.data.result);
      });
    }
    fetchData();
  }, []);

  return (
    <div className="max-w-screen min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Link className="absolute top-10 right-10 bg-amber-950 p-2 text-amber-50" to={"/"}>Go Back</Link>
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
              <p className="text-gray-600 capitalize">{data[0]?.transmission}</p>
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
          </div>
        </div>
      ) : (
        <p className="text-gray-600 text-lg">Loading module information...</p>
      )}
    </div>
  );
};

export default ModuleInfo;
