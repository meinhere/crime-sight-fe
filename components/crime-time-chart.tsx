'use client'

import { useState, useMemo, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'
import { IconFilter, IconChevronDown, IconChevronUp, IconCalendar } from '@tabler/icons-react'
import { API_CONFIG } from '@/data/constants'
import type { Provinsi, MasterProvinsiResponse, MasterTahunResponse } from '@/types/master'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface CrimeTimeChartProps {
    className?: string
}

interface TrendsApiResponse {
    meta: {
        total_records: number
        labels: string[]
        details: {
            waktu_kejadian: Record<string, number>
        }
        filters: {
            provinsi?: string
            start_year?: string
            end_year?: string
        }
    }
    data: {
        waktu_kejadian: Array<{
            label: string
            data: number[]
        }>
    }
}

export function CrimeTimeChart({ className }: CrimeTimeChartProps) {
    // ✅ Filter states
    const [selectedProvinsi, setSelectedProvinsi] = useState('all')
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
    }, [selectedProvinsi, startYear, endYear, isMounted])

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
                const sortedYears = tahunData.data.sort((a, b) => a - b) // Sort ascending for year range
                setTahunOptions(sortedYears)

                // Set default range to min and max year
                if (sortedYears.length > 0) {
                    setStartYear(sortedYears[0].toString())
                    setEndYear(sortedYears[sortedYears.length - 1].toString())
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

            // ✅ Add year range filters
            if (startYear !== 'all') {
                params.append('start_year', startYear)
            }

            if (endYear !== 'all') {
                params.append('end_year', endYear)
            }

            const url = `${API_CONFIG.BASE_URL}/api/trends${params.toString() ? `?${params.toString()}` : ''}`
            console.log('🔗 Crime Time Chart API Request:', url)

            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data: TrendsApiResponse = await response.json()
            console.log('📊 Crime Time Chart API Response:', data)
            setTrendsData(data)

            // Show success toast for filter changes (not initial load)
            if (trendsData && (selectedProvinsi !== 'all' || (startYear !== 'all' && endYear !== 'all'))) {
                const provinceName = provinsiOptions.find(p => p.kode_provinsi === selectedProvinsi)?.nama_provinsi || 'Indonesia'
                const filterParts = [provinceName]

                if (startYear !== 'all' && endYear !== 'all') {
                    if (startYear === endYear) {
                        filterParts.push(`Tahun ${startYear}`)
                    } else {
                        filterParts.push(`Tahun ${startYear}-${endYear}`)
                    }
                }

                const filterInfo = filterParts.join(' - ')

                toast.success(`Data waktu kejadian ${filterInfo} berhasil dimuat`, {
                    description: `${Object.keys(data.meta.details.waktu_kejadian).length} kategori waktu ditemukan`,
                })
            }

        } catch (error) {
            console.error('❌ Crime Time Chart API Error:', error)
            toast.error('Gagal memuat data waktu kejadian', {
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

    // ✅ Process time data from API for chart
    const chartData = useMemo(() => {
        if (!trendsData?.meta.details.waktu_kejadian) {
            return {
                series: [{
                    name: 'Jumlah Kejadian',
                    data: [],
                    color: '#10b981'
                }],
                categories: []
            }
        }

        // ✅ Define time order for better visualization
        const timeOrder = [
            'Dini Hari (00:00 - 05:59)',
            'Pagi (06:00 - 11:59)',
            'Siang (12:00 - 15:59)',
            'Sore (16:00 - 18:59)',
            'Malam (19:00 - 23:59)',
            'Tidak Diketahui'
        ]

        // Sort data according to time order
        const timeEntries = Object.entries(trendsData.meta.details.waktu_kejadian)
        const sortedEntries = timeOrder.map(timeLabel => {
            const entry = timeEntries.find(([time]) => time === timeLabel)
            return entry || [timeLabel, 0]
        })

        // Add any additional time categories not in the predefined order
        timeEntries.forEach(([time, count]) => {
            if (!timeOrder.includes(time)) {
                sortedEntries.push([time, count])
            }
        })

        return {
            series: [{
                name: 'Jumlah Kejadian',
                data: sortedEntries.map(([, count]) => count),
                color: '#10b981'
            }],
            categories: sortedEntries.map(([time]) => {
                // Shorten time labels for better chart display
                return (time as string).replace(/\s*\([^)]*\)/g, '')
            }),
            fullCategories: sortedEntries.map(([time]) => time) // Full names for tooltip
        }
    }, [trendsData])

    // Get total cases
    const totalCases = useMemo(() => {
        if (!trendsData?.meta.details.waktu_kejadian) return 0
        return Object.values(trendsData.meta.details.waktu_kejadian).reduce((sum, count) => sum + count, 0)
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

        if (startYear !== 'all' && endYear !== 'all') {
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

    // ✅ Chart options
    const chartOptions = {
        chart: {
            type: 'line' as const,
            height: 300,
            toolbar: {
                show: false
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800
            }
        },
        stroke: {
            curve: 'smooth' as const,
            width: 3
        },
        markers: {
            size: 6,
            hover: {
                size: 8
            }
        },
        xaxis: {
            categories: chartData.categories,
            labels: {
                style: {
                    colors: '#6b7280',
                    fontSize: '11px'
                },
                rotate: -45
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#6b7280',
                    fontSize: '12px'
                },
                formatter: function (val: number) {
                    return val.toLocaleString('id-ID')
                }
            }
        },
        grid: {
            borderColor: '#e5e7eb',
            strokeDashArray: 3
        },
        tooltip: {
            theme: 'light',
            x: {
                formatter: function (val: any, opts: any) {
                    // Show full time category in tooltip
                    const index = opts.dataPointIndex
                    return chartData.fullCategories?.[index] || chartData.categories[index]
                }
            },
            y: {
                formatter: function (val: number) {
                    return val.toLocaleString('id-ID') + ' kejadian'
                }
            }
        },
        legend: {
            show: false
        },
        colors: ['#10b981']
    }

    if (!isMounted) {
        return (
            <div className={`bg-white rounded-lg shadow-lg border border-gray-200 p-6 ${className}`}>
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
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
                            Waktu Kejadian
                            {loading && (
                                <span className="text-sm text-orange-600 ml-2 animate-pulse">🔄</span>
                            )}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Distribusi kejadian berdasarkan waktu
                        </p>

                        {/* ✅ Current filter info */}
                        <div className="mt-2 p-2 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                            <p className="text-sm text-blue-800">
                                <span className="font-medium">  Filter Aktif:</span> {getFilterDescription()}
                                {trendsData && (
                                    <span className="text-xs text-blue-600 ml-2">
                                        • {Object.keys(trendsData.meta.details.waktu_kejadian).length} kategori waktu
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
                            <div className="text-xs text-gray-500">Total Kejadian</div>
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

                {/* ✅ Collapsible filter section with year range */}
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

                            {/* ✅ Start Year Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <IconCalendar className="w-4 h-4 inline mr-1" />
                                    Tahun Mulai:
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
                                {startYear !== 'all' && (
                                    <div className="flex items-center mt-1">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                                        <span className="text-xs text-blue-600">Mulai dari {startYear}</span>
                                    </div>
                                )}
                            </div>

                            {/* ✅ End Year Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <IconCalendar className="w-4 h-4 inline mr-1" />
                                    Tahun Akhir:
                                </label>
                                <select
                                    value={endYear}
                                    onChange={(e) => setEndYear(e.target.value)}
                                    disabled={loading || startYear === 'all'}
                                    className={`w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${loading || startYear === 'all' ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    <option value="all">Semua Tahun</option>
                                    {availableEndYears.map(tahun => (
                                        <option key={tahun} value={tahun.toString()}>
                                            {tahun}
                                        </option>
                                    ))}
                                </select>
                                {endYear !== 'all' && (
                                    <div className="flex items-center mt-1">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
                                        <span className="text-xs text-purple-600">Sampai {endYear}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Filter summary */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <span className="text-xs text-gray-500">
                                Filter: {getFilterDescription()}
                            </span>
                            {(selectedProvinsi !== 'all' || startYear !== 'all' || endYear !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSelectedProvinsi('all')
                                        setStartYear('all')
                                        setEndYear('all')
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
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                            <p className="text-lg font-medium text-gray-700">Memuat data waktu kejadian...</p>
                            <p className="text-sm text-gray-500 mt-1">Mohon tunggu sebentar</p>
                        </div>
                    </div>
                )}

                {/* ✅ Chart - Show time distribution */}
                {!loading && trendsData && chartData.series[0].data.length > 0 && (
                    <Chart
                        options={chartOptions as any}
                        series={chartData.series as any}
                        type="line"
                        height={300}
                    />
                )}

                {/* ✅ No data state */}
                {!loading && (!trendsData || chartData.series[0].data.length === 0) && (
                    <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="text-gray-400 mb-6">
                            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Data Waktu Kejadian Tidak Tersedia</h3>
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