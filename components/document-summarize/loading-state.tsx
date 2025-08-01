'use client'

import { IconFile, IconLoader } from '@tabler/icons-react'

interface LoadingStateProps {
    fileName: string
}

export function LoadingState({ fileName }: LoadingStateProps) {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-xl p-8">
                <div className="text-center">
                    <div className="flex items-center justify-center mb-6">
                        <div className="relative">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <IconFile className="w-8 h-8 text-blue-600" />
                            </div>
                            <div className="absolute -top-1 -right-1">
                                <IconLoader className="w-6 h-6 text-blue-600 animate-spin" />
                            </div>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Processing Document
                    </h3>

                    <p className="text-gray-600 mb-4">
                        Analyzing and summarizing <span className="font-medium">{fileName}</span>
                    </p>

                    <div className="max-w-md mx-auto">
                        <div className="bg-gray-200 rounded-full h-2 mb-4">
                            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '65%' }}></div>
                        </div>

                        <div className="text-sm text-gray-500 space-y-1">
                            <p>✓ Document uploaded successfully</p>
                            <p>✓ Extracting text content</p>
                            <p className="animate-pulse">⏳ Analyzing legal content...</p>
                            <p className="text-gray-400">⏳ Generating summary</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}