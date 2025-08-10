'use client'

import { useState, useMemo, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'
import { IconFilter, IconChevronDown, IconChevronUp } from '@tabler/icons-react'
import { API_CONFIG } from '@/data/constants'
import type { Provinsi, MasterProvinsiResponse, MasterTahunResponse, MasterJenisKejahatanResponse } from '@/types/master'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface CrimeTypeTrendProps {
    className?: string
}

interface TrendsApiResponse {
    meta: {
        total_records: number
        labels: string[]
        details: {
            jenis_kejahatan: Record<string, number>
        }
        statistics: {
            jenis_kejahatan: {
                tertinggi: { jenis: string; jumlah: number }
                terendah: { jenis: string; jumlah: number }
                rata_rata: number
            }
        }
        filters: {
            provinsi?: string
            start_year?: string
            end_year?: string
        }
    }
    data: {
        jenis_kejahatan: Array<{
            label: string
            data: number[]
        }>
    }
}

export function CrimeTypeTrend({ className }: CrimeTypeTrendProps) {
    // ✅ Filter states - Only provinsi and tahun
    const [selectedProvinsi, setSelectedProvinsi] = useState('all')
    const [selectedTahun, setSelectedTahun] = useState('all')
    const [showFilters, setShowFilters] = useState(false)

    // ✅ Data states
    const [trendsData, setTrendsData] = useState<TrendsApiResponse | null>(null)
    const [provinsiOptions, setProvinsiOptions] = useState<Provinsi[]>([])
    const [tahunOptions, setTahunOptions] = useState<number[]>([])
    const [jenisKejahatanMaster, setJenisKejahatanMaster] = useState<string[]>([])
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
    }, [selectedProvinsi, selectedTahun, isMounted])

    // ✅ Fetch master data for dropdowns and validation
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

            // ✅ Fetch jenis kejahatan master data for validation only
            const jenisKejahatanResponse = await fetch(`${API_CONFIG.BASE_URL}/api/master/jenis-kejahatan`)
            if (jenisKejahatanResponse.ok) {
                const jenisKejahatanData: MasterJenisKejahatanResponse = await jenisKejahatanResponse.json()
                setJenisKejahatanMaster(jenisKejahatanData.data)
            }
        } catch (error) {
            console.error('❌ Failed to fetch master data:', error)
        }
    }

    // ✅ Fetch trends data based on filters (no jenis kejahatan filter)
    const fetchTrendsData = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()

            // Add provinsi filter
            if (selectedProvinsi !== 'all') {
                params.append('provinsi', selectedProvinsi)
            }

            // Add tahun filter with start_year and end_year
            if (selectedTahun !== 'all') {
                params.append('start_year', selectedTahun)
                params.append('end_year', selectedTahun)
            }

            const url = `${API_CONFIG.BASE_URL}/api/trends${params.toString() ? `?${params.toString()}` : ''}`
            console.log('🔗 Crime Type Trend API Request:', url)

            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data: TrendsApiResponse = await response.json()
            console.log('📊 Crime Type Trend API Response:', data)
            setTrendsData(data)

            // Show success toast for filter changes (not initial load)
            if (trendsData && (selectedProvinsi !== 'all' || selectedTahun !== 'all')) {
                const provinceName = provinsiOptions.find(p => p.kode_provinsi === selectedProvinsi)?.nama_provinsi || 'Indonesia'
                const filterParts = [provinceName]

                if (selectedTahun !== 'all') {
                    filterParts.push(`Tahun ${selectedTahun}`)
                }

                const filterInfo = filterParts.join(' - ')

                toast.success(`Data jenis kejahatan ${filterInfo} berhasil dimuat`, {
                    description: `${Object.keys(data.meta.details.jenis_kejahatan).length} jenis kejahatan ditemukan`,
                })
            }

        } catch (error) {
            console.error('❌ Crime Type Trend API Error:', error)
            toast.error('Gagal memuat data jenis kejahatan', {
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

    // ✅ Process ALL crime type data from API for chart
    const chartData = useMemo(() => {
        if (!trendsData?.meta.details.jenis_kejahatan) {
            return {
                series: [{
                    name: 'Jumlah Kasus',
                    data: [],
                    color: '#ec4899'
                }],
                categories: []
            }
        }

        // ✅ Show ALL crime types, validate against master data
        const validCrimeTypes = Object.entries(trendsData.meta.details.jenis_kejahatan)
            .filter(([jenis]) => {
                // Only include if it's in master data, or show all if master not loaded
                return jenisKejahatanMaster.length === 0 || jenisKejahatanMaster.includes(jenis)
            })
            .sort(([, a], [, b]) => b - a) // Sort by total cases descending

        return {
            series: [{
                name: 'Jumlah Kasus',
                data: validCrimeTypes.map(([, total]) => total),
                color: '#ec4899'
            }],
            categories: validCrimeTypes.map(([jenis]) => {
                // Truncate long crime type names for better display
                return jenis.length > 25 ? jenis.substring(0, 25) + '...' : jenis
            }),
            fullCategories: validCrimeTypes.map(([jenis]) => jenis) // Full names for tooltip
        }
    }, [trendsData, jenisKejahatanMaster])

    // Get total cases
    const totalCases = useMemo(() => {
        if (!trendsData?.meta.details.jenis_kejahatan) return 0
        return Object.values(trendsData.meta.details.jenis_kejahatan).reduce((sum, count) => sum + count, 0)
    }, [trendsData])

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

    // ✅ Chart options - adjusted for showing all crime types
    const chartOptions = {
        chart: {
            type: 'bar' as const,
            height: Math.max(320, chartData.categories.length * 30), // Dynamic height based on data
            toolbar: {
                show: false
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800
            }
        },
        plotOptions: {
            bar: {
                horizontal: true, // Horizontal bars for better crime type name display
                borderRadius: 4,
                dataLabels: {
                    position: 'center'
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val: number) {
                // Only show data labels for values > 0
                return val > 0 ? val.toLocaleString('id-ID') : ''
            },
            style: {
                colors: ['#fff'],
                fontSize: '10px',
                fontWeight: 'bold'
            }
        },
        xaxis: {
            categories: chartData.categories,
            labels: {
                style: {
                    colors: '#6b7280',
                    fontSize: '12px'
                },
                formatter: function (val: string) {
                    return Number(val).toLocaleString('id-ID')
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#6b7280',
                    fontSize: '10px'
                },
                maxWidth: 150 // Limit label width
            }
        },
        grid: {
            borderColor: '#e5e7eb',
            strokeDashArray: 3
        },
        tooltip: {
            theme: 'light',
            y: {
                formatter: function (val: number, opts: any) {
                    // Show full crime type name in tooltip
                    const index = opts.dataPointIndex
                    const fullName = chartData.fullCategories?.[index] || chartData.categories[index]
                    return `${fullName}: ${val.toLocaleString('id-ID')} kasus`
                }
            }
        },
        legend: {
            show: false
        },
        colors: ['#ec4899']
    }

    if (!isMounted) {
        return (
            <div className={`bg-white rounded-lg shadow-lg border border-gray-200 p-6 ${className}`}>
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded mb-4"></div>
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
                            Jenis Kriminal
                            {loading && (
                                <span className="text-sm text-orange-600 ml-2 animate-pulse">🔄</span>
                            )}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Distribusi semua jenis kejahatan
                        </p>

                        {/* ✅ Current filter info */}
                        <div className="mt-2 p-2 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                            <p className="text-sm text-blue-800">
                                <span className="font-medium">📍 Filter Aktif:</span> {getFilterDescription()}
                                {trendsData && (
                                    <span className="text-xs text-blue-600 ml-2">
                                        • {Object.keys(trendsData.meta.details.jenis_kejahatan).length} jenis kejahatan
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

                {/* ✅ Collapsible filter section - Only 2 filters */}
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

                            {/* Tahun Filter */}
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

            {/* ✅ Chart Container */}
            <div className="w-full">
                {/* ✅ Loading state */}
                {loading && (
                    <div className="flex items-center justify-center py-24 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                            <p className="text-lg font-medium text-gray-700">Memuat data jenis kejahatan...</p>
                            <p className="text-sm text-gray-500 mt-1">Mohon tunggu sebentar</p>
                        </div>
                    </div>
                )}

                {/* ✅ Chart - Show all crime types */}
                {!loading && trendsData && chartData.series[0].data.length > 0 && (
                    <div className="max-h-96 overflow-y-auto">
                        <Chart
                            options={chartOptions}
                            series={chartData.series}
                            type="bar"
                            height={Math.max(320, chartData.categories.length * 30)}
                        />
                    </div>
                )}

                {/* ✅ No data state */}
                {!loading && (!trendsData || chartData.series[0].data.length === 0) && (
                    <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="text-gray-400 mb-6">
                            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Data Jenis Kejahatan Tidak Tersedia</h3>
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
        </div>
    )
}