// components/crime-map-filters.tsx - Back to simple version
'use client'

import { crimeTypeOptions, periodOptions, regionOptions } from '@/data/filter-options'

interface CrimeMapFiltersProps {
    selectedCrimeType: string
    selectedPeriod: string
    selectedRegion: string
    onCrimeTypeChange: (value: string) => void
    onPeriodChange: (value: string) => void
    onRegionChange: (value: string) => void
    disableCrimeType?: boolean
    disablePeriod?: boolean
}

export function CrimeMapFilters({
    selectedCrimeType,
    selectedPeriod,
    selectedRegion,
    onCrimeTypeChange,
    onPeriodChange,
    onRegionChange,
    disableCrimeType = false,
    disablePeriod = false
}: CrimeMapFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            {/* ✅ Crime Type Filter - Now using dummy data */}
            <div className="relative">
                <select
                    value={selectedCrimeType}
                    onChange={(e) => onCrimeTypeChange(e.target.value)}
                    disabled={disableCrimeType}
                    className={`text-xs sm:text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors flex-1 sm:flex-none min-w-[140px] ${disableCrimeType ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                        }`}
                    title={disableCrimeType ? 'Filter jenis kejahatan akan segera tersedia' : 'Pilih jenis kejahatan'}
                >
                    {crimeTypeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Soon indicator */}
                {disableCrimeType && (
                    <div className="absolute -top-1 -right-1 bg-yellow-400 text-xs px-1 rounded text-black font-bold">
                        Soon
                    </div>
                )}

                {/* Active filter indicator */}
                {!disableCrimeType && selectedCrimeType !== 'all' && (
                    <div className="absolute -top-1 -right-1 bg-green-500 text-xs px-1 rounded text-white font-bold">
                        ✓
                    </div>
                )}
            </div>

            {/* Period Filter */}
            <div className="relative">
                <select
                    value={selectedPeriod}
                    onChange={(e) => onPeriodChange(e.target.value)}
                    disabled={disablePeriod}
                    className={`text-xs sm:text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors flex-1 sm:flex-none min-w-[120px] ${disablePeriod ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                        }`}
                    title={disablePeriod ? 'Filter tahun akan segera tersedia' : 'Pilih tahun data'}
                >
                    {periodOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {disablePeriod && (
                    <div className="absolute -top-1 -right-1 bg-yellow-400 text-xs px-1 rounded text-black font-bold">
                        Soon
                    </div>
                )}
                {!disablePeriod && selectedPeriod !== 'all' && (
                    <div className="absolute -top-1 -right-1 bg-green-500 text-xs px-1 rounded text-white font-bold">
                        ✓
                    </div>
                )}
            </div>

            {/* Region Filter */}
            <div className="relative">
                <select
                    value={selectedRegion}
                    onChange={(e) => onRegionChange(e.target.value)}
                    className="text-xs sm:text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors flex-1 sm:flex-none min-w-[160px]"
                >
                    {regionOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {selectedRegion !== 'all' && (
                    <div className="absolute -top-1 -right-1 bg-green-500 text-xs px-1 rounded text-white font-bold">
                        ✓
                    </div>
                )}
            </div>
        </div>
    )
}