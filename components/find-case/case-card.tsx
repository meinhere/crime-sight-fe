'use client'

import { useState } from 'react'
import { CaseData } from '@/data/cases-data'
import { IconChevronDown, IconChevronUp, IconFileText, IconMapPin, IconCalendar, IconGavel } from '@tabler/icons-react'

interface CaseCardProps {
    caseData: CaseData
    searchQuery?: string
}

export function CaseCard({ caseData, searchQuery }: CaseCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    // Function to highlight search terms
    const highlightText = (text: string, query: string) => {
        if (!query) return text

        const regex = new RegExp(`(${query})`, 'gi')
        const parts = text.split(regex)

        return parts.map((part, index) =>
            regex.test(part) ? (
                <mark key={index} className="bg-yellow-200 px-1 rounded">
                    {part}
                </mark>
            ) : part
        )
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            {/* Header */}
            <div className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-relaxed">
                            {highlightText(caseData.title, searchQuery || '')}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <IconMapPin className="w-4 h-4 text-gray-400" />
                                <span>Lokasi: {highlightText(caseData.location, searchQuery || '')}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <IconCalendar className="w-4 h-4 text-gray-400" />
                                <span>Tanggal: {new Date(caseData.date).toLocaleDateString('id-ID')}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <IconGavel className="w-4 h-4 text-gray-400" />
                                <span>Pengadilan: {caseData.court}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <IconFileText className="w-4 h-4 text-gray-400" />
                                <span>No. Perkara: {caseData.caseNumber}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="ml-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {isExpanded ? (
                            <IconChevronUp className="w-5 h-5 text-gray-600" />
                        ) : (
                            <IconChevronDown className="w-5 h-5 text-gray-600" />
                        )}
                    </button>
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="border-t border-gray-100 p-6 bg-gray-50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Terdakwa</h4>
                                <p className="text-sm text-gray-600">
                                    {highlightText(caseData.defendant, searchQuery || '')}
                                </p>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Dakwaan</h4>
                                <p className="text-sm text-gray-600">
                                    {highlightText(caseData.charges, searchQuery || '')}
                                </p>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Korban/Pihak Dirugikan</h4>
                                <p className="text-sm text-gray-600">
                                    {highlightText(caseData.victim, searchQuery || '')}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Status Putusan</h4>
                                <p className="text-sm text-gray-600">
                                    {highlightText(caseData.verdict, searchQuery || '')}
                                </p>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Hukuman</h4>
                                <p className="text-sm text-gray-600">
                                    {highlightText(caseData.punishment, searchQuery || '')}
                                </p>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Jumlah Kerugian/Denda</h4>
                                <p className="text-sm text-gray-600">
                                    {highlightText(caseData.amount, searchQuery || '')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">Ringkasan Kasus</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {highlightText(caseData.summary, searchQuery || '')}
                        </p>
                    </div>

                    <div className="mt-4 flex gap-3">
                        <button className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
                            <IconFileText className="w-4 h-4" />
                            Lihat Dokumen
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Unduh PDF
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}