// components/regional-cases.tsx
'use client'

import { useState, useMemo, useEffect } from 'react'
import { toast } from 'sonner'
import { IconFilter, IconChevronDown, IconChevronUp, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { API_CONFIG } from '@/data/constants'
import type { Provinsi, MasterProvinsiResponse, MasterTahunResponse } from '@/types/master'

interface RegionalCasesProps {
    className?: string
}

interface TrendsApiResponse {
    meta: {
        total_records: number
        labels: string[]
        details: {
            wilayah: Record<string, number>
        }
        filters: {
            provinsi?: string
            start_year?: string
            end_year?: string
        }
    }
    data: {
        wilayah: Array<{
            label: string
            data: number[]
        }>
    }
}

export function RegionalCases({ className }: RegionalCasesProps) {
    // ✅ Filter states - provinsi and tahun
    const [selectedProvinsi, setSelectedProvinsi] = useState('all')
    const [selectedTahun, setSelectedTahun] = useState('all')
    const [showFilters, setShowFilters] = useState(false)

    // ✅ Pagination states
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

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
            setCurrentPage(1) // Reset to first page when filter changes
            fetchTrendsData()
        }
    }, [selectedProvinsi, selectedTahun, isMounted])

    // ✅ Fetch master provinsi and tahun data
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
                setTahunOptions(tahunData.data.sort((a, b) => b - a)) // Sort descending
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

            // ✅ Add tahun filter with start_year and end_year
            if (selectedTahun !== 'all') {
                // If specific year selected, set both start_year and end_year to the same value
                params.append('start_year', selectedTahun)
                params.append('end_year', selectedTahun)
            }

            const url = `${API_CONFIG.BASE_URL}/api/trends${params.toString() ? `?${params.toString()}` : ''}`
            console.log('🔗 Regional Cases API Request:', url)

            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data: TrendsApiResponse = await response.json()
            console.log('📊 Regional Cases API Response:', data)
            setTrendsData(data)

            // Show success toast for filter changes (not initial load)
            if (trendsData && (selectedProvinsi !== 'all' || selectedTahun !== 'all')) {
                const provinceName = provinsiOptions.find(p => p.kode_provinsi === selectedProvinsi)?.nama_provinsi || 'Indonesia'
                const filterParts = [provinceName]

                if (selectedTahun !== 'all') {
                    filterParts.push(`Tahun ${selectedTahun}`)
                }

                const filterInfo = filterParts.join(' - ')

                toast.success(`Data wilayah ${filterInfo} berhasil dimuat`, {
                    description: `${Object.keys(data.meta.details.wilayah).length} wilayah ditemukan`,
                })
            }

        } catch (error) {
            console.error('❌ Regional Cases API Error:', error)
            toast.error('Gagal memuat data regional', {
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

    // ✅ Process regional data from API
    const allRegionalData = useMemo(() => {
        if (!trendsData?.meta.details.wilayah) return []

        return Object.entries(trendsData.meta.details.wilayah)
            .map(([wilayah, jumlah]) => ({
                name: wilayah,
                totalCases: jumlah
            }))
            .sort((a, b) => b.totalCases - a.totalCases)
    }, [trendsData])

    // ✅ Pagination logic
    const totalPages = Math.ceil(allRegionalData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentPageData = allRegionalData.slice(startIndex, endIndex)

    // ✅ Get current filter description
    const getFilterDescription = () => {
        const parts = []

        if (selectedProvinsi !== 'all') {
            const provinceName = provinsiOptions.find(p => p.kode_provinsi === selectedProvinsi)?.nama_provinsi
            if (provinceName) parts.push(provinceName)
        } else {
            parts.push('Seluruh Indonesia')
        }

        if (selectedTahun !== 'all') {
            parts.push(`Tahun ${selectedTahun}`)
        }

        return parts.join(' - ')
    }

    // ✅ Pagination component
    const PaginationControls = () => {
        if (totalPages <= 1) return null

        return (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                    Menampilkan {startIndex + 1}-{Math.min(endIndex, allRegionalData.length)} dari {allRegionalData.length} wilayah
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg border transition-colors ${currentPage === 1
                            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <IconChevronLeft className="w-4 h-4" />
                        <span>Sebelumnya</span>
                    </button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 text-sm rounded-lg transition-colors ${currentPage === page
                                    ? 'bg-black text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg border transition-colors ${currentPage === totalPages
                            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <span>Selanjutnya</span>
                        <IconChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        )
    }

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
                            Jumlah Kasus
                            {loading && (
                                <span className="text-sm text-orange-600 ml-2 animate-pulse">🔄</span>
                            )}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Data kejahatan per wilayah
                        </p>

                        {/* ✅ Current filter info */}
                        <div className="mt-2 p-2 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                            <p className="text-sm text-blue-800">
                                <span className="font-medium">📍 Filter Aktif:</span> {getFilterDescription()}
                                {trendsData && (
                                    <span className="text-xs text-blue-600 ml-2">
                                        • {Object.keys(trendsData.meta.details.wilayah).length} wilayah
                                    </span>
                                )}
                            </p>
                        </div>
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

                {/* ✅ Collapsible filter section - Provinsi & Tahun */}
                {showFilters && (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                            {/* ✅ Tahun Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tahun:
                                </label>
                                <select
                                    value={selectedTahun}
                                    onChange={(e) => setSelectedTahun(e.target.value)}
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
                                {selectedTahun !== 'all' && (
                                    <div className="flex items-center mt-1">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                                        <span className="text-xs text-blue-600">Filter aktif</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Filter summary */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <span className="text-xs text-gray-500">
                                Filter: {getFilterDescription()}
                            </span>
                            {(selectedProvinsi !== 'all' || selectedTahun !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSelectedProvinsi('all')
                                        setSelectedTahun('all')
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

            {/* ✅ Regional List */}
            <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg border-l-4 border-black">
                    <span className="font-semibold text-black">Wilayah</span>
                    <span className="font-semibold text-black">Jumlah Kasus</span>
                </div>

                {/* ✅ Loading state */}
                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-2"></div>
                            <p className="text-sm text-gray-600">Memuat data wilayah...</p>
                        </div>
                    </div>
                )}

                {/* ✅ Paginated regional data */}
                {!loading && currentPageData.length > 0 && currentPageData.map((region, index) => {
                    const globalIndex = startIndex + index + 1
                    return (
                        <div
                            key={region.name}
                            className="flex items-center justify-between py-3 px-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100 last:border-b-0"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                    {globalIndex}
                                </div>
                                <span className="text-gray-800 font-medium">{region.name}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-bold text-black">
                                    {region.totalCases.toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                    )
                })}

                {/* ✅ No data state */}
                {!loading && allRegionalData.length === 0 && (
                    <div className="text-center py-8">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">Data Tidak Ditemukan</h4>
                        <p className="text-gray-500 mb-4">
                            Tidak ada data untuk filter: {getFilterDescription()}
                        </p>
                        <button
                            onClick={fetchTrendsData}
                            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                        >
                            Muat Ulang
                        </button>
                    </div>
                )}

                {/* ✅ Pagination Controls */}
                {!loading && allRegionalData.length > 0 && (
                    <PaginationControls />
                )}
            </div>
        </div>
    )
}