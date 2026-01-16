import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const { token, logOut } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const LOCAL_URL = "http://localhost:3000";
  const PUBLIC_URL = "https://jk-automobile-9xtf.onrender.com";
  const url = location.hostname === "localhost" ? LOCAL_URL : PUBLIC_URL;

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get(`${url}/data/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
  }, [token, navigate, logOut, url]);

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
          <div className="bg-blue-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">
              Total Cars
            </h2>
            <p className="text-3xl font-bold text-blue-600">
              {dashboardData.totalCars}
            </p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-green-800 mb-2">
              Total Users
            </h2>
            <p className="text-3xl font-bold text-green-600">
              {dashboardData.totalUsers}
            </p>
          </div>
          <div className="bg-yellow-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">
              Total Transaction
            </h2>
            <p className="text-3xl font-bold text-yellow-600">
              {dashboardData.totalTransactions}
            </p>
          </div>
          <div className="bg-yellow-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">
              Overall Earning
            </h2>
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
