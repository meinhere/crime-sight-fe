interface CrimeMapLegendProps {
    isMobile?: boolean
}

export function CrimeMapLegend({ isMobile = false }: CrimeMapLegendProps) {
    if (isMobile) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                            <div>
                                <div className="font-medium text-red-800">Tinggi</div>
                                <div className="text-xs text-red-600">&gt; 35 kasus</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                            <div>
                                <div className="font-medium text-yellow-800">Sedang</div>
                                <div className="text-xs text-yellow-600">15 - 35 kasus</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                            <div>
                                <div className="font-medium text-green-800">Rendah</div>
                                <div className="text-xs text-green-600">&lt; 15 kasus</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-500 text-center">
                        Klik wilayah untuk detail lengkap
                    </div>
                </div>
            </div>
        )
    }

    // Desktop version (horizontal/tipis)
    return (
        <div className="absolute bottom-3 left-3 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 z-[1000]">
            <div className="flex items-center space-x-4">
                {/* Title */}
                <div className="flex items-center">
                    <div className="w-2 h-2 bg-black rounded-full mr-1.5"></div>
                    <h4 className="font-semibold text-black text-xs">Legenda:</h4>
                </div>

                {/* Legend items horizontal */}
                <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded mr-1.5"></div>
                        <span className="text-xs text-gray-700">Tinggi</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded mr-1.5"></div>
                        <span className="text-xs text-gray-700">Sedang</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded mr-1.5"></div>
                        <span className="text-xs text-gray-700">Rendah</span>
                    </div>
                </div>
            </div>
        </div>
    )
}