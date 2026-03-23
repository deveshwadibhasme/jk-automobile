import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { API_BASE_URL } from "../config/api";
import { FaEdit, FaTrash, FaCar, FaSearch } from "react-icons/fa";

const VehicleList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const allowDelete = window.confirm("Delete this car record?");
    if (!allowDelete) {
      return;
    }

    try {
      await axios.delete(
        `https://jk-automobile-9xtf.onrender.com/data/delete-car-data/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCars((prev) => prev.filter((car) => car.id !== id));
    } catch (err) {
      alert("Failed to delete record. Please try again.");
      console.error("Error deleting car data:", err);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchCars = async () => {
      try {
        const response = await axios.get(
          `https://jk-automobile-9xtf.onrender.com/data/get-car-data/id/1/100`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCars(response.data.result);
      } catch (err) {
        setError("Failed to fetch car data. Please login again.");
        console.error("Error fetching car data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [token, navigate]);

  const filteredCars = cars.filter((car) =>
    `${car.brand} ${car.model} ${car.file_type}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#302e2e] text-white">
        <div className="animate-pulse">Loading vehicle database...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-5 max-w-screen-2xl mx-auto bg-[#302e2e] overflow-hidden font-sans">
      <div className="relative bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-xl w-full max-w-5xl ml-auto mr-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaCar className="text-blue-600" />
            Vehicle Inventory
          </h2>

          <div className="relative w-full md:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search vehicles..."
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full text-left border-collapse bg-white">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider">
                  Brand
                </th>
                <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider">
                  Model
                </th>
                <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider">
                  File Type
                </th>
                <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCars.length > 0 ? (
                filteredCars.map((car) => (
                  <tr
                    key={car.id}
                    className="hover:bg-blue-50/50 transition-colors group"
                  >
                    <td className="py-4 px-6 font-medium text-gray-800">
                      {car.brand}
                    </td>
                    <td className="py-4 px-6 text-gray-600">{car.model}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                        {car.file_type}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-3">
                        <Link
                          to={`/edit-form/${car.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit Vehicle"
                        >
                          <FaEdit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(car.id)}
                          className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete Vehicle"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-gray-500">
                    {searchTerm
                      ? "No matching vehicles found."
                      : "No vehicles in inventory."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-sm text-gray-500 italic">
          Showing {filteredCars.length} of {cars.length} total records
        </div>
      </div>
    </div>
  );
};

export default VehicleList;
