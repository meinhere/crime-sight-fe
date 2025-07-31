'use client'

import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { districtsData } from '@/data/districts-data'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface CrimeTimeChartProps {
    className?: string
}

export function CrimeTimeChart({ className }: CrimeTimeChartProps) {
    // Data waktu kejadian
    const timeData = useMemo(() => {
        // Aggregate data dari semua kabupaten
        const timeDistribution = {
            pagi: 0,
            siang: 0,
            sore: 0,
            malam: 0,
            tidakDiketahui: 0,
            blank: 0
        }

        // Generate data berdasarkan total kasus
        districtsData.forEach(district => {
            const total = district.totalCases
            // Distribusi waktu berdasarkan pola umum kejahatan
            timeDistribution.pagi += Math.floor(total * 0.15)
            timeDistribution.siang += Math.floor(total * 0.25)
            timeDistribution.sore += Math.floor(total * 0.30)
            timeDistribution.malam += Math.floor(total * 0.20)
            timeDistribution.tidakDiketahui += Math.floor(total * 0.08)
            timeDistribution.blank += Math.floor(total * 0.02)
        })

        return timeDistribution
    }, [])

    const chartData = {
        series: [{
            name: 'Jumlah Kejadian',
            data: [
                timeData.pagi,
                timeData.siang,
                timeData.sore,
                timeData.malam,
                timeData.tidakDiketahui,
                timeData.blank
            ],
            color: '#10b981'
        }],
        categories: ['Pagi', 'Siang', 'Sore', 'Malam', 'Tidak diketahui', 'Blank']
    }

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
                    fontSize: '12px'
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#6b7280',
                    fontSize: '12px'
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
                    return val.toLocaleString('id-ID') + ' kejadian'
                }
            }
        },
        legend: {
            show: false
        }
    }

    const totalCases = Object.values(timeData).reduce((a, b) => a + b, 0)

    return (
        <div className={`bg-white rounded-lg shadow-lg border border-gray-200 p-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-black">Waktu Kejadian</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Distribusi kejadian berdasarkan waktu
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-black">
                        {totalCases.toLocaleString('id-ID')}
                    </div>
                    <div className="text-xs text-gray-500">Total Kejadian</div>
                </div>
            </div>

            {/* Chart */}
            <div className="w-full">
                <Chart
                    options={chartOptions}
                    series={chartData.series}
                    type="line"
                    height={300}
                />
            </div>

            {/* Time Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-700">
                        {Math.max(...chartData.series[0].data).toLocaleString('id-ID')}
                    </div>
                    <div className="text-xs text-green-600">Puncak Tertinggi</div>
                    <div className="text-xs text-green-500">
                        {chartData.categories[chartData.series[0].data.indexOf(Math.max(...chartData.series[0].data))]}
                    </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-700">
                        {Math.min(...chartData.series[0].data).toLocaleString('id-ID')}
                    </div>
                    <div className="text-xs text-gray-600">Terendah</div>
                    <div className="text-xs text-gray-500">
                        {chartData.categories[chartData.series[0].data.indexOf(Math.min(...chartData.series[0].data))]}
                    </div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-700">
                        {Math.round(chartData.series[0].data.reduce((a, b) => a + b, 0) / chartData.series[0].data.length).toLocaleString('id-ID')}
                    </div>
                    <div className="text-xs text-blue-600">Rata-rata</div>
                    <div className="text-xs text-blue-500">Per waktu</div>
                </div>
            </div>
        </div>
    )
}