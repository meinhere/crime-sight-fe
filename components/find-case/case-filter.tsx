'use client'

import { useState } from 'react'
import { IconFilter, IconX } from '@tabler/icons-react'

interface FilterOptions {
    court: string
    caseType: string
    status: string
    dateRange: string
}

interface CaseFilterProps {
    onFilterChange: (filters: FilterOptions) => void
    resultsCount: number
}

export function CaseFilter({ onFilterChange, resultsCount }: CaseFilterProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [filters, setFilters] = useState<FilterOptions>({
        court: '',
        caseType: '',
        status: '',
        dateRange: ''
    })

    const courtOptions = [
        'Pengadilan Negeri Surabaya',
        'Pengadilan Negeri Bandung',
        'Pengadilan Negeri Jakarta Selatan',
        'Pengadilan Negeri Denpasar',
        'Pengadilan Negeri Medan',
        'Pengadilan Negeri Yogyakarta'
    ]

    const caseTypeOptions = [
        'Korupsi',
        'Pembunuhan',
        'Kejahatan Siber',
        'Pencurian',
        'Narkotika',
        'Penipuan'
    ]

    const statusOptions = [
        'Putusan dibacakan',
        'Vonis dijatuhkan',
        'Dalam proses'
    ]

    const dateRangeOptions = [
        '30 hari terakhir',
        '3 bulan terakhir',
        '6 bulan terakhir',
        '1 tahun terakhir'
    ]

    const handleFilterChange = (key: keyof FilterOptions, value: string) => {
        const newFilters = { ...filters, [key]: value }
        setFilters(newFilters)
        onFilterChange(newFilters)
    }

    const clearFilters = () => {
        const emptyFilters = { court: '', caseType: '', status: '', dateRange: '' }
        setFilters(emptyFilters)
        onFilterChange(emptyFilters)
    }

    const hasActiveFilters = Object.values(filters).some(value => value !== '')

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <IconFilter className="w-4 h-4" />
                        <span>Filter</span>
                    </button>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                        >
                            <IconX className="w-4 h-4" />
                            <span>Clear All</span>
                        </button>
                    )}
                </div>

                <p className="text-sm text-gray-600">
                    Ditemukan <span className="font-semibold">{resultsCount}</span> kasus
                </p>
            </div>

            {isOpen && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pengadilan
                        </label>
                        <select
                            value={filters.court}
                            onChange={(e) => handleFilterChange('court', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                        >
                            <option value="">Semua Pengadilan</option>
                            {courtOptions.map(court => (
                                <option key={court} value={court}>{court}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Jenis Kasus
                        </label>
                        <select
                            value={filters.caseType}
                            onChange={(e) => handleFilterChange('caseType', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                        >
                            <option value="">Semua Jenis</option>
                            {caseTypeOptions.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                        >
                            <option value="">Semua Status</option>
                            {statusOptions.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Periode
                        </label>
                        <select
                            value={filters.dateRange}
                            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                        >
                            <option value="">Semua Periode</option>
                            {dateRangeOptions.map(range => (
                                <option key={range} value={range}>{range}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
    )
}