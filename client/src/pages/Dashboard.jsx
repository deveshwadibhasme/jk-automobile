import React, { useState, useMemo, useEffect } from "react";
import Header from "../components/layout/Header";
import axios from "axios";
import { Link } from "react-router-dom";

const FirmwareTable = () => {
  const [data, setData] = useState();
  const LOCAL_URL = "http://localhost:3000";
  const PUBLIC_URL = "https://jk-automobile-9xtf.onrender.com";

  const url = location.hostname === "localhost" ? LOCAL_URL : PUBLIC_URL;

  useEffect(() => {
    function fetchData() {
      axios.get(`${url}/data/get-car-data/id`).then((result) => {
        setData(result.data.result);
      });
    }
    handleApplyFilters();
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

  const brands = ["All Brands", ...new Set(data?.map((x) => x.brand))];
  const years = ["All Years", ...new Set(data?.map((x) => x.year.toString()))];

  const modules = ["All Modules", ...new Set(data?.map((x) => x.module))];
  const fileTypes = [
    "All File Types",
    ...new Set(data?.map((x) => x.file_type)),
  ];

  const filteredData = (() => {
    return data?.filter((item) => {
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
  })();

  const handleApplyFilters = () => setAppliedFilters({ ...tempFilters });

  const handleReset = () =>
    setAppliedFilters({
      search: "",
      brand: "All Brands",
      year: "All Years",
      module: "All Modules",
      fileType: "All File Types",
    });

  const badgeColor = (type) => {
    const map = {
      eeprom: "bg-green-100 text-green-800",
      flash: "bg-yellow-100 text-yellow-800",
      full: "bg-blue-100 text-blue-800",
      chrome: "bg-red-100 text-red-800",
    };
    return map[type?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  return (
    <>
      <Header />
      <div className="max-w-[1500px] mx-auto p-6 bg-gray-100 rounded-lg">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Total Records</h1>
          <div className="text-gray-500">
            {filteredData?.length} Firmware entries
          </div>
        </header>

        {/* Filters box */}
        <div className="bg-white p-5 rounded-lg shadow mb-6">
          {/* Search */}
          <div className="mb-4">
            <div className="relative max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold"></span>
              <input
                type="text"
                value={tempFilters.search}
                onChange={(e) =>
                  setTempFilters({ ...tempFilters, search: e.target.value })
                }
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap gap-3">
            {[
              ["brand", brands],
              ["year", years],
              ["module", modules],
              ["fileType", fileTypes],
            ].map(([key, list]) => (
              <select
                key={key}
                value={tempFilters[key]}
                onChange={(e) =>
                  setTempFilters({ ...tempFilters, [key]: e.target.value })
                }
                className="border rounded px-3 capitalize py-2 min-w-[150px] focus:outline-none focus:ring focus:ring-blue-200"
              >
                {list.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            ))}

            {/* Buttons */}
            <div className="flex gap-2 ml-auto">
              <button
                onClick={handleApplyFilters}
                className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                OK
              </button>

              <button
                onClick={handleReset}
                className="px-5 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                {[
                  "Sr. No",
                  "Brand",
                  "Model",
                  "Year",
                  "Module",
                  "Memory",
                  "Block Number",
                  "File Type",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 font-semibold text-gray-700 border-b"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredData?.map((item, i) => (
                <tr key={item.id} className="hover:bg-gray-100">
                  <td className="px-4 py-3 text-blue-600 font-bold">{i + 1}</td>
                  <td className="px-4 py-3 capitalize">{item.brand}</td>
                  <td className="px-4 py-3">{item.model}</td>
                  <td className="px-4 py-3">{item.year}</td>
                  <td className="px-4 py-3">{item.module}</td>
                  <td className="px-4 py-3">{item.memory}</td>

                  <td className="px-4 py-3">
                    {item.block_number?.split("\n").map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </td>

                  <td className="px-4 py-3">
                    <Link
                      to={`/module-info/${item.id}`}
                      className={`px-3 py-1 rounded-full text-xs font-semibold shadow ${badgeColor(
                        item.file_type
                      )}`}
                    >
                      {item.file_type}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default FirmwareTable;

const initialData = [
  {
    id: 45026,
    brand: "Hyundai",
    model: "Sonata",
    year: 2014,
    module: "Dash",
    memory: "Nec 70F5356",
    blockNumber: "94032-C2000",
    fileType: "Eeprom",
  },
  {
    id: 45025,
    brand: "Honda",
    model: "CR-V",
    year: 2008,
    module: "ECU",
    memory: "SHT058",
    blockNumber: "37820-KZA-J53\n37806-KZL-H510",
    fileType: "Flash",
  },
  {
    id: 45024,
    brand: "Honda",
    model: "CR-V",
    year: 2009,
    module: "TCM",
    memory: "SHT053",
    blockNumber: "28100-KZA-J55\n37806-KZL-M40",
    fileType: "Flash",
  },
  {
    id: 45023,
    brand: "Nissan",
    model: "Note E-Power",
    year: 2017,
    module: "SMS",
    memory: "XC2356A",
    blockNumber: "98200-SW00A\nA650M7473/20750\n645315PMM",
    fileType: "Full",
  },
  {
    id: 45022,
    brand: "Kia",
    model: "Centro BD",
    year: 2022,
    module: "Dash",
    memory: "MSDS512",
    blockNumber: "94043-H6870",
    fileType: "Flash",
  },
  {
    id: 45021,
    brand: "Infiniti",
    model: "OX70",
    year: 2016,
    module: "SSM",
    memory: "95C66",
    blockNumber: "Calsonic Kansel",
    fileType: "Eeprom",
  },
];
