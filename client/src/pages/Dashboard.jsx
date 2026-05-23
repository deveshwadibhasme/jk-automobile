import React, { useState, useMemo, useEffect } from "react";
import Header from "../components/layout/Header";
import axios from "axios";
import { Link } from "react-router-dom";
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  Database, 
  Tag, 
  Calendar, 
  Cpu,
  FileText,
  ExternalLink,
  Layers,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Car,
  Gauge,
  HardDrive
} from "lucide-react";

const FirmwareTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const LOCAL_URL = "http://localhost:3000";
  const PUBLIC_URL = "https://jk-backend.onthewifi.com";

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    function fetchData() {
      axios
        .get(
          `https://jk-backend.onthewifi.com/api/v1/data/get-car-data/1/100`
        )
        .then((result) => {
          setData(result.data.data.result);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    }
    fetchData();
  }, []);

  const [tempFilters, setTempFilters] = useState({
    search: "",
    brand: "All Brands",
    year: "All Years",
    module: "All Modules",
    fileType: "All File Types",
  });

  const [appliedFilters, setAppliedFilters] = useState({ ...tempFilters });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters]);

  // Safely get unique values from data
  const brands = useMemo(() => ["All Brands", ...new Set(data?.map((x) => x?.brand) || [])], [data]);
  const years = useMemo(() => ["All Years", ...new Set(data?.map((x) => x?.year?.toString()) || [])], [data]);
  const modules = useMemo(() => ["All Modules", ...new Set(data?.map((x) => x?.module) || [])], [data]);
  const fileTypes = useMemo(() => ["All File Types", ...new Set(data?.map((x) => x?.file_type) || [])], [data]);

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.filter((item) => {
      const matchesSearch =
        appliedFilters.search === "" ||
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(appliedFilters.search.toLowerCase());

      const matchesBrand =
        appliedFilters.brand === "All Brands" ||
        appliedFilters.brand === item.brand;
      const matchesYear =
        appliedFilters.year === "All Years" || appliedFilters.year == item.year;
      const matchesModule =
        appliedFilters.module === "All Modules" ||
        appliedFilters.module === item.module;
      const matchesFile =
        appliedFilters.fileType === "All File Types" ||
        appliedFilters.fileType === item.file_type;

      return (
        matchesSearch &&
        matchesBrand &&
        matchesYear &&
        matchesModule &&
        matchesFile
      );
    });
  }, [data, appliedFilters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...tempFilters });
    setIsFilterOpen(false);
  };

  const handleReset = () => {
    const resetState = {
      search: "",
      brand: "All Brands",
      year: "All Years",
      module: "All Modules",
      fileType: "All File Types",
    };
    setAppliedFilters(resetState);
    setTempFilters(resetState);
    setIsFilterOpen(false);
  };

  const badgeColor = (type) => {
    const map = {
      eeprom: "bg-emerald-100 text-emerald-800 border-emerald-200",
      flash: "bg-amber-100 text-amber-800 border-amber-200",
      full: "bg-indigo-100 text-indigo-800 border-indigo-200",
      chrome: "bg-rose-100 text-rose-800 border-rose-200",
    };
    return map[type?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (appliedFilters.brand !== "All Brands") count++;
    if (appliedFilters.year !== "All Years") count++;
    if (appliedFilters.module !== "All Modules") count++;
    if (appliedFilters.fileType !== "All File Types") count++;
    return count;
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-gray-800">
        {/* Automotive-inspired Background Pattern */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
          </div>
        </div>

        <div className="relative max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
          {/* Enhanced Header Section with Automotive Theme */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-1xl md:text-3xl font-bold from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent" style={{color:"white"}}>
                    JK AUTO ELECTRONIC WORKS (NAGPUR)
                  </h1>
                </div>
                <p className="text-gray-400 mt-2 flex items-center gap-2 ml-1">
                  <HardDrive className="w-4 h-4" />
                  <span>{filteredData?.length || 0} of {data?.length || 0} firmware entries available</span>
                </p>
              </div>
              
              {/* Stats Cards - Automotive Style */}
              <div className="flex gap-3">
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl px-4 py-2 md:px-5 md:py-3 shadow-lg border border-gray-700/50">
                  <div className="text-xs md:text-sm text-gray-400">Brands</div>
                  <div className="text-xl md:text-2xl font-bold text-blue-400">{Math.max(0, brands.length - 1)}</div>
                </div>
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl px-4 py-2 md:px-5 md:py-3 shadow-lg border border-gray-700/50">
                  <div className="text-xs md:text-sm text-gray-400">Firmware</div>
                  <div className="text-xl md:text-2xl font-bold text-indigo-400">{data?.length || 0}</div>
                </div>
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl px-4 py-2 md:px-5 md:py-3 shadow-lg border border-gray-700/50">
                  <div className="text-xs md:text-sm text-gray-400">Modules</div>
                  <div className="text-xl md:text-2xl font-bold text-purple-400">{Math.max(0, modules.length - 1)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar - Automotive Dashboard Style */}
          <div className="mb-6">
            <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700/50 p-4 transition-all duration-300">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 transition-colors group-focus-within:text-blue-400" />
                  <input
                    type="text"
                    value={tempFilters.search}
                    onChange={(e) =>
                      setTempFilters({ ...tempFilters, search: e.target.value })
                    }
                    onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
                    placeholder="Search by brand, model, module, or block number..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-200 placeholder-gray-500"
                  />
                </div>

                {/* Filter Toggle Button */}
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    isFilterOpen || getActiveFilterCount() > 0
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Filter className="w-5 h-5" />
                  Filters
                  {getActiveFilterCount() > 0 && (
                    <span className="ml-1 bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs font-bold">
                      {getActiveFilterCount()}
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleApplyFilters}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Apply
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-gray-700 text-gray-300 rounded-xl font-medium hover:bg-gray-600 transition-all shadow-md"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Expandable Filters Panel */}
              <div className={`transition-all duration-300 overflow-hidden ${isFilterOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                <div className="pt-4 border-t border-gray-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { key: "brand", label: "Brand", icon: Tag, options: brands },
                      { key: "year", label: "Year", icon: Calendar, options: years },
                      { key: "module", label: "Module", icon: Cpu, options: modules },
                      { key: "fileType", label: "File Type", icon: FileText, options: fileTypes },
                    ].map(({ key, label, icon: Icon, options }) => (
                      <div key={key} className="relative">
                        <label className="block text-xs font-medium text-gray-400 mb-1 ml-1">{label}</label>
                        <select
                          value={tempFilters[key]}
                          onChange={(e) =>
                            setTempFilters({ ...tempFilters, [key]: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer text-gray-200"
                        >
                          {options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        <Icon className="absolute right-3 top-8 w-4 h-4 text-gray-500 pointer-events-none" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Filters Display */}
              {getActiveFilterCount() > 0 && !isFilterOpen && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-700">
                  {appliedFilters.brand !== "All Brands" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-900/50 text-blue-300 rounded-full text-xs border border-blue-700">
                      Brand: {appliedFilters.brand}
                      <button onClick={() => setAppliedFilters({ ...appliedFilters, brand: "All Brands" })}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {appliedFilters.year !== "All Years" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-900/50 text-indigo-300 rounded-full text-xs border border-indigo-700">
                      Year: {appliedFilters.year}
                      <button onClick={() => setAppliedFilters({ ...appliedFilters, year: "All Years" })}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {appliedFilters.module !== "All Modules" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-900/50 text-purple-300 rounded-full text-xs border border-purple-700">
                      Module: {appliedFilters.module}
                      <button onClick={() => setAppliedFilters({ ...appliedFilters, module: "All Modules" })}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {appliedFilters.fileType !== "All File Types" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-rose-900/50 text-rose-300 rounded-full text-xs border border-rose-700">
                      File: {appliedFilters.fileType}
                      <button onClick={() => setAppliedFilters({ ...appliedFilters, fileType: "All File Types" })}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Gauge className="w-6 h-6 text-blue-500 animate-pulse" />
                </div>
              </div>
              <p className="mt-4 text-gray-400 font-medium">Loading firmware data...</p>
            </div>
          )}

          {/* Table View */}
          {!loading && (
            <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700/50 overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
                      {[
                        { label: "Sr. No", icon: Layers },
                        { label: "Brand", icon: Tag },
                        { label: "Model", icon: Database },
                        { label: "Year", icon: Calendar },
                        { label: "Module", icon: Cpu },
                        { label: "Block Number", icon: FileText },
                        { label: "File Type", icon: CheckCircle },
                      ].map(({ label, icon: Icon }) => (
                        <th
                          key={label}
                          className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-gray-300"
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
                            {label}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems?.map((item, i) => (
                      <tr
                        key={item.id || i}
                        className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-all duration-200 group"
                      >
                        <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-bold text-blue-400">
                          #{startIndex + i + 1}
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <span className="capitalize font-medium text-gray-200">{item.brand}</span>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-300 font-medium">{item.model}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <span className="px-2 py-1 bg-gray-700 rounded-lg text-xs md:text-sm font-mono text-gray-300">{item.year}</span>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <div className="flex items-center gap-1">
                            <Cpu className="w-3 h-3 text-gray-500" />
                            <span className="text-xs md:text-sm text-gray-300">{item.module}</span>
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <div className="space-y-1">
                            {item.blockNumber?.split("\n").slice(0, 2).map((line, idx) => (
                              <code key={idx} className="text-[10px] md:text-xs bg-gray-900 px-1 md:px-2 py-0.5 md:py-1 rounded block font-mono text-gray-400">
                                {line.length > 30 ? line.substring(0, 30) + "..." : line}
                              </code>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <Link
                            to={`/module-info/${item.id}`}
                            state={item.block_number}
                            className={`inline-flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-semibold border shadow-sm transition-all hover:scale-105 ${badgeColor(
                              item.fileType || item.file_type
                            )}`}
                          >
                            {item.fileType || item.file_type}
                            <ExternalLink className="w-2.5 h-2.5 md:w-3 md:h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {filteredData?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <Database className="w-12 h-12 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">No results found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search term</p>
                  <button
                    onClick={handleReset}
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {/* Pagination Footer */}
              {filteredData?.length > 0 && (
                <div className="px-4 md:px-6 py-4 bg-gray-900/50 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-4">
                    <span>Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries</span>
                    {filteredData.length !== data.length && (
                      <span className="text-blue-400 text-xs md:text-sm">
                        ({data.length - filteredData.length} filtered out)
                      </span>
                    )}
                  </div>
                  
                  {/* Pagination Controls */}
                  <div className="flex items-center gap-1 md:gap-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-2 md:px-3 py-1 rounded-lg bg-gray-700 border border-gray-600 hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-300"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    {/* Page numbers for desktop */}
                    <div className="hidden sm:flex gap-1 md:gap-2">
                      {getPageNumbers().map((page) => (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-2 md:px-4 py-1 rounded-lg transition-all ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                              : 'bg-gray-700 border border-gray-600 hover:bg-gray-600 text-gray-300'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    {/* Mobile page indicator */}
                    <span className="sm:hidden px-3 py-1 rounded-lg bg-gray-700 text-gray-200">
                      Page {currentPage} of {totalPages}
                    </span>
                    
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-2 md:px-3 py-1 rounded-lg bg-gray-700 border border-gray-600 hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-300"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
};

export default FirmwareTable;