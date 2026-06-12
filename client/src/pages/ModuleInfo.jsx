import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import PaymentButton from "../components/PaymentButton";

const ModuleInfo = () => {
  const [data, setData] = useState(null);
  const [carInfo, setCarInfo] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [modulePhoto, setModulePhoto] = useState(null);
  const [stickerPhoto, setStickerPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      if (!id) {
        setError("No module ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const carResponse = await axios.get(
          `https://jkauto-backend.onthewifi.com/api/v1/data/get-car-data/${id}?includeDeleted=false`
        );
        
        console.log("Car Data Response:", carResponse.data);
        
        const responseData = carResponse.data.data;

        // Get car info
        if (responseData.carInfos && responseData.carInfos.length > 0) {
          const carInfoData = responseData.carInfos[0];
          setCarInfo(carInfoData);
          console.log("Car Info:", carInfoData.price);
        }

        
        // Get file stores (binary file)
        if (responseData.fileStores && responseData.fileStores.length > 0) {
          setFileData(responseData.fileStores[0]);
          console.log("File Store:", responseData.fileStores[0]);
        }
        
        // Separate module photo and sticker photo from imgStores
        // Assuming first image is module photo, second is sticker photo
        // Or you can add logic based on image characteristics
        if (responseData.imgStores && responseData.imgStores.length > 0) {
          // Option 1: First image as module photo, second as sticker photo (if exists)
          if (responseData.imgStores[0]) {
            setModulePhoto(responseData.imgStores[0].fileUrl);
          }
          if (responseData.imgStores[1]) {
            setStickerPhoto(responseData.imgStores[1].fileUrl);
          }
          
          // Option 2: If you want to use specific images based on filename/URL patterns
          // You can add logic here to identify which image is which
          console.log("Module Photo URL:", responseData.imgStores[0]?.fileUrl);
          console.log("Sticker Photo URL:", responseData.imgStores[1]?.fileUrl);
        }
        
        setData(responseData);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || err.message || "Failed to fetch module information");
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-screen min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-gray-600 text-lg mt-4">Loading module information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-screen min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden max-w-4xl w-full border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-4">⚠️ Error</div>
            <p className="text-gray-600">{error}</p>
            <Link
              to="/"
              className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Go Back Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!carInfo) {
    return (
      <div className="max-w-screen min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden max-w-4xl w-full border border-gray-200 p-6">
          <p className="text-gray-600 text-lg">No module information found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden max-w-5xl w-full mx-auto border border-gray-200 relative">
        <div className="bg-gray-900 p-6 text-white">
          <h2 className="text-xl font-semibold tracking-tight">
            Module Details
            <Link
              className="absolute text-sm top-7 right-10 bg-white p-2 text-black rounded-2xl hover:bg-gray-100 transition"
              to={"/"}
            >
              Go Back
            </Link>
          </h2>
          <p className="text-gray-400 text-sm">Technical Specifications</p>
        </div>

        <div className="p-6">
  {/* Module Specifications */}
  <div className="p-4">
  {/* Specifications Card */}
  <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
    
    {/* Header */}
    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
      <h3 className="text-base font-semibold text-gray-800">
        Specifications
      </h3>

      <div className="w-10 h-1 rounded-full bg-blue-600"></div>
    </div>

    {/* Content */}
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
      {[
        { label: "Module Type", value: carInfo.moduleType },
        { label: "KM / Miles", value: carInfo.kmMiles },
        { label: "Engine Type", value: carInfo.engineType },
        { label: "Transmission", value: carInfo.transmission },
        { label: "Module Number", value: carInfo.moduleNumber },
        { label: "Block Number", value: data.blockNumber },
        { label: "File Type", value: data.fileType },
        { label: "Notes", value: carInfo.notes },
        {
          label: "Price",
          value: carInfo.price ? `₹${carInfo.price}` : null,
        },
      ].map(
        (item, idx) =>
          item.value &&
          item.value !== "null" &&
          item.value !== "" && (
            <div
              key={idx}
              className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200"
            >
              {/* Label */}
              <span className="text-xs font-medium text-gray-800 bg-yellow-300 p-1 rounded">
                {item.label}
              </span>

              {/* Value */}
              <span className="text-sm font-semibold text-gray-800 text-right capitalize">
                {item.value}
              </span>
            </div>
          )
      )}
    </div>
  </div>
</div>

          {/* Module Photo and Sticker Photo - Side by Side */}
          {(modulePhoto || stickerPhoto || carInfo.modulePhoto || carInfo.stickerPhoto) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Module Photo */}
                {(modulePhoto || carInfo.modulePhoto) && (
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-gray-700 uppercase tracking-wider text-center">
                      Module Photo
                    </p>
                    <div className="relative group">
                      <img
                        className="w-full h-80 object-contain rounded-xl border border-gray-200 shadow-md bg-gray-50"
                        src={modulePhoto || carInfo.modulePhoto}
                        alt="Module"
                      />
                      <button
                        onClick={() => window.open(modulePhoto || carInfo.modulePhoto, '_blank')}
                        className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs hover:bg-opacity-75 transition"
                      >
                        View Full Size
                      </button>
                    </div>
                  </div>
                )}

                {/* Sticker Photo */}
                {(stickerPhoto || carInfo.stickerPhoto) && (
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-gray-700 uppercase tracking-wider text-center">
                      Sticker Photo
                    </p>
                    <div className="relative group">
                      <img
                        className="w-full h-80 object-contain rounded-xl border border-gray-200 shadow-md bg-gray-50"
                        src={stickerPhoto || carInfo.stickerPhoto}
                        alt="Sticker"
                        
                      />
                      <button
                        onClick={() => window.open(stickerPhoto || carInfo.stickerPhoto, '_blank')}
                        className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs hover:bg-opacity-75 transition"
                      >
                        View Full Size
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Downloadable File Section */}
          {fileData && (
            <div className="mt-8 p-5 bg-gradient-to-r from-blue-50 to-gray-50 rounded-2xl border border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Downloadable File
              </h3>
              <div className="space-y-2 mb-4">
                <div className="flex flex-col md:flex-row md:items-start md:space-x-2">
                  <span className="font-medium text-gray-700 min-w-[100px]">File Name:</span>
                  <span className="text-gray-600 break-all">{fileData.fileName || "N/A"}</span>
                </div>
                {fileData.archiveSize && (
  <div className="flex flex-col md:flex-row md:items-center md:space-x-2">
    <span className="font-medium text-gray-700 min-w-[100px]">File Size:</span>
    <span className="text-gray-600">
      {fileData.archiveSize}  {/* Direct display - already formatted as "1.2 MB" */}
    </span>
  </div>
)}
                {fileData.fileId && (
                  <div className="flex flex-col md:flex-row md:items-start md:space-x-2">
                    <span className="font-medium text-gray-700 min-w-[100px]">File ID:</span>
                    <span className="text-gray-600 text-sm break-all">{fileData.fileId}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-blue-200">
                <div>
                  <span className="text-sm text-gray-600">Price:</span>
                  <span className="text-2xl font-bold text-green-700 ml-2">
                    ₹{carInfo.price || fileData.filePrice}
                  </span>
                </div>
                <PaymentButton module_id={fileData.id} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleInfo;