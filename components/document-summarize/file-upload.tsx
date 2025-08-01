

'use client'

import { useState, useRef } from 'react'
import { IconUpload, IconFile, IconX } from '@tabler/icons-react'

interface FileUploadProps {
    onFileSelect: (file: File) => void
    onRemoveFile: () => void
    selectedFile: File | null
    isLoading: boolean
}

export function FileUpload({ onFileSelect, onRemoveFile, selectedFile, isLoading }: FileUploadProps) {
    const [isDragOver, setIsDragOver] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)

        const files = e.dataTransfer.files
        if (files.length > 0) {
            const file = files[0]
            if (validateFile(file)) {
                onFileSelect(file)
            }
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            const file = files[0]
            if (validateFile(file)) {
                onFileSelect(file)
            }
        }
    }

    const validateFile = (file: File): boolean => {
        const maxSize = 5 * 1024 * 1024 // 5MB
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

        if (!allowedTypes.includes(file.type)) {
            alert('File type not supported. Please upload PDF or DOC file.')
            return false
        }

        if (file.size > maxSize) {
            alert('File size too large. Maximum size is 5MB.')
            return false
        }

        return true
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const handleBrowseClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            {!selectedFile ? (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                        border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer
                        ${isDragOver
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }
                    `}
                    onClick={handleBrowseClick}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <IconUpload className="w-8 h-8 text-gray-400" />
                        </div>

                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Choose a file or drag & drop it here to summarize
                        </h3>

                        <p className="text-sm text-gray-500 mb-6">
                            PDF or DOC up to 5 MB
                        </p>

                        <button
                            type="button"
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Browse File
                        </button>
                    </div>
                </div>
            ) : (
                <div className="border border-gray-200 rounded-xl p-6 bg-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <IconFile className="w-6 h-6 text-red-600" />
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900">{selectedFile.name}</h4>
                                <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                            </div>
                        </div>

                        {!isLoading && (
                            <button
                                onClick={onRemoveFile}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                            >
                                <IconX className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}