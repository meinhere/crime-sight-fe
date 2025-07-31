'use client'

import { DocumentSummary } from '@/data/summarize-data'
import { IconFile, IconDownload, IconCopy, IconCheck } from '@tabler/icons-react'
import { useState } from 'react'

interface SummaryResultProps {
    summary: DocumentSummary
}

export function SummaryResult({ summary }: SummaryResultProps) {
    const [copiedSection, setCopiedSection] = useState<string | null>(null)

    const copyToClipboard = (text: string, section: string) => {
        navigator.clipboard.writeText(text)
        setCopiedSection(section)
        setTimeout(() => setCopiedSection(null), 2000)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            {/* File Info */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <IconFile className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{summary.fileName}</h3>
                        <p className="text-sm text-gray-500">
                            {summary.fileSize} • Diproses pada {formatDate(summary.uploadDate)}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2">
                            <IconDownload className="w-4 h-4" />
                            <span className="hidden sm:inline">Download</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Summary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-6">
                    <SummaryCard
                        title="Informasi Dasar"
                        items={[
                            { label: "Hakim", value: summary.summary.hakim },
                            { label: "Terdakwa", value: summary.summary.terdakwa },
                            { label: "Jenis Kejahatan", value: summary.summary.jenisKejahatan },
                            { label: "Pasal", value: summary.summary.pasal }
                        ]}
                        onCopy={(content) => copyToClipboard(content, 'basic')}
                        isCopied={copiedSection === 'basic'}
                    />

                    <SummaryCard
                        title="Detail Kasus"
                        items={[
                            { label: "Korban", value: summary.summary.korban },
                            { label: "Lokasi", value: summary.summary.lokasi },
                            { label: "Tanggal Kejadian", value: summary.summary.tanggalKejadian },
                            { label: "Status Putusan", value: summary.summary.statusPutusan }
                        ]}
                        onCopy={(content) => copyToClipboard(content, 'detail')}
                        isCopied={copiedSection === 'detail'}
                    />
                </div>

                {/* Right Column - Vonis & Legal */}
                <div className="space-y-6">
                    <SummaryCard
                        title="Putusan & Sanksi"
                        items={[
                            { label: "Vonis", value: summary.summary.vonis },
                            { label: "Denda", value: summary.summary.denda }
                        ]}
                        onCopy={(content) => copyToClipboard(content, 'verdict')}
                        isCopied={copiedSection === 'verdict'}
                    />

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Pertimbangan Hakim</h3>
                            <button
                                onClick={() => copyToClipboard(summary.summary.pertimbangan.join('\n'), 'considerations')}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                            >
                                {copiedSection === 'considerations' ? (
                                    <IconCheck className="w-4 h-4 text-green-600" />
                                ) : (
                                    <IconCopy className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        <ul className="space-y-2">
                            {summary.summary.pertimbangan.map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                    <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                                        {index + 1}
                                    </span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Full Width Sections */}
            <div className="space-y-6">
                {/* Fakta Hukum */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Fakta Hukum</h3>
                        <button
                            onClick={() => copyToClipboard(summary.summary.faktaHukum.join('\n'), 'facts')}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        >
                            {copiedSection === 'facts' ? (
                                <IconCheck className="w-4 h-4 text-green-600" />
                            ) : (
                                <IconCopy className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {summary.summary.faktaHukum.map((fact, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-medium">
                                    {index + 1}
                                </span>
                                <span className="text-sm text-gray-600">{fact}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Kesimpulan */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Kesimpulan</h3>
                        <button
                            onClick={() => copyToClipboard(summary.summary.kesimpulan, 'conclusion')}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        >
                            {copiedSection === 'conclusion' ? (
                                <IconCheck className="w-4 h-4 text-green-600" />
                            ) : (
                                <IconCopy className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{summary.summary.kesimpulan}</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium">
                    Download Summary Report
                </button>
                <button className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                    Generate New Summary
                </button>
            </div>
        </div>
    )
}

interface SummaryCardProps {
    title: string
    items: { label: string; value: string }[]
    onCopy: (content: string) => void
    isCopied: boolean
}

function SummaryCard({ title, items, onCopy, isCopied }: SummaryCardProps) {
    const content = items.map(item => `${item.label}: ${item.value}`).join('\n')

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <button
                    onClick={() => onCopy(content)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                    {isCopied ? (
                        <IconCheck className="w-4 h-4 text-green-600" />
                    ) : (
                        <IconCopy className="w-4 h-4" />
                    )}
                </button>
            </div>
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={index}>
                        <dt className="text-sm font-medium text-gray-500 mb-1">{item.label}</dt>
                        <dd className="text-sm text-gray-900">{item.value}</dd>
                    </div>
                ))}
            </div>
        </div>
    )
}