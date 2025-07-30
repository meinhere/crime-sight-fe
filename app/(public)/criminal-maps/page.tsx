'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { CrimeMapFilters } from '@/components/crime-map-filters'
import { CrimeMapStats } from '@/components/crime-map-stats'
import { CrimeMapLegend } from '@/components/crime-map-legend'
import { districtsData } from '@/data/districts-data'

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

    const filteredDistricts = useMemo(() => {
        if (selectedRegion === 'all' || selectedRegion === 'jawa-timur') {
            return districtsData
        }
        return districtsData.filter(district => district.id === selectedRegion)
    }, [selectedRegion])

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b-2 border-gray-200 px-6 py-4 flex-shrink-0 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-black">
                            Peta Kejahatan Indonesia
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Clustering wilayah berdasarkan tingkat bahaya kejahatan
                        </p>
                    </div>

                    <CrimeMapFilters
                        selectedCrimeType={selectedCrimeType}
                        selectedPeriod={selectedPeriod}
                        selectedRegion={selectedRegion}
                        onCrimeTypeChange={setSelectedCrimeType}
                        onPeriodChange={setSelectedPeriod}
                        onRegionChange={setSelectedRegion}
                    />
                </div>
            </div>

            {/* Map */}
            <div className="flex-1 relative">
                <IndonesiaCrimeMap
                    districts={filteredDistricts}
                    selectedCrimeType={selectedCrimeType}
                    selectedRegion={selectedRegion}
                />

                <CrimeMapStats
                    districts={filteredDistricts}
                    selectedCrimeType={selectedCrimeType}
                />

                <CrimeMapLegend />
            </div>
        </div>
    )
}