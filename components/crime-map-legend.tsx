export function CrimeMapLegend() {
    return (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-[1000]">
            <div className="flex items-center mb-3">
                <div className="w-3 h-3 bg-black rounded-full mr-2"></div>
                <h4 className="font-semibold text-black">Tingkat Bahaya Wilayah</h4>
            </div>

            <div className="space-y-3">
                <div className="flex items-center text-sm">
                    <div className="w-4 h-4 bg-red-500 rounded mr-3 border border-white"></div>
                    <div>
                        <div className="font-medium text-gray-800">Tinggi</div>
                        <div className="text-xs text-gray-600">&gt; 35 kasus</div>
                    </div>
                </div>
                <div className="flex items-center text-sm">
                    <div className="w-4 h-4 bg-yellow-500 rounded mr-3 border border-white"></div>
                    <div>
                        <div className="font-medium text-gray-800">Sedang</div>
                        <div className="text-xs text-gray-600">15 - 35 kasus</div>
                    </div>
                </div>
                <div className="flex items-center text-sm">
                    <div className="w-4 h-4 bg-green-500 rounded mr-3 border border-white"></div>
                    <div>
                        <div className="font-medium text-gray-800">Rendah</div>
                        <div className="text-xs text-gray-600">&lt; 15 kasus</div>
                    </div>
                </div>
            </div>

            <div className="pt-3 mt-3 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                    Klik wilayah untuk detail lengkap
                </div>
            </div>
        </div>
    )
}