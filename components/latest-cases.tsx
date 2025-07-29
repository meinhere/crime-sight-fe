interface Case {
    id: number
    type: string
    location: string
    count: number
}

interface LatestCasesProps {
    cases: Case[]
}

export function LatestCases({ cases }: LatestCasesProps) {
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-600 border-b pb-3">
                <div>Kasus</div>
                <div>Lokasi</div>
                <div className="text-center">Jumlah</div>
            </div>

            {/* Cases List */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {cases.map((case_) => (
                    <div key={case_.id} className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                        <div className="text-sm font-medium text-black">
                            {case_.type}
                        </div>
                        <div className="text-sm text-gray-600">
                            {case_.location}
                        </div>
                        <div className="text-center">
                            <span className="text-sm font-semibold bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                {case_.count}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}