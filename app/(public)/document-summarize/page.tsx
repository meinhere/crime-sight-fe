'use client'

import { useState } from 'react'
import { FileUpload } from '@/components/document-summarize/file-upload'
import { LoadingState } from '@/components/document-summarize/loading-state'
import { SummaryResult } from '@/components/document-summarize/summary-result'
import { dummySummaryData, DocumentSummary } from '@/data/summarize-data'

export default function DocumentSummarizePage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [summary, setSummary] = useState<DocumentSummary | null>(null)

    const handleFileSelect = (file: File) => {
        setSelectedFile(file)
        setSummary(null)
    }

    const handleRemoveFile = () => {
        setSelectedFile(null)
        setSummary(null)
    }

    const handleSummarize = async () => {
        if (!selectedFile) return

        setIsLoading(true)

        // Simulate API call with dummy data
        setTimeout(() => {
            const summaryWithFileName = {
                ...dummySummaryData,
                fileName: selectedFile.name,
                fileSize: formatFileSize(selectedFile.size)
            }
            setSummary(summaryWithFileName)
            setIsLoading(false)
        }, 3000) // 3 second delay for demo
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const resetProcess = () => {
        setSelectedFile(null)
        setSummary(null)
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Summarize</h1>
                        <p className="text-gray-600">
                            Upload dokumen putusan pengadilan untuk mendapatkan ringkasan otomatis
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {!summary && !isLoading && (
                    <>
                        <FileUpload
                            onFileSelect={handleFileSelect}
                            onRemoveFile={handleRemoveFile}
                            selectedFile={selectedFile}
                            isLoading={isLoading}
                        />

                        {selectedFile && (
                            <div className="mt-8 text-center">
                                <button
                                    onClick={handleSummarize}
                                    disabled={isLoading}
                                    className="px-8 py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    Summarize
                                </button>
                            </div>
                        )}
                    </>
                )}

                {isLoading && selectedFile && (
                    <LoadingState fileName={selectedFile.name} />
                )}

                {summary && !isLoading && (
                    <>
                        <SummaryResult summary={summary} />

                        <div className="mt-8 text-center">
                            <button
                                onClick={resetProcess}
                                className="px-6 py-2 text-gray-600 hover:text-gray-800 underline"
                            >
                                Process Another Document
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}