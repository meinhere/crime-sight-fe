'use client'

import { crimeTypeOptions, periodOptions, regionOptions } from '@/data/districts-data'

interface CrimeMapFiltersProps {
    selectedCrimeType: string
    selectedPeriod: string
    selectedRegion: string
    onCrimeTypeChange: (value: string) => void
    onPeriodChange: (value: string) => void
    onRegionChange: (value: string) => void
}

export function CrimeMapFilters({
    selectedCrimeType,
    selectedPeriod,
    selectedRegion,
    onCrimeTypeChange,
    onPeriodChange,
    onRegionChange
}: CrimeMapFiltersProps) {
    return (
        <div className="flex items-center space-x-3">
            <select
                value={selectedCrimeType}
                onChange={(e) => onCrimeTypeChange(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
            >
                {crimeTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            <select
                value={selectedPeriod}
                onChange={(e) => onPeriodChange(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
            >
                {periodOptions.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            <select
                value={selectedRegion}
                onChange={(e) => onRegionChange(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
            >
                {regionOptions.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}