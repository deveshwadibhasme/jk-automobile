import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import PaymentButton from "../components/PaymentButton";

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

  return (
    <div className="max-w-screen min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {data ? (
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden max-w-4xl w-full border border-gray-200 relative">
          <div className="bg-gray-900 p-6 text-white">
            <h2 className="text-xl font-semibold tracking-tight">
              Module Details
              <Link
                className="absolute text-sm top-7 right-10 bg-white p-2 text-black rounded-2xl"
                to={"/"}
              >
                Go Back
              </Link>
            </h2>
            <p className="text-gray-400 text-sm">Technical Specifications</p>
          </div>

          <div className="p-6 space-y-4">
            {[
              { label: "Module Type", value: data[0]?.module_type },
              { label: "KM/Miles", value: data[0]?.km_miles },
              { label: "Engine Type", value: data[0]?.engine_type },
              { label: "Transmission", value: data[0]?.transmission },
              { label: "Module Number", value: data[0]?.module_number },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border-b border-gray-100 pb-2"
              >
                <span className="text-gray-500 font-medium">{item.label}</span>
                <span className="text-gray-900 font-semibold capitalize">
                  {item.value || "N/A"}
                </span>
              </div>
            ))}

            <div className="space-y-6 pt-4 flex justify-evenly">
              {data[0]?.module_photo && (
                <div className="space-y-2">
                  <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Module Photo
                  </p>
                  <img
                    className="w-full h-48 object-cover rounded-xl border border-gray-200"
                    src={data[0]?.module_photo}
                    alt="Module"
                  />
                </div>
              )}
              {data[0]?.sticker_photo && (
                <div className="space-y-2">
                  <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Sticker Photo
                  </p>
                  <img
                    className="w-full h-48 object-cover rounded-xl border border-gray-200"
                    src={data[0]?.sticker_photo}
                    alt="Sticker"
                  />
                </div>
              )}
            </div>

            {fileData?.length > 0 && (
              <div className="mt-8 p-5 bg-gray-50 rounded-2xl border border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-widest">
                  Downloadable File
                </h3>
                <div className="space-y-1 mb-4">
                  <p className="text-sm text-gray-600 truncate">
                    <span className="font-medium">Name:</span>{" "}
                    {fileData[0]?.file_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Size:</span>{" "}
                    {fileData[0]?.archive_size / 1000} KB
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-lg font-bold text-green-700">
                    ₹{fileData[0]?.file_price}
                  </span>
                  <PaymentButton module_id={fileData[0]?.id} />
                </div>
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
