// components/crime-map-stats.tsx
'use client'

import { District } from '@/types/api'
import { getCrimeTypeLabel } from '@/data/filter-options'

interface CrimeMapStatsProps {
    districts: District[]
    selectedCrimeType: string
    selectedPeriod?: string
    selectedRegion?: string
    selectedProvinceName?: string
    isMobile?: boolean
}

export function CrimeMapStats({
    districts,
    selectedCrimeType,
    selectedPeriod = 'all',
    selectedRegion = 'all',
    selectedProvinceName,
    isMobile = false
}: CrimeMapStatsProps) {

    // ✅ Calculate total cases based on selected crime type
    const totalCases = districts.reduce((sum, district) => {
        if (selectedCrimeType === 'all') {
            return sum + district.totalCases
        }
        // Map selected crime type to crimeTypes object
        const crimeTypeMapping: Record<string, keyof District['crimeTypes']> = {
            'pencurian': 'pencurian',
            'penganiayaan': 'penganiayaan',
            'pembunuhan': 'pembunuhan',
            'penghinaan': 'penghinaan',
            'penipuan': 'penipuan',
            'perlindungan_anak': 'penggelapan' // Map to available type
        }

        const mappedType = crimeTypeMapping[selectedCrimeType] || 'pencurian'
        return sum + (district.crimeTypes[mappedType] || 0)
    }, 0)

    // ✅ Calculate danger level distribution
    const dangerLevelCounts = districts.reduce((acc, district) => {
        acc[district.dangerLevel] = (acc[district.dangerLevel] || 0) + 1
        return acc
    }, { high: 0, medium: 0, low: 0 } as Record<string, number>)

    // ✅ Calculate average cases per district
    const avgCasesPerDistrict = districts.length > 0 ? Math.round(totalCases / districts.length) : 0

    // ✅ Find highest and lowest districts
    const sortedDistricts = [...districts].sort((a, b) => b.totalCases - a.totalCases)
    const highestDistrict = sortedDistricts[0]
    const lowestDistrict = sortedDistricts[sortedDistricts.length - 1]

    // ✅ Get current filter info for display
    const getFilterTitle = () => {
        const parts = []

        if (selectedCrimeType !== 'all') {
            parts.push(getCrimeTypeLabel(selectedCrimeType))
        }

        if (selectedPeriod !== 'all') {
            parts.push(selectedPeriod)
        }

        const location = selectedProvinceName || 'Indonesia'

        if (parts.length > 0) {
            return `${parts.join(' - ')} (${location})`
        }

        return location
    }

    if (isMobile) {
        return (
            <div className="space-y-4">
                {/* Header with filter info */}
                <div className="text-center border-b border-gray-200 pb-3">
                    <h3 className="font-semibold text-black text-lg">Statistik {getFilterTitle()}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                        {districts.length} kabupaten/kota • Data terkini
                    </p>
                </div>

                {/* Main stats grid */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Total cases */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-900">{totalCases.toLocaleString('id-ID')}</div>
                            <div className="text-xs text-blue-700 mt-1">
                                {selectedCrimeType === 'all' ? 'Total Kasus' : `Kasus ${getCrimeTypeLabel(selectedCrimeType)}`}
                            </div>
                        </div>
                    </div>

                    {/* Average per district */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-900">{avgCasesPerDistrict.toLocaleString('id-ID')}</div>
                            <div className="text-xs text-purple-700 mt-1">Rata-rata per Wilayah</div>
                        </div>
                    </div>
                </div>

                {/* Danger level distribution */}
                <div>
                    <h4 className="font-medium text-black mb-3 flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                        Tingkat Bahaya Wilayah
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-gradient-to-b from-red-50 to-red-100 rounded-lg border border-red-200">
                            <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2"></div>
                            <div className="text-sm font-medium text-red-800">Tinggi</div>
                            <div className="text-xl font-bold text-red-900">{dangerLevelCounts.high}</div>
                            <div className="text-xs text-red-600">
                                {districts.length > 0 ? Math.round((dangerLevelCounts.high / districts.length) * 100) : 0}%
                            </div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-b from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                            <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                            <div className="text-sm font-medium text-yellow-800">Sedang</div>
                            <div className="text-xl font-bold text-yellow-900">{dangerLevelCounts.medium}</div>
                            <div className="text-xs text-yellow-600">
                                {districts.length > 0 ? Math.round((dangerLevelCounts.medium / districts.length) * 100) : 0}%
                            </div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-b from-green-50 to-green-100 rounded-lg border border-green-200">
                            <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                            <div className="text-sm font-medium text-green-800">Rendah</div>
                            <div className="text-xl font-bold text-green-900">{dangerLevelCounts.low}</div>
                            <div className="text-xs text-green-600">
                                {districts.length > 0 ? Math.round((dangerLevelCounts.low / districts.length) * 100) : 0}%
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top/Bottom districts */}
                {highestDistrict && lowestDistrict && (
                    <div>
                        <h4 className="font-medium text-black mb-3 flex items-center">
                            <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                            Wilayah Ekstrem
                        </h4>
                        <div className="space-y-3">
                            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-medium text-red-900 text-sm">{highestDistrict.name}</div>
                                        <div className="text-xs text-red-600">Kasus Tertinggi</div>
                                    </div>
                                    <div className="text-xl font-bold text-red-900">
                                        {highestDistrict.totalCases.toLocaleString('id-ID')}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-medium text-green-900 text-sm">{lowestDistrict.name}</div>
                                        <div className="text-xs text-green-600">Kasus Terendah</div>
                                    </div>
                                    <div className="text-xl font-bold text-green-900">
                                        {lowestDistrict.totalCases.toLocaleString('id-ID')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer info */}
                <div className="pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-500 text-center">
                        Data clustering real-time • Filter: {getFilterTitle()}
                    </div>
                </div>
            </div>
        )
    }

    // ✅ Enhanced Desktop version
    return (
        <div className="absolute top-2 right-2 bg-white rounded-md shadow-lg border border-gray-200 p-2 w-56 z-[1000]">
            <div className="flex items-center mb-1.5">
                <div className="w-1.5 h-1.5 bg-black rounded-full mr-1"></div>
                <h3 className="font-semibold text-black text-xs">Statistik</h3>
                {/* Filter indicator */}
                {(selectedCrimeType !== 'all' || selectedPeriod !== 'all' || selectedRegion !== 'all') && (
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full ml-1"></div>
                )}
            </div>

            <div className="space-y-1.5">
                {/* Location and filter info */}
                <div className="text-[10px] text-gray-600 border-b border-gray-100 pb-1">
                    {getFilterTitle()} • {districts.length} wilayah
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-1">
                    {/* Total cases */}
                    <div className="bg-blue-50 rounded p-1.5 border border-blue-200">
                        <div className="text-center">
                            <div className="text-sm font-bold text-blue-900 leading-none">
                                {totalCases > 999 ? `${Math.round(totalCases / 1000)}k` : totalCases}
                            </div>
                            <div className="text-[9px] text-blue-700 leading-tight">
                                {selectedCrimeType === 'all' ? 'Total' : getCrimeTypeLabel(selectedCrimeType)}
                            </div>
                        </div>
                    </div>

                    {/* Average */}
                    <div className="bg-purple-50 rounded p-1.5 border border-purple-200">
                        <div className="text-center">
                            <div className="text-sm font-bold text-purple-900 leading-none">
                                {avgCasesPerDistrict > 999 ? `${Math.round(avgCasesPerDistrict / 1000)}k` : avgCasesPerDistrict}
                            </div>
                            <div className="text-[9px] text-purple-700 leading-tight">Rata-rata</div>
                        </div>
                    </div>
                </div>

                {/* Danger levels - horizontal compact */}
                <div className="flex justify-between items-center text-[9px] space-x-1">
                    <div className="flex items-center bg-red-50 rounded px-1 py-0.5">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1"></div>
                        <span className="text-red-700 mr-0.5">T</span>
                        <span className="text-xs font-semibold text-red-900">{dangerLevelCounts.high}</span>
                    </div>
                    <div className="flex items-center bg-yellow-50 rounded px-1 py-0.5">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1"></div>
                        <span className="text-yellow-700 mr-0.5">S</span>
                        <span className="text-xs font-semibold text-yellow-900">{dangerLevelCounts.medium}</span>
                    </div>
                    <div className="flex items-center bg-green-50 rounded px-1 py-0.5">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                        <span className="text-green-700 mr-0.5">R</span>
                        <span className="text-xs font-semibold text-green-900">{dangerLevelCounts.low}</span>
                    </div>
                </div>

                {/* Top district info */}
                {highestDistrict && (
                    <div className="bg-gray-50 rounded p-1 border border-gray-200">
                        <div className="text-[9px] text-gray-600">Tertinggi:</div>
                        <div className="text-[10px] font-medium text-gray-900 truncate">
                            {highestDistrict.name}
                        </div>
                        <div className="text-xs font-bold text-red-600">
                            {highestDistrict.totalCases.toLocaleString('id-ID')}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}