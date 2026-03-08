import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { FaCar, FaUsers, FaExchangeAlt, FaWallet } from "react-icons/fa";

const Dashboard = () => {
  const { token, logOut } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get(
          `${API_BASE_URL}/data/admin/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDashboardData(response.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(
          "Failed to fetch dashboard data. Please try logging in again."
        );
        if (err.response && err.response.status === 401) {
          logOut();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, navigate, logOut]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#302e2e] text-white">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#302e2e] text-red-500">
        {error}
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#302e2e] text-white">
        No dashboard data available.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-5 max-w-screen-2xl mx-auto bg-[#302e2e] overflow-hidden font-sans">
      <div className="relative bg-white/90 backdrop-blur-md p-5 rounded-xl shadow-xl w-full max-w-5xl ml-auto mr-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Admin Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm flex items-center gap-5">
            <div className="p-4 bg-blue-600 rounded-lg text-white">
              <FaCar size={24} />
            </div>
            <div>
              <h2 className="text-sm font-medium text-blue-800 uppercase tracking-wider">
                Total Cars
              </h2>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData.totalCars}
              </p>
            </div>
          </div>
          <div className="bg-green-50 p-6 rounded-xl border border-green-100 shadow-sm flex items-center gap-5">
            <div className="p-4 bg-green-600 rounded-lg text-white">
              <FaUsers size={24} />
            </div>
            <div>
              <h2 className="text-sm font-medium text-green-800 uppercase tracking-wider">
                Total Users
              </h2>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData.totalUsers}
              </p>
            </div>
          </div>
          <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm flex items-center gap-5">
            <div className="p-4 bg-purple-600 rounded-lg text-white">
              <FaExchangeAlt size={24} />
            </div>
            <div>
              <h2 className="text-sm font-medium text-purple-800 uppercase tracking-wider">
                Transactions
              </h2>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData.totalTransactions}
              </p>
            </div>
          </div>
          <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 shadow-sm flex items-center gap-5 lg:col-span-3">
            <div className="p-4 bg-amber-600 rounded-lg text-white">
              <FaWallet size={24} />
            </div>
            <div>
              <h2 className="text-sm font-medium text-amber-800 uppercase tracking-wider">
                Overall Earning
              </h2>
            </div>
            <p className="text-3xl font-bold text-yellow-600">
              {dashboardData.overallEarning.toLocaleString("en-IN")} Rs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
