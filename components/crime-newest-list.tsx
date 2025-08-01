'use client'

import { useMemo, useState } from 'react'

import { IconFilter } from '@tabler/icons-react'
import { districtsData } from '@/data/districts-data'

interface CrimeNewestProps {
    className?: string
}

export function CrimeNewest({ className }: CrimeNewestProps) {
    const [selectedFilter, setSelectedFilter] = useState('all')

    // Data kasus kejahatan terbaru
    const crimeData = [
        { kasus: 'Maling Ayam', lokasi: 'Jawa Timur', tanggal: '2025-08-01' },
        { kasus: 'Korupsi', lokasi: 'Jakarta', tanggal: '2025-07-30' },
        { kasus: 'Penganiayaan', lokasi: 'Jawa Barat', tanggal: '2025-07-29' },
        { kasus: 'Penggelapan', lokasi: 'Sulawesi Utara', tanggal: '2025-07-28' },
        { kasus: 'Narkotika', lokasi: 'Jakarta', tanggal: '2025-07-27' },
        { kasus: 'Perampokan', lokasi: 'Jawa Tengah', tanggal: '2025-07-26' },
        { kasus: 'Penipuan', lokasi: 'Bali', tanggal: '2025-07-25' },
        { kasus: 'Pembunuhan', lokasi: 'Sumatera Utara', tanggal: '2025-07-24' }
    ];

    // Filter (jika ingin, misal berdasarkan lokasi atau kasus)
    const locationData = useMemo(() => {
        if (selectedFilter === 'all') return crimeData;
        return crimeData.filter(item =>
            item.lokasi.toLowerCase().includes(selectedFilter) ||
            item.kasus.toLowerCase().includes(selectedFilter)
        );
    }, [selectedFilter]);

    // Total kasus (jumlah data)
    const totalCases = locationData.length;

    return (
        <div className={`bg-white rounded-lg shadow-lg border lg:min-h-screen border-gray-200 p-6 ${className}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-xl font-bold text-black">Lokasi Kejadian</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Data kejahatan berdasarkan lokasi
                    </p>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                    <IconFilter className="w-4 h-4 text-gray-500" />
                    <select
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                    >
                        <option value="all">Semua Lokasi</option>
                        <option value="hotel">Hotel</option>
                        <option value="rumah">Rumah</option>
                        <option value="jalan">Jalan Raya</option>
                        <option value="sekolah">Sekolah</option>
                    </select>
                </div>
            </div>

            {/* Location List */}
            <div className="space-y-3 h-full">
                <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg border-l-4 border-black">
                    <span className="font-semibold text-black">Kasus</span>
                    <span className="font-semibold text-black">Lokasi</span>
                </div>

                <div className="max-h-80 lg:min-h-100 overflow-y-auto space-y-2">
                    {locationData.map((location, index) => (
                        <div key={location.kasus + location.lokasi + location.tanggal} className="flex items-center justify-between py-3 px-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100 last:border-b-0">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                    {index + 1}
                                </div>
                                <span className="text-gray-800 font-medium">{location.kasus}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-bold text-black">
                                    {location.lokasi}
                                </span>
                                <div className="text-xs text-gray-500">
                                    {location.tanggal}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {locationData.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <p>Tidak ada data untuk filter yang dipilih</p>
                    </div>
                )}
            </div>

            {/* Summary */}
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
        </div>
    )
}