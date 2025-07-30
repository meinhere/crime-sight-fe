'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { CrimeMapFilters } from '@/components/crime-map-filters'
import { CrimeMapStats } from '@/components/crime-map-stats'
import { CrimeMapLegend } from '@/components/crime-map-legend'
import { districtsData } from '@/data/districts-data'
import { IconFilter, IconChartBar, IconInfoCircle } from '@tabler/icons-react'

const IndonesiaCrimeMap = dynamic(() =>
    import('@/components/indonesia-crime-map').then(mod => ({ default: mod.IndonesiaCrimeMap })), {
    ssr: false,
    loading: () => (
        <div className="h-full bg-gray-100 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Memuat peta Indonesia...</p>
                <p className="text-sm text-gray-500 mt-1">Memproses data wilayah</p>
            </div>
        </div>
    )
})

export default function CriminalMapsPage() {
    const [selectedCrimeType, setSelectedCrimeType] = useState('all')
    const [selectedPeriod, setSelectedPeriod] = useState('all')
    const [selectedRegion, setSelectedRegion] = useState('all')
    const [showFilters, setShowFilters] = useState(false)
    const [showStats, setShowStats] = useState(false)
    const [showLegend, setShowLegend] = useState(false)

    const filteredDistricts = useMemo(() => {
        if (selectedRegion === 'all' || selectedRegion === 'jawa-timur') {
            return districtsData
        }
        return districtsData.filter(district => district.id === selectedRegion)
    }, [selectedRegion])

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header - Responsive */}
            <div className="bg-white border-b-2 border-gray-200 px-4 md:px-6 py-3 md:py-4 flex-shrink-0 shadow-sm">
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
                    <div className="bg-black bg-opacity-50" onClick={() => setShowStats(false)}>
                        <div className="bg-white rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-black text-lg">Statistik Indonesia</h3>
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
                    <div className="bg-black bg-opacity-50" onClick={() => setShowLegend(false)}>
                        <div className="bg-white rounded-t-2xl p-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-black text-lg">Legenda Peta</h3>
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
    )
}