'use client'

import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { districtsData } from '@/data/districts-data'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface CrimeTypeTrendProps {
    className?: string
}

export function CrimeTypeTrend({ className }: CrimeTypeTrendProps) {
    // Aggregate data untuk semua jenis kejahatan
    const crimeTypeData = useMemo(() => {
        const aggregated = {
            pencurian: 0,
            korupsi: 0,
            suap: 0, // placeholder
            narkotika: 0,
            terorisme: 0, // placeholder
            penyelundupan: 0 // placeholder
        }

        // Aggregate dari semua kabupaten di Madura
        districtsData.forEach(district => {
            aggregated.pencurian += district.crimeTypes.pencurian
            aggregated.korupsi += district.crimeTypes.korupsi
            aggregated.narkotika += district.crimeTypes.narkotika
            // Tambahkan data dummy untuk jenis lainnya
            aggregated.suap += Math.floor(district.crimeTypes.korupsi * 0.3)
            aggregated.terorisme += Math.floor(district.crimeTypes.penganiayaan * 0.2)
            aggregated.penyelundupan += Math.floor(district.crimeTypes.penggelapan * 0.4)
        })

        return aggregated
    }, [])

    const chartData = {
        series: [{
            name: 'Jumlah Kasus',
            data: [
                crimeTypeData.pencurian,
                crimeTypeData.korupsi,
                crimeTypeData.suap,
                crimeTypeData.narkotika,
                crimeTypeData.terorisme,
                crimeTypeData.penyelundupan
            ],
            color: '#ec4899'
        }],
        categories: ['Pencurian', 'Korupsi', 'Suap', 'Narkotika', 'Terorisme', 'Penyelundupan']
    }

    const chartOptions = {
        chart: {
            type: 'line' as const,
            height: 280,
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
                    return val + ' kasus'
                }
            }
        },
        legend: {
            show: false
        }
    }

    return (
        <div className={`bg-white rounded-lg shadow-lg border border-gray-200 p-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-black">Jenis Kriminal</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Distribusi berdasarkan jenis kejahatan
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-black">
                        {Object.values(crimeTypeData).reduce((a, b) => a + b, 0)}
                    </div>
                    <div className="text-xs text-gray-500">Total Kasus</div>
                </div>
            </div>

            {/* Chart */}
            <div className="w-full">
                <Chart
                    options={chartOptions}
                    series={chartData.series}
                    type="line"
                    height={280}
                />
            </div>

            {/* Crime Type Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-pink-50 rounded-lg">
                    <div className="text-lg font-bold text-pink-700">
                        {Math.max(...chartData.series[0].data)}
                    </div>
                    <div className="text-xs text-pink-600">Tertinggi</div>
                    <div className="text-xs text-pink-500">
                        {chartData.categories[chartData.series[0].data.indexOf(Math.max(...chartData.series[0].data))]}
                    </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-700">
                        {Math.min(...chartData.series[0].data)}
                    </div>
                    <div className="text-xs text-gray-600">Terendah</div>
                    <div className="text-xs text-gray-500">
                        {chartData.categories[chartData.series[0].data.indexOf(Math.min(...chartData.series[0].data))]}
                    </div>
                </div>
            </div>
        </div>
    )
}