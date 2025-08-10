'use client'

import { useState, useMemo, useEffect } from 'react'
import { toast } from 'sonner'
import { IconFilter, IconChevronDown, IconChevronUp, IconCalendar, IconMapPin } from '@tabler/icons-react'
import { API_CONFIG } from '@/data/constants'
import type { Provinsi, MasterProvinsiResponse, MasterTahunResponse } from '@/types/master'

interface CrimeLocationListProps {
    className?: string
}

interface TrendsApiResponse {
    meta: {
        total_records: number
        labels: string[]
        details: {
            lokasi_kejadian: Record<string, number>
        }
        filters: {
            provinsi?: string
            start_year?: string
            end_year?: string
        }
    }
}

export function CrimeLocationList({ className }: CrimeLocationListProps) {
    // ✅ Filter states
    const [selectedProvinsi, setSelectedProvinsi] = useState('all')
    const [selectedYearMode, setSelectedYearMode] = useState<'single' | 'range'>('single')
    const [selectedYear, setSelectedYear] = useState('all')
    const [startYear, setStartYear] = useState('all')
    const [endYear, setEndYear] = useState('all')
    const [showFilters, setShowFilters] = useState(false)

    // ✅ Data states
    const [trendsData, setTrendsData] = useState<TrendsApiResponse | null>(null)
    const [provinsiOptions, setProvinsiOptions] = useState<Provinsi[]>([])
    const [tahunOptions, setTahunOptions] = useState<number[]>([])
    const [loading, setLoading] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    // Fix hydration
    useEffect(() => {
        setIsMounted(true)
    }, [])

    // ✅ Fetch master data on component mount
    useEffect(() => {
        if (isMounted) {
            fetchMasterData()
            fetchTrendsData() // Initial load
        }
    }, [isMounted])

    // ✅ Fetch trends data when filters change
    useEffect(() => {
        if (isMounted) {
            fetchTrendsData()
        }
    }, [selectedProvinsi, selectedYear, startYear, endYear, selectedYearMode, isMounted])

    // ✅ Fetch master data for dropdowns
    const fetchMasterData = async () => {
        try {
            // Fetch provinsi data
            const provinsiResponse = await fetch(`${API_CONFIG.BASE_URL}/api/master/provinsi`)
            if (provinsiResponse.ok) {
                const provinsiData: MasterProvinsiResponse = await provinsiResponse.json()
                setProvinsiOptions(provinsiData.data)
            }

            // Fetch tahun data
            const tahunResponse = await fetch(`${API_CONFIG.BASE_URL}/api/master/tahun`)
            if (tahunResponse.ok) {
                const tahunData: MasterTahunResponse = await tahunResponse.json()
                const sortedYears = tahunData.data.sort((a, b) => a - b)
                setTahunOptions(sortedYears)

                // Set default values
                if (sortedYears.length > 0) {
                    const latestYear = sortedYears[sortedYears.length - 1]
                    setSelectedYear(latestYear.toString())
                    setStartYear(sortedYears[0].toString())
                    setEndYear(latestYear.toString())
                }
            }
        } catch (error) {
            console.error('❌ Failed to fetch master data:', error)
        }
    }

    // ✅ Fetch trends data based on filters
    const fetchTrendsData = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()

            // Add provinsi filter
            if (selectedProvinsi !== 'all') {
                params.append('provinsi', selectedProvinsi)
            }

            // ✅ Add year filters based on mode
            if (selectedYearMode === 'single' && selectedYear !== 'all') {
                params.append('start_year', selectedYear)
                params.append('end_year', selectedYear)
            } else if (selectedYearMode === 'range') {
                if (startYear !== 'all') {
                    params.append('start_year', startYear)
                }
                if (endYear !== 'all') {
                    params.append('end_year', endYear)
                }
            }

            const url = `${API_CONFIG.BASE_URL}/api/trends${params.toString() ? `?${params.toString()}` : ''}`
            console.log('🔗 Crime Location List API Request:', url)

            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data: TrendsApiResponse = await response.json()
            console.log('📊 Crime Location List API Response:', data)
            setTrendsData(data)

            // Show success toast for filter changes (not initial load)
            if (trendsData && (selectedProvinsi !== 'all' || selectedYear !== 'all' || (startYear !== 'all' && endYear !== 'all'))) {
                const provinceName = provinsiOptions.find(p => p.kode_provinsi === selectedProvinsi)?.nama_provinsi || 'Indonesia'
                const filterParts = [provinceName]

                if (selectedYearMode === 'single' && selectedYear !== 'all') {
                    filterParts.push(`Tahun ${selectedYear}`)
                } else if (selectedYearMode === 'range' && startYear !== 'all' && endYear !== 'all') {
                    if (startYear === endYear) {
                        filterParts.push(`Tahun ${startYear}`)
                    } else {
                        filterParts.push(`Tahun ${startYear}-${endYear}`)
                    }
                }

                const filterInfo = filterParts.join(' - ')

                toast.success(`Data lokasi kejadian ${filterInfo} berhasil dimuat`, {
                    description: `${Object.keys(data.meta.details.lokasi_kejadian).length} lokasi ditemukan`,
                })
            }

        } catch (error) {
            console.error('❌ Crime Location List API Error:', error)
            toast.error('Gagal memuat data lokasi kejadian', {
                description: error instanceof Error ? error.message : 'Terjadi kesalahan',
                action: {
                    label: 'Coba Lagi',
                    onClick: () => fetchTrendsData()
                }
            })
        } finally {
            setLoading(false)
        }
    }

    // ✅ Process location data from API
    const locationData = useMemo(() => {
        if (!trendsData?.meta.details.lokasi_kejadian) {
            return []
        }

        return Object.entries(trendsData.meta.details.lokasi_kejadian)
            .map(([name, cases]) => ({ name, cases }))
            .sort((a, b) => b.cases - a.cases) // Sort by cases descending
    }, [trendsData])

    // Get total cases
    const totalCases = useMemo(() => {
        return locationData.reduce((sum, location) => sum + location.cases, 0)
    }, [locationData])

    // ✅ Get current filter description
    const getFilterDescription = () => {
        const parts = []

        if (selectedProvinsi !== 'all') {
            const provinceName = provinsiOptions.find(p => p.kode_provinsi === selectedProvinsi)?.nama_provinsi
            if (provinceName) parts.push(provinceName)
        } else {
            parts.push('Seluruh Indonesia')
        }

        if (selectedYearMode === 'single' && selectedYear !== 'all') {
            parts.push(`Tahun ${selectedYear}`)
        } else if (selectedYearMode === 'range' && startYear !== 'all' && endYear !== 'all') {
            if (startYear === endYear) {
                parts.push(`Tahun ${startYear}`)
            } else {
                parts.push(`Tahun ${startYear}-${endYear}`)
            }
        }

        return parts.join(' - ')
    }

    // ✅ Get available end years based on start year
    const availableEndYears = useMemo(() => {
        if (startYear === 'all') return tahunOptions
        const startYearNum = parseInt(startYear)
        return tahunOptions.filter(year => year >= startYearNum)
    }, [startYear, tahunOptions])

    if (!isMounted) {
        return (
            <div className={`bg-white rounded-lg shadow-lg border border-gray-200 p-6 ${className}`}>
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-12 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`bg-white rounded-lg shadow-lg border border-gray-200 p-6 ${className}`}>
            {/* ✅ Header with collapsible filter */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-black">
                            <IconMapPin className="w-6 h-6 inline mr-2" />
                            Lokasi Kejadian
                            {loading && (
                                <span className="text-sm text-orange-600 ml-2 animate-pulse">🔄</span>
                            )}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Data kejahatan berdasarkan lokasi kejadian
                        </p>

                        {/* ✅ Current filter info */}
                        <div className="mt-2 p-2 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                            <p className="text-sm text-blue-800">
                                <span className="font-medium">  Filter Aktif:</span> {getFilterDescription()}
                                {trendsData && (
                                    <span className="text-xs text-blue-600 ml-2">
                                        • {locationData.length} lokasi
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* ✅ Total cases display */}
                        <div className="text-right">
                            <div className="text-2xl font-bold text-black">
                                {totalCases.toLocaleString('id-ID')}
                            </div>
                            <div className="text-xs text-gray-500">Total Kasus</div>
                        </div>

                        {/* ✅ Filter toggle button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                        >
                            <IconFilter className="w-4 h-4" />
                            <span>Filter</span>
                            {showFilters ? (
                                <IconChevronUp className="w-4 h-4" />
                            ) : (
                                <IconChevronDown className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>

                {/* ✅ Collapsible filter section */}
                {showFilters && (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Provinsi Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Provinsi:
                                </label>
                                <select
                                    value={selectedProvinsi}
                                    onChange={(e) => setSelectedProvinsi(e.target.value)}
                                    disabled={loading}
                                    className={`w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    <option value="all">Seluruh Indonesia</option>
                                    {provinsiOptions.map(provinsi => (
                                        <option key={provinsi.kode_provinsi} value={provinsi.kode_provinsi}>
                                            {provinsi.nama_provinsi}
                                        </option>
                                    ))}
                                </select>
                                {selectedProvinsi !== 'all' && (
                                    <div className="flex items-center mt-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                                        <span className="text-xs text-green-600">Filter aktif</span>
                                    </div>
                                )}
                            </div>

                            {/* ✅ Year Mode Selector */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mode Tahun:
                                </label>
                                <select
                                    value={selectedYearMode}
                                    onChange={(e) => setSelectedYearMode(e.target.value as 'single' | 'range')}
                                    disabled={loading}
                                    className={`w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    <option value="single">Tahun Tunggal</option>
                                    <option value="range">Rentang Tahun</option>
                                </select>
                            </div>

                            {/* ✅ Year Filter - Conditional based on mode */}
                            <div>
                                {selectedYearMode === 'single' ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <IconCalendar className="w-4 h-4 inline mr-1" />
                                            Tahun:
                                        </label>
                                        <select
                                            value={selectedYear}
                                            onChange={(e) => setSelectedYear(e.target.value)}
                                            disabled={loading}
                                            className={`w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                        >
                                            <option value="all">Semua Tahun</option>
                                            {tahunOptions.map(tahun => (
                                                <option key={tahun} value={tahun.toString()}>
                                                    {tahun}
                                                </option>
                                            ))}
                                        </select>
                                        {selectedYear !== 'all' && (
                                            <div className="flex items-center mt-1">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                                                <span className="text-xs text-blue-600">Tahun {selectedYear}</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                        {/* Start Year */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Mulai:
                                            </label>
                                            <select
                                                value={startYear}
                                                onChange={(e) => {
                                                    const newStartYear = e.target.value
                                                    setStartYear(newStartYear)

                                                    // Auto-adjust end year if it's before start year
                                                    if (endYear !== 'all' && newStartYear !== 'all') {
                                                        const startYearNum = parseInt(newStartYear)
                                                        const endYearNum = parseInt(endYear)
                                                        if (endYearNum < startYearNum) {
                                                            setEndYear(newStartYear)
                                                        }
                                                    }
                                                }}
                                                disabled={loading}
                                                className={`w-full text-sm border border-gray-300 rounded-lg px-2 py-2 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                            >
                                                <option value="all">Semua</option>
                                                {tahunOptions.map(tahun => (
                                                    <option key={tahun} value={tahun.toString()}>
                                                        {tahun}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* End Year */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Akhir:
                                            </label>
                                            <select
                                                value={endYear}
                                                onChange={(e) => setEndYear(e.target.value)}
                                                disabled={loading || startYear === 'all'}
                                                className={`w-full text-sm border border-gray-300 rounded-lg px-2 py-2 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${loading || startYear === 'all' ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                            >
                                                <option value="all">Semua</option>
                                                {availableEndYears.map(tahun => (
                                                    <option key={tahun} value={tahun.toString()}>
                                                        {tahun}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {startYear !== 'all' && endYear !== 'all' && (
                                            <div className="col-span-2 flex items-center mt-1">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
                                                <span className="text-xs text-purple-600">
                                                    Rentang {startYear}-{endYear}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Filter summary */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <span className="text-xs text-gray-500">
                                Filter: {getFilterDescription()}
                            </span>
                            {(selectedProvinsi !== 'all' || selectedYear !== 'all' || startYear !== 'all' || endYear !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSelectedProvinsi('all')
                                        setSelectedYear('all')
                                        setStartYear('all')
                                        setEndYear('all')
                                        setSelectedYearMode('single')
                                    }}
                                    className="text-xs text-red-600 hover:text-red-800 underline"
                                >
                                    Reset Filter
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ✅ Location List */}
            <div className="space-y-3">
                {/* ✅ Loading state */}
                {loading && (
                    <div className="flex items-center justify-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-lg font-medium text-gray-700">Memuat data lokasi kejadian...</p>
                            <p className="text-sm text-gray-500 mt-1">Mohon tunggu sebentar</p>
                        </div>
                    </div>
                )}

                {/* ✅ Location list - Only show when not loading */}
                {!loading && locationData.length > 0 && (
                    <>
                        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg border-l-4 border-black">
                            <span className="font-semibold text-black">Lokasi</span>
                            <span className="font-semibold text-black">Jumlah Kasus</span>
                        </div>

                        <div className="max-h-80 overflow-y-auto space-y-2">
                            {locationData.map((location, index) => (
                                <div key={location.name} className="flex items-center justify-between py-3 px-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100 last:border-b-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                            {index + 1}
                                        </div>
                                        <span className="text-gray-800 font-medium">{location.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-lg font-bold text-black">
                                            {location.cases.toLocaleString('id-ID')}
                                        </span>
                                        <div className="text-xs text-gray-500">
                                            {totalCases > 0 ? ((location.cases / totalCases) * 100).toFixed(1) : 0}%
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* ✅ No data state */}
                {!loading && locationData.length === 0 && (
                    <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="text-gray-400 mb-6">
                            <IconMapPin className="mx-auto h-16 w-16" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Data Lokasi Kejadian Tidak Tersedia</h3>
                        <p className="text-gray-500 mb-6">
                            Tidak dapat memuat data untuk filter: {getFilterDescription()}
                        </p>
                        <button
                            onClick={fetchTrendsData}
                            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Muat Ulang Data
                        </button>
                    </div>
                )}
            </div>

            {/* ✅ Summary - Only show when data loaded */}
            {!loading && locationData.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Total Kejadian</span>
                        <span className="text-xl font-bold text-black">
                            {totalCases.toLocaleString('id-ID')} kasus
                        </span>
                    </div>
                    <div className="text-xs text-gray-500 text-right mt-1">
                        {locationData.length} lokasi tercatat
                    </div>
                </div>
            )}
        </div>
    )
}