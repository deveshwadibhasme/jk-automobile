import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/data/get-car-data"
        );
        setCars(response.data.result);
      } catch (err) {
        setError("Failed to fetch car data.");
        console.error("Error fetching car data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) {
    return <div>Loading cars...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Car List</h2>
      <Link
        className="flex-1 inline-block max-w-[150px] text-center mb-5 w-full py-3 text-gray-800 font-semibold rounded-lg shadow-lg bg-transparent border-2 border-gray-400 hover:bg-gray-100 transition transform hover:scale-105"
        to={"/"}
      >
        Go Back
      </Link>
      {cars.length === 0 ? (
        <p className="text-gray-600">No cars found.</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                Brand
              </th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                Model
              </th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                File Type
              </th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {cars?.map((car) => (
              <tr
                key={car.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                {" "}
                {/* Assuming each car has a unique 'id' */}
                <td className="py-3 px-4">{car.brand}</td>
                <td className="py-3 px-4">{car.model}</td>
                <td className="py-3 px-4">{car.file_type}</td>
                <td className="py-3 px-4">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs mr-2">
                    Edit
                  </button>
                  <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CarList;
