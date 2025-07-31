'use client'

import { useState, useEffect } from 'react'
import { casesData, CaseData } from '@/data/cases-data'
import { SearchBar } from '@/components/find-case/search-bar'
import { CaseFilter } from '@/components/find-case/case-filter'
import { CaseCard } from '@/components/find-case/case-card'

interface FilterOptions {
    court: string
    caseType: string
    status: string
    dateRange: string
}

export default function FindCasePage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredCases, setFilteredCases] = useState<CaseData[]>(casesData)
    const [filters, setFilters] = useState<FilterOptions>({
        court: '',
        caseType: '',
        status: '',
        dateRange: ''
    })

    useEffect(() => {
        let filtered = casesData

        // Search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter(caseItem => {
                const searchableFields = [
                    caseItem.title,
                    caseItem.location,
                    caseItem.defendant,
                    caseItem.charges,
                    caseItem.victim,
                    caseItem.verdict,
                    caseItem.punishment,
                    caseItem.summary,
                    caseItem.court
                ].join(' ').toLowerCase()

                return searchableFields.includes(searchQuery.toLowerCase())
            })
        }

        // Additional filters
        if (filters.court) {
            filtered = filtered.filter(caseItem => caseItem.court === filters.court)
        }

        if (filters.caseType) {
            filtered = filtered.filter(caseItem =>
                caseItem.charges.toLowerCase().includes(filters.caseType.toLowerCase()) ||
                caseItem.title.toLowerCase().includes(filters.caseType.toLowerCase())
            )
        }

        if (filters.status) {
            filtered = filtered.filter(caseItem =>
                caseItem.verdict.includes(filters.status)
            )
        }

        if (filters.dateRange) {
            const now = new Date()
            let dateThreshold = new Date()

            switch (filters.dateRange) {
                case '30 hari terakhir':
                    dateThreshold.setDate(now.getDate() - 30)
                    break
                case '3 bulan terakhir':
                    dateThreshold.setMonth(now.getMonth() - 3)
                    break
                case '6 bulan terakhir':
                    dateThreshold.setMonth(now.getMonth() - 6)
                    break
                case '1 tahun terakhir':
                    dateThreshold.setFullYear(now.getFullYear() - 1)
                    break
            }

            filtered = filtered.filter(caseItem =>
                new Date(caseItem.date) >= dateThreshold
            )
        }

        setFilteredCases(filtered)
    }, [searchQuery, filters])

    const handleSearch = (query: string) => {
        setSearchQuery(query)
    }

    const handleFilterChange = (newFilters: FilterOptions) => {
        setFilters(newFilters)
    }

    return (
        <div className="min-h-scree">
            {/* Header */}
            <div className="border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Case</h1>
                        <p className="text-gray-600 mb-8">
                            Cari dan temukan kasus putusan pengadilan dengan mudah
                        </p>
                        <SearchBar onSearch={handleSearch} placeholder="Cari kasus berdasarkan nama, lokasi, dakwaan, hukuman..." />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <CaseFilter
                    onFilterChange={handleFilterChange}
                    resultsCount={filteredCases.length}
                />

                {/* Results */}
                <div className="space-y-6">
                    {filteredCases.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada kasus ditemukan</h3>
                            <p className="text-gray-500">
                                Coba ubah kata kunci pencarian atau filter yang digunakan
                            </p>
                        </div>
                    ) : (
                        filteredCases.map((caseItem) => (
                            <CaseCard
                                key={caseItem.id}
                                caseData={caseItem}
                                searchQuery={searchQuery}
                            />
                        ))
                    )}
                </div>

                {/* Load More Button (jika diperlukan) */}
                {filteredCases.length > 0 && (
                    <div className="text-center mt-12">
                        <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            Muat Lebih Banyak
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}