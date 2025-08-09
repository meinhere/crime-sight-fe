// components/crime-trend-chart.tsx
'use client'

import { useState, useMemo, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'
import { API_CONFIG } from '@/data/constants'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface CrimeTrendChartProps {
    className?: string
}

interface TrendApiResponse {
    meta: {
        total_records: number
        labels: string[]
        statistics: {
            tahun: {
                tertinggi: { tahun: string; jumlah: number }
                terendah: { tahun: string; jumlah: number }
                rata_rata: number
            }
        }
        filters: {
            provinsi?: string
            tahun: string
        }
    }
    data: {
        tahun: number[]
    }
}

export function CrimeTrendChart({ className }: CrimeTrendChartProps) {
    const [isMounted, setIsMounted] = useState(false)
    const [trendData, setTrendData] = useState<TrendApiResponse | null>(null)
    const [loading, setLoading] = useState(true) // Start with loading true

    // Fix hydration issue
    useEffect(() => {
        setIsMounted(true)
    }, [])

    // ✅ Fetch trend data from API - no filters, all data
    const fetchTrendData = async () => {
        setLoading(true)
        try {
            // ✅ No parameters - fetch all data for all provinces and all years
            const url = `${API_CONFIG.BASE_URL}/api/trends`
            console.log('🔗 Trend API Request (All Data):', url)

            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data: TrendApiResponse = await response.json()
            console.log('📊 Trend API Response (All Data):', data)
            setTrendData(data)

            // Show success message on first load
            toast.success('Data trend kejahatan Indonesia berhasil dimuat', {
                description: `${data.meta.total_records.toLocaleString('id-ID')} total kasus • ${data.meta.labels.length} tahun data`,
            })

        } catch (error) {
            console.error('❌ Trend API Error:', error)
            toast.error('Gagal memuat data trend', {
                description: error instanceof Error ? error.message : 'Terjadi kesalahan',
                action: {
                    label: 'Coba Lagi',
                    onClick: () => fetchTrendData()
                }
            })
        } finally {
            setLoading(false)
        }
    }

    // ✅ Fetch data on component mount only
    useEffect(() => {
        if (isMounted) {
            fetchTrendData()
        }
    }, [isMounted])

    // ✅ Prepare chart data
    const chartData = useMemo(() => {
        if (!trendData) {
            return {
                series: [{
                    name: 'Total Kasus Kejahatan',
                    data: [],
                    color: '#000000'
                }],
                categories: []
            }
        }

        return {
            series: [{
                name: 'Total Kasus Kejahatan Indonesia',
                data: trendData.data.tahun,
                color: '#000000'
            }],
            categories: trendData.meta.labels
        }
    }, [trendData])

    // Safe number formatting function
    const formatNumber = (num: number) => {
        if (!isMounted) return num.toString()
        return num.toLocaleString('id-ID')
    }

    // ✅ Enhanced chart options
    const chartOptions = {
        chart: {
            type: 'line' as const,
            height: 450,
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: false,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                }
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800
            }
        },
        stroke: {
            curve: 'smooth' as const,
            width: 4
        },
        markers: {
            size: 8,
            hover: {
                size: 12
            }
        },
        xaxis: {
            categories: chartData.categories,
            title: {
                text: 'Tahun',
                style: {
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#374151'
                }
            },
            labels: {
                style: {
                    colors: '#6b7280',
                    fontSize: '14px',
                    fontWeight: 500
                }
            }
        },
        yaxis: {
            title: {
                text: 'Jumlah Kasus',
                style: {
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#374151'
                }
            },
            labels: {
                style: {
                    colors: '#6b7280',
                    fontSize: '14px'
                },
                formatter: function (val: number) {
                    return formatNumber(Math.round(val))
                }
            }
        },
        grid: {
            borderColor: '#e5e7eb',
            strokeDashArray: 3
        },
        tooltip: {
            theme: 'light',
            y: {
                formatter: function (val: number) {
                    return formatNumber(val) + ' kasus'
                }
            }
        },
        legend: {
            position: 'top' as const,
            horizontalAlign: 'left' as const,
            fontSize: '14px',
            fontWeight: 600,
            labels: {
                colors: '#374151'
            }
        }
    }

    // ✅ Loading state - don't overlap other components
    if (!isMounted) {
        return (
            <div className={`bg-white rounded-lg shadow-lg border border-gray-200 p-6 ${className}`}>
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
                    <div className="h-96 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    return (
        <div className={`bg-white rounded-lg shadow-lg border border-gray-200 p-6 ${className}`}>
            {/* ✅ Simplified Header - No Filters */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-black">
                    Tren Kejahatan Indonesia
                    {loading && (
                        <span className="text-sm text-orange-600 ml-2 animate-pulse">🔄</span>
                    )}
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                    Analisis perkembangan total kasus kejahatan seluruh Indonesia dari tahun ke tahun
                </p>

                {/* ✅ Data Info */}
                {trendData && !loading && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <p className="text-sm text-blue-800">
                            <span className="font-semibold">📊 Data Lengkap:</span> Seluruh Indonesia •
                            Periode {trendData.meta.labels[0]} - {trendData.meta.labels[trendData.meta.labels.length - 1]} •
                            {trendData.meta.total_records.toLocaleString('id-ID')} total kasus
                        </p>
                    </div>
                )}
            </div>

            {/* ✅ Fixed Chart Container - No Overlapping */}
            <div className="w-full">
                {/* ✅ Loading state - Takes proper space, doesn't overlap */}
                {loading && (
                    <div className="flex items-center justify-center py-24 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                            <p className="text-lg font-medium text-gray-700">Memuat data trend Indonesia...</p>
                            <p className="text-sm text-gray-500 mt-1">Mohon tunggu sebentar</p>
                        </div>
                    </div>
                )}

                {/* ✅ Chart - Only show when not loading */}
                {!loading && trendData && (
                    <Chart
                        options={chartOptions}
                        series={chartData.series}
                        type="line"
                        height={450}
                    />
                )}

                {/* ✅ No data state - Only show when not loading and no data */}
                {!loading && !trendData && (
                    <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="text-gray-400 mb-6">
                            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Data Trend Tidak Tersedia</h3>
                        <p className="text-gray-500 mb-6">Tidak dapat memuat data trend kejahatan</p>
                        <button
                            onClick={fetchTrendData}
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

            {/* ✅ Enhanced Summary Stats from API - Only show when data loaded */}
            {!loading && trendData && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8 pt-6 border-t border-gray-200">
                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="text-2xl font-bold text-red-900">
                            {formatNumber(trendData.meta.statistics.tahun.tertinggi.jumlah)}
                        </div>
                        <div className="text-sm text-red-700 mt-1 font-medium">Puncak Tertinggi</div>
                        <div className="text-xs text-red-600 mt-1">
                            Tahun {trendData.meta.statistics.tahun.tertinggi.tahun}
                        </div>
                    </div>

                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-2xl font-bold text-green-900">
                            {formatNumber(trendData.meta.statistics.tahun.terendah.jumlah)}
                        </div>
                        <div className="text-sm text-green-700 mt-1 font-medium">Terendah</div>
                        <div className="text-xs text-green-600 mt-1">
                            Tahun {trendData.meta.statistics.tahun.terendah.tahun}
                        </div>
                    </div>

                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-2xl font-bold text-blue-900">
                            {formatNumber(Math.round(trendData.meta.statistics.tahun.rata_rata))}
                        </div>
                        <div className="text-sm text-blue-700 mt-1 font-medium">Rata-rata</div>
                        <div className="text-xs text-blue-600 mt-1">Per tahun</div>
                    </div>

                    <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="text-2xl font-bold text-purple-900">
                            {formatNumber(trendData.meta.total_records)}
                        </div>
                        <div className="text-sm text-purple-700 mt-1 font-medium">Total Keseluruhan</div>
                        <div className="text-xs text-purple-600 mt-1">
                            {trendData.meta.labels.length} tahun data
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}