'use client'

interface MapLoadingProps {
    message?: string
    provinceName?: string
    showProgress?: boolean
}

export function MapLoading({
    message = "Memuat peta...",
    provinceName,
    showProgress = false
}: MapLoadingProps) {
    return (
        <div className="h-full w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <div className="text-center p-8">
                {/* Loading Animation */}
                <div className="relative mb-6">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-black mx-auto"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-black rounded-full animate-pulse"></div>
                    </div>
                </div>

                {/* Loading Text */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {message}
                    </h3>

                    {provinceName && (
                        <p className="text-sm text-gray-600">
                            Memuat data {provinceName}...
                        </p>
                    )}

                    {showProgress && (
                        <div className="mt-4">
                            <div className="w-48 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
                                <div className="h-full bg-black rounded-full animate-pulse"
                                    style={{
                                        animation: 'loading-progress 2s ease-in-out infinite'
                                    }}>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Memproses data geografis...
                            </p>
                        </div>
                    )}
                </div>

                {/* Map Icons Animation */}
                <div className="mt-6 flex justify-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}></div>
                </div>
            </div>

            <style jsx>{`
                @keyframes loading-progress {
                    0% { width: 0%; }
                    50% { width: 70%; }
                    100% { width: 100%; }
                }
            `}</style>
        </div>
    )
}