'use client'

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { District } from '@/data/districts-data'

// Fix leaflet icons
delete (Icon.Default.prototype as any)._getIconUrl
Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface IndonesiaCrimeMapProps {
    districts: District[]
    selectedCrimeType: string
}

const getDangerColor = (level: string): string => {
    switch (level) {
        case 'high': return '#ef4444'
        case 'medium': return '#eab308'
        case 'low': return '#22c55e'
        default: return '#6b7280'
    }
}

const getCircleRadius = (totalCases: number): number => {
    if (totalCases > 35) return 12
    if (totalCases > 15) return 10
    return 8
}

const getDangerLabel = (level: string): string => {
    switch (level) {
        case 'high': return 'Tinggi'
        case 'medium': return 'Sedang'
        case 'low': return 'Rendah'
        default: return 'Unknown'
    }
}

export function IndonesiaCrimeMap({ districts, selectedCrimeType }: IndonesiaCrimeMapProps) {
    return (
        <div className="h-full w-full">
            <MapContainer
                center={[-2.5, 118]} // Center Indonesia
                zoom={5}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
                zoomControl={true}
                attributionControl={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {districts.map((district) => {
                    const displayCases = selectedCrimeType === 'all'
                        ? district.totalCases
                        : district.crimeTypes[selectedCrimeType as keyof typeof district.crimeTypes]

                    return (
                        <CircleMarker
                            key={district.id}
                            center={district.position}
                            radius={getCircleRadius(district.totalCases)}
                            fillColor={getDangerColor(district.dangerLevel)}
                            fillOpacity={0.8}
                            stroke={true}
                            color="#ffffff"
                            weight={2}
                        >
                            <Popup>
                                <div className="p-3 min-w-[280px]">
                                    <div className="mb-3">
                                        <h3 className="font-bold text-black text-lg mb-1">
                                            {district.name}
                                        </h3>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${district.dangerLevel === 'high'
                                            ? 'bg-red-100 text-red-800 border border-red-300' :
                                            district.dangerLevel === 'medium'
                                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                                                'bg-green-100 text-green-800 border border-green-300'
                                            }`}>
                                            Tingkat Bahaya: {getDangerLabel(district.dangerLevel)}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="text-center">
                                                <div className="text-xl font-bold text-black">
                                                    {district.totalCases}
                                                </div>
                                                <div className="text-sm text-gray-600">Total Kasus</div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-black mb-2 text-sm">
                                                Detail Kejahatan:
                                            </h4>
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                {Object.entries(district.crimeTypes).map(([key, value]) => {
                                                    const isSelected = selectedCrimeType === key
                                                    return (
                                                        <div
                                                            key={key}
                                                            className={`flex justify-between p-2 rounded ${isSelected ? 'bg-black text-white' : 'bg-gray-100'
                                                                }`}
                                                        >
                                                            <span className="capitalize">{key}:</span>
                                                            <span className="font-medium">{value}</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </CircleMarker>
                    )
                })}
            </MapContainer>
        </div>
    )
}