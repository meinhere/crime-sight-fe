'use client'

import { District } from '@/data/districts-data'

interface CrimeMapStatsProps {
    districts: District[]
    selectedCrimeType: string
}

export function CrimeMapStats({ districts, selectedCrimeType }: CrimeMapStatsProps) {
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

    return (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-5 w-72 z-[1000]">
            <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-black rounded-full mr-2"></div>
                <h3 className="font-semibold text-black text-lg">Statistik Indonesia</h3>
            </div>

            <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-black">{totalCases}</div>
                        <div className="text-sm text-gray-600">Total Kasus</div>
                    </div>
                </div>

                <div>
                    <h4 className="font-medium text-black mb-3 text-sm">Tingkat Bahaya Wilayah</h4>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                <span className="text-sm text-gray-700">Tinggi</span>
                            </div>
                            <span className="text-sm font-medium">{dangerLevelCounts.high}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                                <span className="text-sm text-gray-700">Sedang</span>
                            </div>
                            <span className="text-sm font-medium">{dangerLevelCounts.medium}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                <span className="text-sm text-gray-700">Rendah</span>
                            </div>
                            <span className="text-sm font-medium">{dangerLevelCounts.low}</span>
                        </div>
                    </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-500 text-center">
                        Data real-time wilayah Indonesia
                    </div>
                </div>
            </div>
        </div>
    )
}