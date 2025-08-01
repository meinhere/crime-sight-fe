"use client";

import { IconChartBar, IconFilter, IconInfoCircle } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { CrimeLocationList } from "@/components/crime-location-list";
import { CrimeMapFilters } from "@/components/crime-map-filters";
import { CrimeMapLegend } from "@/components/crime-map-legend";
import { CrimeMapStats } from "@/components/crime-map-stats";
import { CrimeNewest } from "@/components/crime-newest-list";
import { CrimeProvinceList } from "@/components/crime-povince-list";
import { CrimeTimeChart } from "@/components/crime-time-chart";
import { CrimeTrendChart } from "@/components/crime-trend-chart";
import { CrimeTypeTrend } from "@/components/crime-type-trend";
import { RegionalCases } from "@/components/regional-cases";
import { districtsData } from "@/data/districts-data";
import dynamic from "next/dynamic";

const IndonesiaCrimeMap = dynamic(
  () =>
    import("@/components/indonesia-crime-map").then((mod) => ({
      default: mod.IndonesiaCrimeMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat peta Indonesia...</p>
          <p className="text-sm text-gray-500 mt-1">Memproses data wilayah</p>
        </div>
      </div>
    ),
  }
);
export default function Home() {
  const [selectedCrimeType, setSelectedCrimeType] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  const filteredDistricts = useMemo(() => {
    if (selectedRegion === "all" || selectedRegion === "jawa-timur") {
      return districtsData;
    }
    return districtsData.filter((district) => district.id === selectedRegion);
  }, [selectedRegion]);

  return (
    <div className="min-h-screen flex flex-col w-full gap-8">
      {/* section 1 */}
      <section className="flex flex-col lg:flex-row gap-16">
        {/* Map Section */}
        <div className="min-h-screen flex flex-col h-screen rounded-lg">
          {/* Header - Responsive */}
          <div className="bg-white border-b-2 border-gray-200 px-4 md:px-6 py-3 md:py-4 flex-shrink-0 shadow-sm rounded-t-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-0">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-black">
                  Peta Kejahatan Indonesia
                </h1>
                <p className="text-xs md:text-sm text-gray-600 mt-1">
                  Clustering wilayah berdasarkan tingkat bahaya kejahatan
                </p>
              </div>

              {/* Desktop Filters */}
              <div className="hidden lg:block">
                <CrimeMapFilters
                  selectedCrimeType={selectedCrimeType}
                  selectedPeriod={selectedPeriod}
                  selectedRegion={selectedRegion}
                  onCrimeTypeChange={setSelectedCrimeType}
                  onPeriodChange={setSelectedPeriod}
                  onRegionChange={setSelectedRegion}
                />
              </div>

              {/* Mobile/Tablet Filter Toggle */}
              <div className="lg:hidden">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  <IconFilter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Mobile/Tablet Filters Dropdown */}
            {showFilters && (
              <div className="lg:hidden mt-3 pt-3 border-t border-gray-200">
                <CrimeMapFilters
                  selectedCrimeType={selectedCrimeType}
                  selectedPeriod={selectedPeriod}
                  selectedRegion={selectedRegion}
                  onCrimeTypeChange={setSelectedCrimeType}
                  onPeriodChange={setSelectedPeriod}
                  onRegionChange={setSelectedRegion}
                />
              </div>
            )}
          </div>

          {/* Map Container */}
          <div className="flex-1 relative">
            <IndonesiaCrimeMap
              districts={filteredDistricts}
              selectedCrimeType={selectedCrimeType}
              selectedRegion={selectedRegion}
            />

            {/* Desktop Stats & Legend (Absolute positioned) */}
            <div className="hidden lg:block">
              <CrimeMapStats
                districts={filteredDistricts}
                selectedCrimeType={selectedCrimeType}
              />
              <CrimeMapLegend />
            </div>

            {/* Mobile Control Buttons */}
            <div className="lg:hidden absolute bottom-4 right-4 flex flex-col space-y-2 z-[1000]">
              <button
                onClick={() => setShowStats(!showStats)}
                className="bg-white rounded-full p-3 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <IconChartBar className="w-5 h-5 text-black" />
              </button>
              <button
                onClick={() => setShowLegend(!showLegend)}
                className="bg-white rounded-full p-3 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <IconInfoCircle className="w-5 h-5 text-black" />
              </button>
            </div>
          </div>

          {/* Mobile Bottom Sheets */}
          {/* Stats Bottom Sheet */}
          {showStats && (
            <div className="lg:hidden fixed inset-x-0 bottom-0 z-[1001]">
              <div
                className="bg-black bg-opacity-50"
                onClick={() => setShowStats(false)}
              >
                <div
                  className="bg-white rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-black text-lg">
                      Statistik Indonesia
                    </h3>
                    <button
                      onClick={() => setShowStats(false)}
                      className="text-gray-500 hover:text-black"
                    >
                      ✕
                    </button>
                  </div>
                  <CrimeMapStats
                    districts={filteredDistricts}
                    selectedCrimeType={selectedCrimeType}
                    isMobile={true}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Legend Bottom Sheet */}
          {showLegend && (
            <div className="lg:hidden fixed inset-x-0 bottom-0 z-[1001]">
              <div
                className="bg-black bg-opacity-50"
                onClick={() => setShowLegend(false)}
              >
                <div
                  className="bg-white rounded-t-2xl p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-black text-lg">
                      Legenda Peta
                    </h3>
                    <button
                      onClick={() => setShowLegend(false)}
                      className="text-gray-500 hover:text-black"
                    >
                      ✕
                    </button>
                  </div>
                  <CrimeMapLegend isMobile={true} />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="">
          <CrimeNewest></CrimeNewest>
        </div>
      </section>

      {/* Section 2*/}


      <section className="hidden lg:flex flex-row gap-8 px-4 w-full">
        <div className="flex flex-col justify-center bg-white rounded-2xl min-w-[260px] shadow-lg p-6">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <button className="bg-pink-50 border-2 border-pink-300 text-pink-600 rounded-xl font-semibold shadow hover:bg-pink-200 transition-all w-full h-16 flex items-center justify-center text-base">
                Criminal Maps
              </button>
              <button className="bg-green-50 border-2 border-green-300 text-green-600 rounded-xl font-semibold shadow hover:bg-green-200 transition-all w-full h-16 flex items-center justify-center text-base">
                Chatbot
              </button>
            </div>
            <div className="flex gap-4">
              <button className="bg-purple-50 border-2 border-purple-300 text-purple-600 rounded-xl font-semibold shadow hover:bg-purple-200 transition-all w-full h-16 flex items-center justify-center text-base">
                Summarize Docs
              </button>
              <button className="bg-yellow-50 border-2 border-yellow-300 text-yellow-700 rounded-xl font-semibold shadow hover:bg-yellow-200 transition-all w-full h-16 flex items-center justify-center text-base">
                Find Case
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center min-w-[260px]">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full lg:max-w-md mx-auto flex flex-col justify-center h-[210px]">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 tracking-tight">Log Aktivitas</h2>
            <div className="bg-[#f7f8fa] rounded-xl p-3 flex items-center gap-3 mb-3 h-14 shadow-sm">
              <img src="/images/pdf-icon.png" alt="PDF" className="w-8 h-8" />
              <div className="flex-1">
                <div className="font-semibold text-gray-700 text-base">my-cv.pdf</div>
                <div className="text-xs text-gray-400">
                  85 KB • 01/08/25 • <span className="text-blue-500">Uploading...</span>
                </div>
                <div className="w-full h-1 bg-gray-200 rounded mt-1">
                  <div className="h-1 bg-blue-400 rounded" style={{ width: "70%" }}></div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg width="18" height="18" fill="none">
                  <circle cx="9" cy="9" r="9" fill="#e5e7eb" />
                  <path d="M5 5l8 8M13 5l-8 8" stroke="#9ca3af" strokeWidth="2" />
                </svg>
              </button>
            </div>
            <div className="border rounded-xl px-4 py-3 flex items-center justify-end text-gray-700 h-12 bg-gray-50">
              <span className="font-semibold text-base">Hukum itu apa?</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 */}
      <section className="flex gap-8 w-full flex-col lg:flex-row ">
        <CrimeProvinceList className="lg:w-1/2"/>
        <CrimeTrendChart className="lg:w-full" />
      </section>
    </div>
  );
}
