
'use client'

import 'leaflet/dist/leaflet.css'

import { GeoJSON, MapContainer, Popup, TileLayer } from 'react-leaflet'
import { useEffect, useMemo, useState } from 'react'

import { District } from '@/data/districts-data'
import { Icon } from 'leaflet'
import kabupatenGeoJSON from '@/data/kabupaten.json'

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
    selectedRegion: string
}

const getDangerColor = (level: string): string => {
    switch (level) {
        case 'high': return '#ef4444'
        case 'medium': return '#eab308'
        case 'low': return '#22c55e'
        default: return '#6b7280'
    }
}

const getDangerLabel = (level: string): string => {
    switch (level) {
        case 'high': return 'Tinggi'
        case 'medium': return 'Sedang'
        case 'low': return 'Rendah'
        default: return 'Unknown'
    }
}

// Mapping nama kabupaten dari GeoJSON ke data districts
const getDistrictByKabupatenName = (kabupatenName: string, districts: District[]) => {
    const mapping: { [key: string]: string } = {
        'Bangkalan': 'bangkalan',
        'Sampang': 'sampang',
        'Pamekasan': 'pamekasan',
        'Sumenep': 'sumenep'
    }

    const districtId = mapping[kabupatenName]
    return districts.find(d => d.id === districtId)
}

export function IndonesiaCrimeMap({
    districts,
    selectedCrimeType,
    selectedRegion = 'all'
}: IndonesiaCrimeMapProps) {

    const mapConfig = useMemo(() => {
        if (selectedRegion === 'all' || selectedRegion === 'jawa-timur') {
            return { center: [-7.0, 113.5] as [number, number], zoom: 8 }
        }

        const selectedDistrict = districts.find(d => d.id === selectedRegion)
        if (selectedDistrict) {
            return {
                center: selectedDistrict.position,
                zoom: 10
            }
        }

        return { center: [-7.0, 113.5] as [number, number], zoom: 8 }
    }, [selectedRegion, districts])

    const onEachFeature = (feature: any, layer: any) => {
        const kabupatenName = feature.properties.WADMKK
        const district = getDistrictByKabupatenName(kabupatenName, districts)

        if (district) {
            const currentRegion = selectedRegion || 'all'
            const isInFilter = currentRegion === 'all' ||
                currentRegion === 'jawa-timur' ||
                district.id === currentRegion

            const displayCases = selectedCrimeType === 'all'
                ? district.totalCases
                : district.crimeTypes[selectedCrimeType as keyof typeof district.crimeTypes]

            // Set style berdasarkan apakah ada dalam filter atau tidak
            if (isInFilter) {
                // Wilayah yang aktif - tampilkan dengan warna sesuai danger level
                layer.setStyle({
                    fillColor: getDangerColor(district.dangerLevel),
                    weight: 2,
                    opacity: 1,
                    color: '#ffffff',
                    dashArray: '3',
                    fillOpacity: 0.7
                })
            } else {
                // Wilayah yang tidak aktif - tampilkan dengan warna abu-abu
                layer.setStyle({
                    fillColor: '#e5e7eb',
                    weight: 1,
                    opacity: 0.3,
                    color: '#9ca3af',
                    dashArray: '5',
                    fillOpacity: 0.2
                })
            }

            // Add hover effect hanya untuk wilayah yang aktif
            if (isInFilter) {
                layer.on({
                    mouseover: function (e: any) {
                        const layer = e.target
                        layer.setStyle({
                            weight: 3,
                            color: '#666',
                            dashArray: '',
                            fillOpacity: 0.8
                        })
                    },
                    mouseout: function (e: any) {
                        const layer = e.target
                        layer.setStyle({
                            fillColor: getDangerColor(district.dangerLevel),
                            weight: 2,
                            opacity: 1,
                            color: '#ffffff',
                            dashArray: '3',
                            fillOpacity: 0.7
                        })
                    }
                })

                // Bind popup hanya untuk wilayah yang aktif
                layer.bindPopup(`
                    <div class="p-3 min-w-[280px]">
                        <div class="mb-3">
                            <h3 class="font-bold text-black text-lg mb-1">
                                ${district.name}
                            </h3>
                            <span class="inline-block px-3 py-1 rounded-full text-xs font-medium ${district.dangerLevel === 'high'
                        ? 'bg-red-100 text-red-800 border border-red-300' :
                        district.dangerLevel === 'medium'
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                            'bg-green-100 text-green-800 border border-green-300'
                    }">
                                Tingkat Bahaya: ${getDangerLabel(district.dangerLevel)}
                            </span>
                        </div>

                        <div class="space-y-3">
                            <div class="bg-gray-50 rounded-lg p-3">
                                <div class="text-center">
                                    <div class="text-xl font-bold text-black">
                                        ${selectedCrimeType === 'all' ? district.totalCases : displayCases}
                                    </div>
                                    <div class="text-sm text-gray-600">
                                        ${selectedCrimeType === 'all' ? 'Total Kasus' :
                        `Kasus ${selectedCrimeType.charAt(0).toUpperCase() + selectedCrimeType.slice(1)}`}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 class="font-medium text-black mb-2 text-sm">
                                    Detail Kejahatan:
                                </h4>
                                <div class="grid grid-cols-2 gap-2 text-xs">
                                    ${Object.entries(district.crimeTypes).map(([key, value]) => {
                            const isSelected = selectedCrimeType === key
                            return `
                                            <div class="flex justify-between p-2 rounded ${isSelected ? 'bg-black text-white' : 'bg-gray-100'
                                }">
                                                <span class="capitalize">${key}:</span>
                                                <span class="font-medium">${value}</span>
                                            </div>
                                        `
                        }).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                `)
            }
        } else {
            // Set default style untuk wilayah yang tidak ada datanya
            layer.setStyle({
                fillColor: '#f3f4f6',
                weight: 1,
                opacity: 0.2,
                color: '#d1d5db',
                fillOpacity: 0.1
            })
        }
    }

    // Filter GeoJSON untuk menampilkan semua kabupaten yang ada datanya
    const filteredGeoJSON = {
        ...kabupatenGeoJSON,
        features: kabupatenGeoJSON.features.filter((feature: any) => {
            const kabupatenName = feature.properties.WADMKK
            return getDistrictByKabupatenName(kabupatenName, districts)
        })
    }

    // Prevent SSR/hydration error: only render map on client
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true); }, []);

    if (!isClient) {
        return <div className="h-full w-full bg-gray-100 flex items-center justify-center">Memuat peta...</div>;
    }

    return (
        <div className="h-full w-full min-h-[400px]">
            <MapContainer
                center={mapConfig.center}
                zoom={mapConfig.zoom}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
                zoomControl={true}
                attributionControl={false}
                key={`${selectedRegion}-${mapConfig.center[0]}-${mapConfig.center[1]}-${mapConfig.zoom}`}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <GeoJSON
                    data={filteredGeoJSON as any}
                    onEachFeature={onEachFeature}
                    key={selectedRegion}
                />
            </MapContainer>
        </div>
    )
}