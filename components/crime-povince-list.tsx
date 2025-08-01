"use client";

import { useMemo, useState } from "react";

import { IconFilter } from "@tabler/icons-react";
import { districtsData } from "@/data/districts-data";

interface CrimeProvinceListProps {
  className?: string;
}

export function CrimeProvinceList({ className }: CrimeProvinceListProps) {
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Data lokasi kejadian
  const locationData = useMemo(() => {
    const locations = [
      { name: "Jawa Timur", cases: 51905 },
      { name: "Jawa Barat", cases: 1091 },
      { name: "Bali", cases: 198 },
      { name: "Makasar", cases: 712 },
      { name: "Jakarta", cases: 177 },
      { name: "NTT", cases: 856 },
      { name: "NTB", cases: 2145 },
      { name: "Papua Barat", cases: 234 },
      { name: "Sulawesi Utara", cases: 445 },
      { name: "Aceh", cases: 678 },
    ];

    // Filter berdasarkan pilihan
    let filteredLocations = [...locations];

    if (selectedFilter === "hotel") {
      filteredLocations = locations.filter(
        (loc) =>
          loc.name.toLowerCase().includes("hotel") ||
          loc.name.toLowerCase().includes("penginapan")
      );
    } else if (selectedFilter === "rumah") {
      filteredLocations = locations.filter(
        (loc) =>
          loc.name.toLowerCase().includes("rumah") ||
          loc.name.toLowerCase().includes("kdrt")
      );
    } else if (selectedFilter === "jalan") {
      filteredLocations = locations.filter(
        (loc) =>
          loc.name.toLowerCase().includes("jalan") ||
          loc.name.toLowerCase().includes("perampokan")
      );
    }

    return filteredLocations.sort((a, b) => b.cases - a.cases);
  }, [selectedFilter]);

  const totalCases = locationData.reduce(
    (sum, location) => sum + location.cases,
    0
  );

  return (
    <div
      className={`bg-white rounded-lg shadow-lg border border-gray-200 p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-black">Lokasi Kejadian</h3>
          <p className="text-sm text-gray-600 mt-1">
            Data kejahatan berdasarkan lokasi
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <IconFilter className="w-4 h-4 text-gray-500" />
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
          >
            <option value="province">Provinsi</option>
            <option value="regency">Kabupaten</option>
          </select>
        </div>
      </div>

      {/* Location List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg border-l-4 border-black">
          <span className="font-semibold text-black">Lokasi</span>
          <span className="font-semibold text-black">Jumlah Kasus</span>
        </div>

        <div className="max-h-80 overflow-y-auto space-y-2">
          {locationData.map((location, index) => (
            <div
              key={location.name}
              className="flex items-center justify-between py-3 px-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <span className="text-gray-800 font-medium">
                  {location.name}
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-black">
                  {location.cases.toLocaleString("id-ID")}
                </span>
                <div className="text-xs text-gray-500">
                  {((location.cases / totalCases) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>

        {locationData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Tidak ada data untuk filter yang dipilih</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Total Kejadian
          </span>
          <span className="text-xl font-bold text-black">
            {totalCases.toLocaleString("id-ID")} kasus
          </span>
        </div>
        <div className="text-xs text-gray-500 text-right mt-1">
          {locationData.length} lokasi tercatat
        </div>
      </div>
    </div>
  );
}
