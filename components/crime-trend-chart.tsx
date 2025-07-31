'use client'

import { useState, useMemo, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { yearlyTrendData, yearRangeOptions } from '@/data/districts-data'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface CrimeTrendChartProps {
    className?: string
}

export function CrimeTrendChart({ className }: CrimeTrendChartProps) {
    const [selectedYearRange, setSelectedYearRange] = useState('5')
    const [startYear, setStartYear] = useState(2020)
    const [endYear, setEndYear] = useState(2025)
    const [isMounted, setIsMounted] = useState(false)

    // Fix hydration issue
    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Filter data berdasarkan range tahun
    const filteredData = useMemo(() => {
        let data = [...yearlyTrendData]
        const currentYear = new Date().getFullYear()

        if (selectedYearRange === '3') {
            data = data.filter(item => item.year >= currentYear - 2)
        } else if (selectedYearRange === '5') {
            data = data.filter(item => item.year >= currentYear - 4)
        } else if (selectedYearRange === 'custom') {
            data = data.filter(item => item.year >= startYear && item.year <= endYear)
        }

        return data.sort((a, b) => a.year - b.year)
    }, [selectedYearRange, startYear, endYear])

    // Prepare chart data - hanya total kasus per tahun
    const chartData = useMemo(() => {
        const years = filteredData.map(item => item.year.toString())
        const totalCases = filteredData.map(item => item.totalCases)

        return {
            series: [{
                name: 'Total Kasus Kejahatan',
                data: totalCases,
                color: '#000000'
            }],
            categories: years
        }
    }, [filteredData])

    // Safe number formatting function
    const formatNumber = (num: number) => {
        if (!isMounted) return num.toString()
        return num.toLocaleString('id-ID')
    }

    const chartOptions = {
        chart: {
            type: 'line' as const,
            height: 400,
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset: false
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
                size: 10
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
                    return formatNumber(val)
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
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-black">Tren Kriminal Indonesia</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Analisis perkembangan total kasus kejahatan dari tahun ke tahun
                    </p>
                </div>

                {/* Year Range Filter */}
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">Periode:</label>
                    <select
                        value={selectedYearRange}
                        onChange={(e) => setSelectedYearRange(e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-4 py-2 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors min-w-[160px]"
                    >
                        {yearRangeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Custom Range Inputs */}
            {selectedYearRange === 'custom' && (
                <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Dari Tahun:</label>
                        <input
                            type="number"
                            min="2020"
                            max="2025"
                            value={startYear}
                            onChange={(e) => setStartYear(parseInt(e.target.value))}
                            className="w-24 text-sm border border-gray-300 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Sampai Tahun:</label>
                        <input
                            type="number"
                            min="2020"
                            max="2025"
                            value={endYear}
                            onChange={(e) => setEndYear(parseInt(e.target.value))}
                            className="w-24 text-sm border border-gray-300 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                </div>
            )}

            {/* Chart */}
            <div className="w-full">
                <Chart
                    options={chartOptions}
                    series={chartData.series}
                    type="line"
                    height={400}
                />
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                    <div className="text-2xl font-bold text-black">
                        {filteredData.length > 0 ? formatNumber(Math.max(...chartData.series[0].data)) : 0}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Puncak Tertinggi</div>
                    <div className="text-xs text-gray-500">
                        Tahun {filteredData.length > 0 ? filteredData[chartData.series[0].data.indexOf(Math.max(...chartData.series[0].data))].year : '-'}
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-black">
                        {filteredData.length > 0 ? formatNumber(Math.min(...chartData.series[0].data)) : 0}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Terendah</div>
                    <div className="text-xs text-gray-500">
                        Tahun {filteredData.length > 0 ? filteredData[chartData.series[0].data.indexOf(Math.min(...chartData.series[0].data))].year : '-'}
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-black">
                        {filteredData.length > 0 ? formatNumber(Math.round(chartData.series[0].data.reduce((a, b) => a + b, 0) / chartData.series[0].data.length)) : 0}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Rata-rata</div>
                    <div className="text-xs text-gray-500">Per tahun</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-black">
                        {filteredData.length > 0 ? formatNumber(chartData.series[0].data.reduce((a, b) => a + b, 0)) : 0}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Total Keseluruhan</div>
                    <div className="text-xs text-gray-500">
                        {filteredData.length} tahun
                    </div>
                </div>
            </div>
        </div>
    )
}