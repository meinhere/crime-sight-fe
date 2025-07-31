'use client'

import { useState, useMemo } from 'react'
import { districtsData, regionOptions } from '@/data/districts-data'
import { IconFilter } from '@tabler/icons-react'

interface RegionalCasesProps {
    className?: string
}

export function RegionalCases({ className }: RegionalCasesProps) {
    const [selectedRegion, setSelectedRegion] = useState('jawa-timur')

    // Data regional dengan total kasus
    const regionalData = useMemo(() => {
        if (selectedRegion === 'jawa-timur') {
            // Data untuk Jawa Timur (Kabupaten Madura)
            return [
                {
                    name: 'Kabupaten Bangkalan',
                    totalCases: districtsData.find(d => d.id === 'bangkalan')?.totalCases || 0
                },
                {
                    name: 'Kabupaten Sampang',
                    totalCases: districtsData.find(d => d.id === 'sampang')?.totalCases || 0
                },
                {
                    name: 'Kabupaten Pamekasan',
                    totalCases: districtsData.find(d => d.id === 'pamekasan')?.totalCases || 0
                },
                {
                    name: 'Kabupaten Sumenep',
                    totalCases: districtsData.find(d => d.id === 'sumenep')?.totalCases || 0
                }
            ].sort((a, b) => b.totalCases - a.totalCases)
        }

        // Default data untuk tampilan umum
        return [
            { name: 'Jawa Timur', totalCases: 97 },
            { name: 'Jawa Barat', totalCases: 85 },
            { name: 'Jawa Tengah', totalCases: 72 },
            { name: 'Sumatera Utara', totalCases: 64 },
            { name: 'Bali', totalCases: 45 }
        ]
    }, [selectedRegion])

    const totalCases = regionalData.reduce((sum, region) => sum + region.totalCases, 0)

    return (
        <div className={`bg-white rounded-lg shadow-lg border border-gray-200 p-6 ${className}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-xl font-bold text-black">Jumlah Kasus</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Data kejahatan per wilayah
                    </p>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                    <IconFilter className="w-4 h-4 text-gray-500" />
                    <select
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                    >
                        <option value="jawa-timur">Jawa Timur</option>
                        <option value="all">Seluruh Indonesia</option>
                    </select>
                </div>
            </div>

            {/* Regional List */}
            <div className="space-y-3">
                <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg border-l-4 border-black">
                    <span className="font-semibold text-black">Wilayah</span>
                    <span className="font-semibold text-black">Jumlah Kasus</span>
                </div>

                {regionalData.map((region, index) => (
                    <div key={region.name} className="flex items-center justify-between py-3 px-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                {index + 1}
                            </div>
                            <span className="text-gray-800 font-medium">{region.name}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-lg font-bold text-black">
                                {region.totalCases.toLocaleString('id-ID')}
                            </span>
                            <div className="text-xs text-gray-500">
                                {((region.totalCases / totalCases) * 100).toFixed(1)}%
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Total Keseluruhan</span>
                    <span className="text-xl font-bold text-black">
                        {totalCases.toLocaleString('id-ID')} kasus
                    </span>
                </div>
            </div>
        </div>
    )
}