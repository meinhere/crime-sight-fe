// app/(public)/criminal-maps/page.tsx
'use client'

import { useState, useMemo, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { CrimeMapFilters } from '@/components/crime-map-filters'
import { CrimeMapStats } from '@/components/crime-map-stats'
import { CrimeMapLegend } from '@/components/crime-map-legend'
import { CrimeTrendChart } from '@/components/crime-trend-chart'
import { IconFilter, IconChartBar, IconInfoCircle } from '@tabler/icons-react'
import { RegionalCases } from '@/components/regional-cases'
import { CrimeTypeTrend } from '@/components/crime-type-trend'
import { CrimeTimeChart } from '@/components/crime-time-chart'
import { CrimeLocationList } from '@/components/crime-location-list'
import { MapLoading } from '@/components/map-loading'
import type { ApiClusterResponse, ClusterFilters, District } from '@/types/api'
import { getProvinsiByKode, getCrimeTypeForAPI, getCrimeTypeLabel } from '@/data/filter-options'
import { API_CONFIG, LOADING_MESSAGES, ERROR_MESSAGES, PROVINCE_CODE_MAP } from '@/data/constants'

const IndonesiaCrimeMap = dynamic(() =>
    import('@/components/indonesia-crime-map').then(mod => ({ default: mod.IndonesiaCrimeMap })), {
    ssr: false,
    loading: () => (
        <MapLoading
            message="Memuat komponen peta..."
            showProgress={true}
        />
    )
})

// ✅ Move utility function OUTSIDE component or at the TOP
const mapApiLevelToComponent = (apiLevel: string): 'high' | 'medium' | 'low' => {
    switch (apiLevel) {
        case 'Tinggi': return 'high'
        case 'Sedang': return 'medium'
        case 'Rendah': return 'low'
        default: return 'medium'
    }
}

export default function CriminalMapsPage() {
    const [selectedCrimeType, setSelectedCrimeType] = useState('all')
    const [selectedPeriod, setSelectedPeriod] = useState('all')
    const [selectedRegion, setSelectedRegion] = useState('all')
    const [showFilters, setShowFilters] = useState(false)
    const [showStats, setShowStats] = useState(false)
    const [showLegend, setShowLegend] = useState(false)

    // API related states - SIMPLIFIED
    const [clusterData, setClusterData] = useState<ApiClusterResponse | null>(null)
    const [mapLoading, setMapLoading] = useState(false) // Only for map overlay
    const [isFirstLoad, setIsFirstLoad] = useState(true) // Track very first load

    // ✅ Updated fetch function with jenis_kejahatan parameter
    const fetchClusterData = async (filters: ClusterFilters = {}, showLoadingOverlay = true) => {
        // Show map overlay loading for filter changes (not first load)
        if (!isFirstLoad && showLoadingOverlay) {
            setMapLoading(true)
        }

        try {
            const params = new URLSearchParams()

            // ✅ Add jenis_kejahatan filter
            if (filters.jenis_kejahatan && filters.jenis_kejahatan !== 'all') {
                params.append('jenis_kejahatan', filters.jenis_kejahatan)
            }

            // ✅ Add tahun filter
            if (filters.tahun) {
                params.append('tahun', filters.tahun.toString())
            }

            // ✅ Add provinsi filter
            if (filters.provinsi && filters.provinsi !== 'all') {
                params.append('provinsi', filters.provinsi)
            }

            const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLUSTER}${params.toString() ? `?${params.toString()}` : ''}`
            console.log('🔗 API Request:', url)

            const response = await fetch(url)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data: ApiClusterResponse = await response.json()
            console.log('📊 API Response:', data)
            console.log('📋 Sample districts from API:', data.data.slice(0, 5))
            setClusterData(data)

            // Show success toast only for filter changes, not initial load
            if (!isFirstLoad) {
                const crimeTypeLabel = filters.jenis_kejahatan && filters.jenis_kejahatan !== 'all'
                    ? getCrimeTypeLabel(selectedCrimeType)
                    : null

                const provinceName = filters.provinsi && filters.provinsi !== 'all'
                    ? PROVINCE_CODE_MAP[filters.provinsi]
                    : 'Indonesia'

                const yearInfo = filters.tahun ? ` tahun ${filters.tahun}` : ''

                const filterInfo = [
                    crimeTypeLabel,
                    `${provinceName}${yearInfo}`
                ].filter(Boolean).join(' - ')

                toast.success(`Data ${filterInfo} berhasil dimuat`, {
                    description: `${data.data.length} kabupaten/kota berhasil dimuat`,
                })
            }

        } catch (err) {
            console.error('❌ API Error:', err)
            const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.FETCH_FAILED

            // Show error toast with action button
            toast.error('Gagal memuat data peta', {
                description: errorMessage,
                action: {
                    label: 'Coba Lagi',
                    onClick: () => fetchClusterData(filters)
                },
            })

            // If error occurs when loading specific province, reset to Indonesia
            if (filters.provinsi && filters.provinsi !== 'all') {
                console.log('🔄 Resetting to Indonesia due to province error')

                setTimeout(() => {
                    setSelectedRegion('all')
                    toast.info('Reset ke tampilan Indonesia', {
                        description: 'Menampilkan data seluruh Indonesia',
                    })
                }, 2000)
            }

            // If no data exists yet (first load error), try to load default Indonesia data
            if (!clusterData) {
                console.log('🔄 Attempting to load default Indonesia data')

                // Show loading toast for retry
                const loadingToastId = toast.loading('Mencoba memuat data Indonesia...', {
                    description: 'Mohon tunggu sebentar'
                })

                setTimeout(() => {
                    toast.dismiss(loadingToastId)
                    fetchClusterData({}, false) // Retry with no filters, no loading overlay
                }, 3000)
            }

        } finally {
            setMapLoading(false)
            setIsFirstLoad(false)
        }
    }

    // Initial data fetch
    useEffect(() => {
        fetchClusterData()
    }, [])

    // ✅ Updated useEffect for filter changes with jenis_kejahatan
    useEffect(() => {
        // Skip if this is the very first load
        if (isFirstLoad) return

        const filters: ClusterFilters = {}

        // ✅ Add jenis_kejahatan filter
        if (selectedCrimeType !== 'all') {
            filters.jenis_kejahatan = getCrimeTypeForAPI(selectedCrimeType)
        }

        // ✅ Add tahun filter
        if (selectedPeriod !== 'all') {
            const year = parseInt(selectedPeriod)
            if (!isNaN(year)) {
                filters.tahun = year
            }
        }

        // ✅ Add provinsi filter
        if (selectedRegion !== 'all') {
            filters.provinsi = selectedRegion
        }

        console.log('🔄 Filters changed:', filters)
        console.log('🔍 Selected Crime Type:', selectedCrimeType, '→', getCrimeTypeForAPI(selectedCrimeType))
        console.log('🏛️ Selected Province:', PROVINCE_CODE_MAP[selectedRegion] || 'All Indonesia')
        console.log('📅 Selected Year:', selectedPeriod !== 'all' ? selectedPeriod : 'All Years')

        fetchClusterData(filters)
    }, [selectedCrimeType, selectedPeriod, selectedRegion, isFirstLoad])

    // ✅ Safe fallback for normalized_count - NOW mapApiLevelToComponent is available
    const transformedDistricts = useMemo(() => {
        if (!clusterData?.data) return []

        console.log('🔄 Transforming API data:', {
            totalItems: clusterData.data.length,
            selectedCrimeType,
            selectedRegion,
            selectedPeriod,
            provinceName: PROVINCE_CODE_MAP[selectedRegion] || 'All Indonesia',
            filters: clusterData.meta.filters,
            sampleData: clusterData.data.slice(0, 3).map(item => ({
                name: item.name,
                level: item.level,
                count: item.count,
                normalized_count: item.normalized_count
            }))
        })

        return clusterData.data.map(item => {
            const district = {
                id: item.name.toLowerCase().replace(/\s+/g, '-'),
                name: item.name,
                position: [0, 0] as [number, number],
                totalCases: item.count,
                dangerLevel: mapApiLevelToComponent(item.level),
                // ✅ Safe handling for normalized_count
                normalized_count: typeof item.normalized_count === 'number' ? item.normalized_count : 0,
                provinsi_kode: selectedRegion !== 'all' ? selectedRegion : undefined,
                crimeTypes: {
                    korupsi: selectedCrimeType === 'korupsi' ? item.count : Math.floor(item.count * 0.15),
                    pencurian: selectedCrimeType === 'pencurian' ? item.count : Math.floor(item.count * 0.25),
                    narkoba: selectedCrimeType === 'narkoba' ? item.count : Math.floor(item.count * 0.20),
                    penipuan: selectedCrimeType === 'penipuan' ? item.count : Math.floor(item.count * 0.18),
                    pembunuhan: selectedCrimeType === 'pembunuhan' ? item.count : Math.floor(item.count * 0.05),
                    pemerkosaan: selectedCrimeType === 'pemerkosaan' ? item.count : Math.floor(item.count * 0.07),
                    penggelapan: selectedCrimeType === 'penggelapan' ? item.count : Math.floor(item.count * 0.10)
                }
            } as District

            return district
        })
    }, [clusterData, selectedCrimeType, selectedRegion, selectedPeriod])

    // Get selected province info for display
    const selectedProvinceInfo = useMemo(() => {
        if (selectedRegion === 'all') return null
        return getProvinsiByKode(selectedRegion)
    }, [selectedRegion])

    // ✅ Updated filter description to include crime type
    const filterDescription = useMemo(() => {
        const parts = []

        if (selectedCrimeType !== 'all') {
            parts.push(`Jenis: ${getCrimeTypeLabel(selectedCrimeType)}`)
        }

        if (selectedPeriod !== 'all') {
            parts.push(`Tahun: ${selectedPeriod}`)
        }

        if (selectedProvinceInfo) {
            parts.push(`Provinsi: ${selectedProvinceInfo.nama_provinsi}`)
        }

        return parts.length > 0 ? `Filter aktif: ${parts.join(' | ')}` : null
    }, [selectedCrimeType, selectedPeriod, selectedProvinceInfo])

    // ✅ ONLY show full page loading if NO DATA at all and it's first load
    if (isFirstLoad && !clusterData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Memuat aplikasi peta...</p>
                    <p className="text-sm text-gray-500 mt-1">Mohon tunggu sebentar</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            {/* ✅ shadcn/ui Sonner Toaster */}
            <Toaster
                position="top-right"
                richColors
                closeButton
                expand
                visibleToasts={4}
            />

            {/* Map Section */}
            <div className="h-screen flex flex-col">
                {/* Header - Always Visible */}
                <div className="bg-white border-b-2 border-gray-200 px-4 md:px-6 py-3 md:py-4 flex-shrink-0 shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-0">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-black">
                                Peta Kejahatan Indonesia
                                {selectedProvinceInfo && (
                                    <span className="text-lg font-normal text-gray-600 ml-2">
                                        - {selectedProvinceInfo.nama_provinsi}
                                    </span>
                                )}
                                {/* ✅ Show selected year in title */}
                                {selectedPeriod !== 'all' && (
                                    <span className="text-base font-normal text-blue-600 ml-2">
                                        ({selectedPeriod})
                                    </span>
                                )}
                                {/* ✅ Show selected crime type in title */}
                                {selectedCrimeType !== 'all' && (
                                    <span className="text-sm font-normal text-green-600 ml-2">
                                        - {getCrimeTypeLabel(selectedCrimeType)}
                                    </span>
                                )}
                            </h1>
                            <p className="text-xs md:text-sm text-gray-600 mt-1">
                                {selectedRegion === 'all'
                                    ? 'Clustering wilayah berdasarkan tingkat bahaya kejahatan seluruh Indonesia'
                                    : `Clustering kabupaten/kota di ${selectedProvinceInfo?.nama_provinsi} berdasarkan tingkat bahaya kejahatan`
                                }
                            </p>
                            <div className="flex flex-col gap-1 mt-1">
                                {clusterData && (
                                    <p className="text-xs text-gray-500">
                                        Total Records: {clusterData.meta.total_records} |
                                        Districts Loaded: {transformedDistricts.length}
                                        {/* ✅ Show API filters info */}
                                        {clusterData.meta.filters && (
                                            <>
                                                {clusterData.meta.filters.jenis_kejahatan && ` | Jenis: ${clusterData.meta.filters.jenis_kejahatan}`}
                                                {clusterData.meta.filters.tahun && ` | Tahun: ${clusterData.meta.filters.tahun}`}
                                                {clusterData.meta.filters.provinsi && ` | Provinsi: ${clusterData.meta.filters.provinsi}`}
                                            </>
                                        )}
                                    </p>
                                )}
                                {filterDescription && (
                                    <p className="text-xs text-blue-600 font-medium">
                                        {filterDescription}
                                    </p>
                                )}
                                {/* Loading indicator in header when fetching new data */}
                                {mapLoading && (
                                    <p className="text-xs text-orange-600 animate-pulse">
                                        🔄 Memuat data baru...
                                    </p>
                                )}
                                {!mapLoading && clusterData && (
                                    <p className="text-xs text-green-600">
                                        ✅ Data berhasil dimuat • {new Date().toLocaleTimeString('id-ID')}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Desktop Filters - Always Visible */}
                        <div className="hidden lg:block">
                            <CrimeMapFilters
                                selectedCrimeType={selectedCrimeType}
                                selectedPeriod={selectedPeriod}
                                selectedRegion={selectedRegion}
                                onCrimeTypeChange={setSelectedCrimeType}
                                onPeriodChange={setSelectedPeriod}
                                onRegionChange={setSelectedRegion}
                                disableCrimeType={false} // ✅ Enable crime type filter
                                disablePeriod={false}
                            />
                        </div>

                        {/* Mobile/Tablet Filter Toggle - Always Visible */}
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
                                disableCrimeType={false} // ✅ Enable for mobile too
                                disablePeriod={false}
                            />
                        </div>
                    )}
                </div>

                {/* Map Container */}
                <div className="flex-1 relative">
                    {/* ✅ Map Loading Overlay - Only when changing filters */}
                    {mapLoading && (
                        <div className="absolute inset-0 z-[999] bg-white bg-opacity-80 flex items-center justify-center">
                            <div className="text-center bg-white rounded-lg shadow-lg p-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-2"></div>
                                <p className="text-gray-700 font-medium">
                                    {selectedProvinceInfo ?
                                        `Memuat data ${selectedProvinceInfo.nama_provinsi}...` :
                                        "Memuat data peta..."
                                    }
                                    {/* ✅ Show crime type and year in loading message */}
                                    {(selectedCrimeType !== 'all' || selectedPeriod !== 'all') && (
                                        <span className="block text-sm text-gray-500 mt-1">
                                            {selectedCrimeType !== 'all' && getCrimeTypeLabel(selectedCrimeType)}
                                            {selectedCrimeType !== 'all' && selectedPeriod !== 'all' && ' - '}
                                            {selectedPeriod !== 'all' && `Tahun ${selectedPeriod}`}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ✅ Map Component - Always Render (No Error State in Map Area) */}
                    <IndonesiaCrimeMap
                        districts={transformedDistricts}
                        selectedCrimeType={selectedCrimeType}
                        selectedRegion={selectedRegion}
                        selectedProvinceInfo={selectedProvinceInfo}
                        loading={false}
                    />

                    <div className="hidden lg:block">
                        <CrimeMapStats
                            districts={transformedDistricts}
                            selectedCrimeType={selectedCrimeType}
                            selectedPeriod={selectedPeriod}
                            selectedRegion={selectedRegion}
                            selectedProvinceName={selectedProvinceInfo?.nama_provinsi}
                        />
                        <CrimeMapLegend />
                    </div>

                    {/* Mobile Control Buttons - Always Show */}
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

                {/* Mobile Bottom Sheets - Always Available */}
                {showStats && (
                    <div className="lg:hidden fixed inset-x-0 bottom-0 z-[1001]">
                        <div className="bg-black bg-opacity-50" onClick={() => setShowStats(false)}>
                            <div className="bg-white rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-black text-lg">
                                        Statistik {selectedProvinceInfo ? selectedProvinceInfo.nama_provinsi : 'Indonesia'}
                                        {/* ✅ Show crime type and year in mobile stats title */}
                                        {selectedCrimeType !== 'all' && (
                                            <span className="text-sm text-green-600 ml-2">- {getCrimeTypeLabel(selectedCrimeType)}</span>
                                        )}
                                        {selectedPeriod !== 'all' && (
                                            <span className="text-sm text-blue-600 ml-2">({selectedPeriod})</span>
                                        )}
                                    </h3>
                                    <button
                                        onClick={() => setShowStats(false)}
                                        className="text-gray-500 hover:text-black"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <CrimeMapStats
                                    districts={transformedDistricts}
                                    selectedCrimeType={selectedCrimeType}
                                    selectedPeriod={selectedPeriod}
                                    selectedRegion={selectedRegion}
                                    selectedProvinceName={selectedProvinceInfo?.nama_provinsi}
                                    isMobile={true}
                                />
                            </div>
                        </div>
                    </div>
                )}

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

            {/* Chart Section - Always Show */}
            <div className="py-8">
                <div className="mx-auto space-y-8">
                    <CrimeTrendChart/>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <RegionalCases />
                        <CrimeTypeTrend />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <CrimeTimeChart />
                        <CrimeLocationList />
                    </div>
                </div>
            </div>
        </div>
    )
}