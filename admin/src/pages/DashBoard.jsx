import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCar, FaUsers, FaExchangeAlt, FaWallet , FaTable,FaExternalLinkAlt } from "react-icons/fa";

const Dashboard = () => {
  const { token, logOut } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/1NoiFIZKxu6BvzQrfQ9nPK6CYnuMxJwg7U1hSHyZS6xA/edit?userstoinvite=tnmelectronicss8%40gmail.com&sharingaction=manageaccess&role=writer&gid=0#gid=0";
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get(
          `https://jkauto-backend.onthewifi.com/api/v1/admin/dashboard?includeDeleted=false`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        // Log the actual response structure to debug
        console.log("Dashboard API Response:", response.data);
        
        // Check if response has nested data structure
        let data;
        if (response.data.data) {
          data = response.data.data;
        } else {
          data = response.data;
        }
        
        setDashboardData(data);
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

 const handleSpreadsheetView = () => {
    window.open(SPREADSHEET_URL, "_blank", "noopener,noreferrer");
  };

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

  // Safe access with fallback values
  const totalCars = dashboardData.totalCars ?? dashboardData.total_cars ?? 0;
  const totalUsers = dashboardData.totalUsers ?? dashboardData.total_users ?? 0;
  const totalTransactions = dashboardData.totalTransactions ?? dashboardData.total_transactions ?? 0;
  const totalEarnings = dashboardData.overallEarning ?? dashboardData.totalEarnings ?? 0;
  const recentTransactions = dashboardData.recentTransactions || [];

  return (
    <div className="relative min-h-screen py-5 max-w-screen-2xl mx-auto bg-[#302e2e] overflow-hidden font-sans">
      
      <div className="relative bg-white/90 backdrop-blur-md p-1 rounded-xl shadow-xl w-full max-w-5xl ml-auto mr-10">
        <h1 className="text-3xl font-bold text-black-800 mb-6 text-center">
         JK Auto Admin Dashboard
        </h1>
         <p className="text-xs text-center text-red-500 mb-4 uppercase tracking-wider font-semibold">
            Powered by Resicode Solution
          </p>
        {/* Spreadsheet View Button */}
        <div className="p-3 flex justify-center">
  <button
    onClick={handleSpreadsheetView}
    className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-green-500/25 transition-all duration-300 flex items-center gap-3"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

    <FaTable className="w-5 h-5" />
    <span>TNM UPDATES Spreadsheet View</span>
    <FaExternalLinkAlt className="w-4 h-4 opacity-70 group-hover:opacity-100 transition" />
  </button>
</div>
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
                {totalCars}
              </p>
            </div>
          </div>
          <div className="bg-green-50 p-6 rounded-xl border border-green-100 shadow-sm flex items-center gap-5">
            <div className="p-4 bg-green-600 rounded-lg text-white">
              <FaUsers size={24} />
            </div>
            <div>
              <h2 className="text-sm font-medium text-green-800 uppercase tracking-wider">
                Active Users
              </h2>
              <p className="text-3xl font-bold text-gray-900">
                {totalUsers}
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
                {totalTransactions}
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
              <p className="text-3xl font-bold text-yellow-600 ml-4">
                {typeof totalEarnings === 'number' ? totalEarnings.toLocaleString("en-IN") : totalEarnings} Rs
              </p>
            </div>
            
          </div>
        </div>
        {/* total */}
        <div>
          <div className="w-full mt-6">
  <h2 className="text-xl font-bold text-gray-800 mb-4">
    Recent Transactions
  </h2>

  <div className="overflow-x-auto rounded-xl border border-gray-200">
    <table className="w-full text-sm text-left">
      <thead className="bg-gray-100 text-gray-700 uppercase">
        <tr>
          <th className="px-6 py-4">Order ID</th>
          <th className="px-6 py-4">Amount</th>
          <th className="px-6 py-4">Date</th>
        </tr>
      </thead>

      <tbody>
        {recentTransactions.length > 0 ? (
          recentTransactions.map((transaction) => (
            <tr
              key={transaction.id}
              className="border-t hover:bg-gray-50 transition"
            >
              <td className="px-6 py-4 font-medium text-gray-800">
                {transaction.orderId}
              </td>

              <td className="px-6 py-4 text-green-600 font-semibold">
                ₹ {Number(transaction.price).toLocaleString("en-IN")}
              </td>

              <td className="px-6 py-4 text-gray-600">
                {new Date(transaction.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="3"
              className="text-center py-6 text-gray-500"
            >
              No recent transactions found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>
          </div>
          {/* end */}
      </div>
    </div>
  );
};

export default Dashboard;