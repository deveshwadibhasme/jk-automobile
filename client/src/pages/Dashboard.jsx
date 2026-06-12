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
  HardDrive,
  Sparkles,
  TrendingUp,
  Award,
  Clock,
  Download,
  Eye,
  Zap,
  Shield,
  Info,
  BarChart3,
  Copy,
  Trash2,
  Share2,
  Bookmark
} from "lucide-react";

const FirmwareTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // table or card
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedRows, setSelectedRows] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showStatsInsight, setShowStatsInsight] = useState(false);
  const [showBulkBar, setShowBulkBar] = useState(false);
  const LOCAL_URL = "http://localhost:3000";
  const PUBLIC_URL = "https://jkauto-backend.onthewifi.com";

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    function fetchData() {
      axios
        .get(
          `https://jkauto-backend.onthewifi.com/api/v1/data/get-car-data/1/100`
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
  const [isStatsHovered, setIsStatsHovered] = useState(false);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters]);

  // Show bulk action bar when rows are selected
  useEffect(() => {
    setShowBulkBar(selectedRows.length > 0);
  }, [selectedRows]);

  // Safely get unique values from data
  const brands = useMemo(() => ["All Brands", ...new Set(data?.map((x) => x?.brand) || [])], [data]);
  const years = useMemo(() => ["All Years", ...new Set(data?.map((x) => x?.year?.toString()) || [])], [data]);
  const modules = useMemo(() => ["All Modules", ...new Set(data?.map((x) => x?.module) || [])], [data]);
  const fileTypes = useMemo(() => ["All File Types", ...new Set(data?.map((x) => x?.fileType) || [])], [data]);

  // Sorting function
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    let filtered = data.filter((item) => {
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
        appliedFilters.fileType === item.fileType;

      return (
        matchesSearch &&
        matchesBrand &&
        matchesYear &&
        matchesModule &&
        matchesFile
      );
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key] || "";
        let bVal = b[sortConfig.key] || "";
        if (sortConfig.key === "year") {
          aVal = parseInt(aVal) || 0;
          bVal = parseInt(bVal) || 0;
        }
        if (sortConfig.direction === "asc") {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [data, appliedFilters, sortConfig]);

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
    setSortConfig({ key: null, direction: "asc" });
    setSelectedRows([]);
  };

  // Handle row selection
  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === currentItems.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentItems.map((item) => item.id));
    }
  };

  // Export functionality
  const handleExport = (format) => {
    const exportData = filteredData.map((item, idx) => ({
      "Sr. No": idx + 1,
      Brand: item.brand,
      Model: item.model,
      Year: item.year,
      Module: item.module,
      "Block Number": item.blockNumber,
      "File Type": item.fileType || item.file_type,
    }));

    if (format === "csv") {
      const headers = Object.keys(exportData[0]);
      const csvRows = [
        headers.join(","),
        ...exportData.map((row) =>
          headers.map((header) => JSON.stringify(row[header] || "")).join(",")
        ),
      ];
      const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "firmware_data.csv";
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === "json") {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "firmware_data.json";
      a.click();
      URL.revokeObjectURL(url);
    }
    setShowExportModal(false);
  };

  // Bulk Actions
  const handleBulkCopy = () => {
    const selectedData = selectedRows.map(id => {
      const item = filteredData.find(d => d.id === id);
      return `${item.brand} ${item.model} - ${item.module} (${item.year})`;
    }).join("\n");
    navigator.clipboard.writeText(selectedData);
    alert(`📋 Copied ${selectedRows.length} entries to clipboard!`);
  };

  const handleBulkBookmark = () => {
    const bookmarks = selectedRows.map(id => {
      const item = filteredData.find(d => d.id === id);
      return { id: item.id, brand: item.brand, model: item.model, module: item.module };
    });
    localStorage.setItem('firmwareBookmarks', JSON.stringify(bookmarks));
    alert(`🔖 Bookmarked ${selectedRows.length} entries!`);
  };

  const handleBulkShare = () => {
    const shareText = selectedRows.map(id => {
      const item = filteredData.find(d => d.id === id);
      return `${item.brand} ${item.model} (${item.year}) - ${item.module}`;
    }).join("\n");
    if (navigator.share) {
      navigator.share({ title: 'Firmware Data', text: shareText });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Share link copied to clipboard!');
    }
  };

  // NEW FEATURE 1: Quick Stats Insights Panel
  const getStatsInsights = () => {
    const brandCounts = {};
    const moduleCounts = {};
    const yearDistribution = {};
    
    filteredData.forEach(item => {
      brandCounts[item.brand] = (brandCounts[item.brand] || 0) + 1;
      moduleCounts[item.module] = (moduleCounts[item.module] || 0) + 1;
      yearDistribution[item.year] = (yearDistribution[item.year] || 0) + 1;
    });
    
    const topBrand = Object.entries(brandCounts).sort((a,b) => b[1] - a[1])[0];
    const topModule = Object.entries(moduleCounts).sort((a,b) => b[1] - a[1])[0];
    const mostCommonYear = Object.entries(yearDistribution).sort((a,b) => b[1] - a[1])[0];
    
    return { topBrand, topModule, mostCommonYear, brandCounts, moduleCounts };
  };

  const statsInsights = getStatsInsights();

  const badgeColor = (type) => {
    const map = {
      eeprom: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20",
      flash: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20",
      full: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20",
      chrome: "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/20",
    };
    return map[type?.toLowerCase()] || "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (appliedFilters.brand !== "All Brands") count++;
    if (appliedFilters.year !== "All Years") count++;
    if (appliedFilters.module !== "All Modules") count++;
    if (appliedFilters.fileType !== "All File Types") count++;
    return count;
  };

  // Stats with animations
  const stats = [
    { label: "Total Data", value: data?.length || 0, icon: Database, color: "from-blue-500 to-cyan-500", delay: 0 },
    { label: "Brands", value: Math.max(0, brands.length - 1), icon: Tag, color: "from-purple-500 to-pink-500", delay: 0.1 },
    { label: "Modules", value: Math.max(0, modules.length - 1), icon: Cpu, color: "from-emerald-500 to-teal-500", delay: 0.2 },
    { label: "File Types", value: Math.max(0, fileTypes.length - 1), icon: FileText, color: "from-orange-500 to-amber-500", delay: 0.3 },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-800">
        {/* Animated Background Pattern */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-1/2 -right-1/2 w-[40rem] h-[40rem] bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-1/2 -left-1/2 w-[40rem] h-[40rem] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse [animation-delay:2s]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse [animation-delay:4s]"></div>
        </div>

        <div className="relative max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
          {/* Enhanced Header Section with Automotive Theme */}
          <div className="mb-8 animate-fadeInDown">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r text-white">
                    JK AUTO ELECTRONIC WORKS (NAGPUR)
                  </h1>
                </div>
                <p className="text-gray-300 mt-2 flex items-center gap-2 ml-1 group-hover:text-gray-200 transition-colors">
                  <HardDrive className="w-4 h-4 animate-pulse" />
                  <span className="font-mono">{filteredData?.length || 0} of {data?.length || 0} firmware entries available</span>
                  <TrendingUp className="w-4 h-4 text-green-400 ml-2" />
                </p>
              </div>
              
              {/* View Toggle and Export Button */}
              <div className="flex gap-3 items-center">
                <div className="bg-gray-800/60 backdrop-blur-md rounded-xl p-1 border border-gray-700/50">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      viewMode === "table"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Layers className="w-4 h-4 inline mr-1" /> Table
                  </button>
                  <button
                    onClick={() => setViewMode("card")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      viewMode === "card"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Database className="w-4 h-4 inline mr-1" /> Cards
                  </button>
                </div>

                <button
                  onClick={() => setShowExportModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white text-sm font-medium hover:scale-105 transition-all shadow-lg flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Export
                </button>
              </div>
            </div>
          </div>

          {/* NEW FEATURE 1: Quick Stats Insights Panel */}
          <div className="mb-6 relative">
            <button
              onMouseEnter={() => setShowStatsInsight(true)}
              onMouseLeave={() => setShowStatsInsight(false)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600/80 to-purple-600/80 backdrop-blur-md rounded-xl border border-indigo-500/50 hover:border-indigo-400 transition-all group"
            >
              <BarChart3 className="w-4 h-4 text-white animate-pulse" />
              <span className="text-white text-sm font-medium">Quick Stats Insights</span>
              <Info className="w-3 h-3 text-indigo-300 group-hover:text-white transition-colors" />
            </button>
            
            {showStatsInsight && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-gray-800/95 backdrop-blur-md rounded-xl border border-gray-700 shadow-2xl p-4 z-20 animate-fadeIn">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-700">
                    <h4 className="text-white font-semibold text-sm">📊 Current View Insights</h4>
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Top Brand:</span>
                      <span className="text-white font-bold">{statsInsights.topBrand?.[0] || 'N/A'} <span className="text-emerald-400">({statsInsights.topBrand?.[1] || 0})</span></span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Top Module:</span>
                      <span className="text-white font-bold">{statsInsights.topModule?.[0] || 'N/A'} <span className="text-emerald-400">({statsInsights.topModule?.[1] || 0})</span></span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Most Common Year:</span>
                      <span className="text-white font-bold">{statsInsights.mostCommonYear?.[0] || 'N/A'} <span className="text-emerald-400">({statsInsights.mostCommonYear?.[1] || 0})</span></span>
                    </div>
                    <div className="pt-2 mt-1 border-t border-gray-700/50">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <TrendingUp className="w-3 h-3" />
                        <span>Unique Brands: {Object.keys(statsInsights.brandCounts).length}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                        <Cpu className="w-3 h-3" />
                        <span>Active Modules: {Object.keys(statsInsights.moduleCounts).length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Animated Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="relative group animate-slideUp"
                style={{ animationDelay: `${stat.delay}s` }}
                onMouseEnter={() => setIsStatsHovered(true)}
                onMouseLeave={() => setIsStatsHovered(false)}
              >
                <div className="absolute inset-0 bg-gradient-to-r rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" style={{ backgroundImage: `linear-gradient(to right, ${stat.color.split(" ")[1]}, ${stat.color.split(" ")[3]})` }}></div>
                <div className="relative bg-gray-800/80 backdrop-blur-md rounded-2xl p-4 border border-gray-700/50 hover:border-gray-600 transition-all group-hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">{stat.label}</p>
                      <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg animate-float`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" style={{ backgroundImage: `linear-gradient(to right, ${stat.color.split(" ")[1]}, ${stat.color.split(" ")[3]})` }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Search and Filter Bar - Automotive Dashboard Style */}
          <div className="mb-6 animate-fadeInUp">
            <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700/50 p-4 transition-all duration-300 hover:shadow-2xl">
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
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${
                    isFilterOpen || getActiveFilterCount() > 0
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Filter className="w-5 h-5" />
                  Filters
                  {getActiveFilterCount() > 0 && (
                    <span className="ml-1 bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs font-bold animate-pulse">
                      {getActiveFilterCount()}
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleApplyFilters}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Apply
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-gray-700 text-gray-300 rounded-xl font-medium hover:bg-gray-600 transition-all shadow-md hover:shadow-lg"
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
                      <div key={key} className="relative group">
                        <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 group-hover:text-blue-400 transition-colors">{label}</label>
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
                        <Icon className="absolute right-3 top-8 w-4 h-4 text-gray-500 pointer-events-none group-hover:text-blue-400 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Filters Display */}
              {getActiveFilterCount() > 0 && !isFilterOpen && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-700 animate-slideIn">
                  {appliedFilters.brand !== "All Brands" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-900/50 text-blue-300 rounded-full text-xs border border-blue-700 animate-fadeIn">
                      Brand: {appliedFilters.brand}
                      <button onClick={() => setAppliedFilters({ ...appliedFilters, brand: "All Brands" })}>
                        <X className="w-3 h-3 hover:text-blue-100" />
                      </button>
                    </span>
                  )}
                  {appliedFilters.year !== "All Years" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-900/50 text-indigo-300 rounded-full text-xs border border-indigo-700 animate-fadeIn animation-delay-100">
                      Year: {appliedFilters.year}
                      <button onClick={() => setAppliedFilters({ ...appliedFilters, year: "All Years" })}>
                        <X className="w-3 h-3 hover:text-indigo-100" />
                      </button>
                    </span>
                  )}
                  {appliedFilters.module !== "All Modules" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-900/50 text-purple-300 rounded-full text-xs border border-purple-700 animate-fadeIn animation-delay-200">
                      Module: {appliedFilters.module}
                      <button onClick={() => setAppliedFilters({ ...appliedFilters, module: "All Modules" })}>
                        <X className="w-3 h-3 hover:text-purple-100" />
                      </button>
                    </span>
                  )}
                  {appliedFilters.fileType !== "All File Types" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-rose-900/50 text-rose-300 rounded-full text-xs border border-rose-700 animate-fadeIn animation-delay-300">
                      File: {appliedFilters.fileType}
                      <button onClick={() => setAppliedFilters({ ...appliedFilters, fileType: "All File Types" })}>
                        <X className="w-3 h-3 hover:text-rose-100" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* NEW FEATURE 2: Bulk Action Bar (Floating bar when rows are selected) */}
          {showBulkBar && (
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-slideUp">
              <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-500/30 p-3 flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span className="text-white text-sm font-medium">{selectedRows.length} selected</span>
                </div>
                <div className="h-8 w-px bg-gray-700"></div>
                <button
                  onClick={handleBulkCopy}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 hover:text-white transition-all text-sm"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={handleBulkBookmark}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 hover:text-white transition-all text-sm"
                >
                  <Bookmark className="w-4 h-4" />
                  Bookmark
                </button>
                <button
                  onClick={handleBulkShare}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 hover:text-white transition-all text-sm"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <div className="h-8 w-px bg-gray-700"></div>
                <button
                  onClick={() => setSelectedRows([])}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-400 transition-all text-sm"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Loading State with Enhanced Animation */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Gauge className="w-8 h-8 text-blue-500 animate-pulse" />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
              </div>
              <p className="mt-4 text-gray-300 font-medium animate-pulse">Loading firmware data...</p>
              <div className="flex gap-1 mt-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          )}

          {/* Table View */}
          {!loading && viewMode === "table" && (
            <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700/50 overflow-hidden transition-all duration-300 hover:shadow-2xl animate-fadeIn">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
  <tr className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
    <th className="px-4 md:px-6 py-4 text-left">
      <input
        type="checkbox"
        checked={selectedRows.length === currentItems.length && currentItems.length > 0}
        onChange={handleSelectAll}
        className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
      />
    </th>
    {[
      { label: "Sr. No", icon: Layers, sortable: false },
      { label: "Brand", icon: Tag, sortable: true, key: "brand" },
      { label: "Model", icon: Database, sortable: true, key: "model" },
      { label: "Year", icon: Calendar, sortable: true, key: "year" },
      { label: "Module", icon: Cpu, sortable: true, key: "module" },
      { label: "Block Number", icon: FileText, sortable: false },
      { label: "File Type", icon: CheckCircle, sortable: true, key: "fileType" },
    ].map(({ label, icon: Icon, sortable, key }) => (
      <th
        key={label}
        className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-gray-300 cursor-pointer group"
        onClick={() => sortable && handleSort(key)}
      >
        <div className="flex items-center gap-2">
          <Icon className="w-3 h-3 md:w-4 md:h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
          {label}
          {sortable && sortConfig.key === key && (
            <span className="text-blue-400 text-xs">
              {sortConfig.direction === "asc" ? "↑" : "↓"}
            </span>
          )}
        </div>
      </th>
    ))}
  </tr>
</thead>
                  <tbody>
                    {currentItems?.map((item, i) => (
                      <tr
                        key={item.id || i}
                        className={`border-b border-gray-700/50 transition-all duration-300 group ${
                          hoveredRow === i ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 scale-[1.01] shadow-lg' : 'hover:bg-gray-700/20'
                        } ${selectedRows.includes(item.id) ? 'bg-blue-900/20' : ''}`}
                        onMouseEnter={() => setHoveredRow(i)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(item.id)}
                            onChange={() => handleRowSelect(item.id)}
                            className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                          #{startIndex + i + 1}
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <span className="capitalize font-medium text-white">{item.brand}</span>
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
                              <code key={idx} className="text-[10px] md:text-sm bg-gray-900 px-1 md:px-2 py-0.5 md:py-1 rounded block font-mono text-red-400 text-center">
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
                  <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <Database className="w-12 h-12 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">No results found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search term</p>
                  <button
                    onClick={handleReset}
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-colors transform hover:scale-105"
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
                      <span className="text-blue-400 text-xs md:text-sm animate-pulse">
                        ({data.length - filteredData.length} filtered out)
                      </span>
                    )}
                    {selectedRows.length > 0 && (
                      <span className="text-emerald-400">
                        {selectedRows.length} selected
                      </span>
                    )}
                  </div>
                  
                  {/* Pagination Controls */}
                  <div className="flex items-center gap-1 md:gap-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-2 md:px-3 py-1 rounded-lg bg-gray-700 border border-gray-600 hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 hover:scale-105"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <div className="hidden sm:flex gap-1 md:gap-2">
                      {getPageNumbers().map((page) => (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-2 md:px-4 py-1 rounded-lg transition-all transform hover:scale-105 ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                              : 'bg-gray-700 border border-gray-600 hover:bg-gray-600 text-gray-300'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <span className="sm:hidden px-3 py-1 rounded-lg bg-gray-700 text-gray-200">
                      Page {currentPage} of {totalPages}
                    </span>
                    
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-2 md:px-3 py-1 rounded-lg bg-gray-700 border border-gray-600 hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 hover:scale-105"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Card View */}
          {!loading && viewMode === "card" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              {currentItems?.map((item, i) => (
                <div
                  key={item.id || i}
                  className={`group relative bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-700/50 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer ${
                    selectedRows.includes(item.id) ? 'ring-2 ring-blue-500 bg-blue-900/20' : ''
                  }`}
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => handleRowSelect(item.id)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Tag className="w-4 h-4 text-blue-400" />
                          <span className="text-lg font-bold text-white capitalize">{item.brand}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Database className="w-4 h-4 text-purple-400" />
                          <span className="text-gray-300">{item.model}</span>
                        </div>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(item.id)}
                          onChange={() => {}}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-300">Year: {item.year}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-300">Module: {item.module}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-gray-500 mt-1" />
                        <div className="flex-1">
                          {item.blockNumber?.split("\n").slice(0, 2).map((line, idx) => (
                            <code key={idx} className="text-xs bg-gray-900 px-2 py-1 rounded block font-mono text-red-400 mb-1">
                              {line.length > 40 ? line.substring(0, 40) + "..." : line}
                            </code>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-700">
                      <Link
                        to={`/module-info/${item.id}`}
                        state={item.block_number}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badgeColor(item.fileType || item.file_type)}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item.fileType || item.file_type}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-700 shadow-2xl animate-slideUp">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Export Data</h3>
              <button onClick={() => setShowExportModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-300 mb-6">Choose export format for {filteredData.length} entries</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleExport("csv")}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white font-medium hover:scale-105 transition-all"
              >
                CSV
              </button>
              <button
                onClick={() => handleExport("json")}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-medium hover:scale-105 transition-all"
              >
                JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
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