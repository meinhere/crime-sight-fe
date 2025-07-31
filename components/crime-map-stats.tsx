'use client'

import { District } from '@/data/districts-data'

interface CrimeMapStatsProps {
    districts: District[]
    selectedCrimeType: string
    isMobile?: boolean
}

export function CrimeMapStats({ districts, selectedCrimeType, isMobile = false }: CrimeMapStatsProps) {
    const totalCases = districts.reduce((sum, district) => {
        if (selectedCrimeType === 'all') {
            return sum + district.totalCases
        }
        return sum + (district.crimeTypes[selectedCrimeType as keyof typeof district.crimeTypes] || 0)
    }, 0)

    const dangerLevelCounts = districts.reduce((acc, district) => {
        acc[district.dangerLevel] = (acc[district.dangerLevel] || 0) + 1
        return acc
    }, { high: 0, medium: 0, low: 0 } as Record<string, number>)

    if (isMobile) {
        return (
            <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-black">{totalCases}</div>
                        <div className="text-sm text-gray-600 mt-1">
                            {selectedCrimeType === 'all'
                                ? 'Total Kasus'
                                : `Kasus ${selectedCrimeType.charAt(0).toUpperCase() + selectedCrimeType.slice(1)}`
                            }
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="font-medium text-black mb-3">Tingkat Bahaya Wilayah</h4>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                            <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2"></div>
                            <div className="text-sm font-medium text-red-800">Tinggi</div>
                            <div className="text-xl font-bold text-red-900">{dangerLevelCounts.high}</div>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                            <div className="text-sm font-medium text-yellow-800">Sedang</div>
                            <div className="text-xl font-bold text-yellow-900">{dangerLevelCounts.medium}</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                            <div className="text-sm font-medium text-green-800">Rendah</div>
                            <div className="text-xl font-bold text-green-900">{dangerLevelCounts.low}</div>
                        </div>
                    </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-500 text-center">
                        Data real-time wilayah Indonesia
                    </div>
                </div>
            </div>
        )
    }

    // Desktop version (ultra compact dengan nama lengkap)
    return (
        <div className="absolute top-2 right-2 bg-white rounded-md shadow-lg border border-gray-200 p-2 w-48 z-[1000]">
            <div className="flex items-center mb-1.5">
                <div className="w-1.5 h-1.5 bg-black rounded-full mr-1"></div>
                <h3 className="font-semibold text-black text-xs">Statistik</h3>
            </div>

            <div className="space-y-1.5">
                {/* Total cases - ultra compact */}
                <div className="bg-gray-50 rounded p-1.5">
                    <div className="text-center">
                        <div className="text-lg font-bold text-black leading-none">{totalCases}</div>
                        <div className="text-[10px] text-gray-600 leading-tight">
                            {selectedCrimeType === 'all' ? 'Total Kasus' : `Kasus ${selectedCrimeType}`}
                        </div>
                    </div>
                </div>

                {/* Danger levels - horizontal compact dengan nama lengkap */}
                <div className="flex justify-between items-center text-[10px]">
                    <div className="flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                        <span className="text-gray-700 mr-1">Tinggi</span>
                        <span className="text-xs font-semibold">{dangerLevelCounts.high}</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                        <span className="text-gray-700 mr-1">Sedang</span>
                        <span className="text-xs font-semibold">{dangerLevelCounts.medium}</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        <span className="text-gray-700 mr-1">Rendah</span>
                        <span className="text-xs font-semibold">{dangerLevelCounts.low}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}