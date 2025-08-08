'use client'

import 'leaflet/dist/leaflet.css'
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet'
import { useEffect, useMemo, useState } from 'react'
import { Icon } from 'leaflet'
import kabupatenGeoJSON from '@/data/kabupaten.json'
import type { District } from '@/types/api'
import { MAP_CONFIG, DANGER_COLORS, DANGER_LABELS } from '@/data/constants'

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
    selectedProvinceInfo?: { kode_provinsi: string; nama_provinsi: string; lat: number; lang: number } | null
    loading?: boolean
}

const getDangerColor = (level: string): string => {
    return DANGER_COLORS[level as keyof typeof DANGER_COLORS] || DANGER_COLORS.default
}

const getDangerLabel = (level: string): string => {
    return DANGER_LABELS[level as keyof typeof DANGER_LABELS] || 'Unknown'
}

// Enhanced mapping function for kabupaten names
const getDistrictByKabupatenName = (kabupatenName: string, districts: District[]) => {
    const cleanName = kabupatenName.toLowerCase().trim()

    console.log('🔍 Looking for kabupaten:', cleanName)

    const district = districts.find(district => {
        const districtName = district.name.toLowerCase().trim()

        // 1. Direct exact match
        if (districtName === cleanName) {
            console.log('✅ Direct match:', districtName, '=', cleanName)
            return true
        }

        // 2. Handle "Kota" prefix variations
        const cleanNameWithoutKota = cleanName.replace(/^kota\s+/, '')
        const districtNameWithoutKota = districtName.replace(/^kota\s+/, '')

        if (cleanNameWithoutKota === districtNameWithoutKota) {
            console.log('✅ Kota match:', districtName, '~', cleanName)
            return true
        }

        // 3. Handle "Kabupaten" prefix variations
        const cleanNameWithoutKab = cleanName.replace(/^kabupaten\s+/, '')
        const districtNameWithoutKab = districtName.replace(/^kabupaten\s+/, '')

        if (cleanNameWithoutKab === districtNameWithoutKab) {
            console.log('✅ Kabupaten match:', districtName, '~', cleanName)
            return true
        }

        // 4. Remove all spaces and special characters for matching
        const normalizedDistrictName = districtName.replace(/[\s\-\.]/g, '').toLowerCase()
        const normalizedKabupatenName = cleanName.replace(/[\s\-\.]/g, '').toLowerCase()

        if (normalizedDistrictName === normalizedKabupatenName) {
            console.log('✅ Normalized match:', normalizedDistrictName, '=', normalizedKabupatenName)
            return true
        }

        // 5. Partial match for similar names
        if (normalizedDistrictName.length > 4 && normalizedKabupatenName.length > 4) {
            if (normalizedDistrictName.includes(normalizedKabupatenName) ||
                normalizedKabupatenName.includes(normalizedDistrictName)) {
                console.log('✅ Partial match:', normalizedDistrictName, '~', normalizedKabupatenName)
                return true
            }
        }

        return false
    })

    if (!district) {
        console.log('❌ No match found for:', cleanName)
        if (districts.length > 0) {
            console.log('📋 Available districts (first 10):', districts.slice(0, 10).map(d => d.name))
        }
    }

    return district
}

export function IndonesiaCrimeMap({
    districts,
    selectedCrimeType,
    selectedRegion = 'all',
    selectedProvinceInfo,
    loading = false
}: IndonesiaCrimeMapProps) {

    // Map configuration
    const mapConfig = useMemo(() => {
        if (selectedRegion === 'all') {
            return {
                center: MAP_CONFIG.DEFAULT_CENTER,
                zoom: MAP_CONFIG.DEFAULT_ZOOM
            }
        }

        if (selectedProvinceInfo) {
            return {
                center: [selectedProvinceInfo.lat, selectedProvinceInfo.lang] as [number, number],
                zoom: MAP_CONFIG.PROVINCE_ZOOM
            }
        }

        return {
            center: MAP_CONFIG.DEFAULT_CENTER,
            zoom: MAP_CONFIG.DEFAULT_ZOOM
        }
    }, [selectedRegion, selectedProvinceInfo])

    const onEachFeature = (feature: any, layer: any) => {
        const kabupatenName = feature.properties.WADMKK
        // ✅ Gunakan KDPPUM yang adalah kode provinsi yang benar
        const provinsiCode = feature.properties.KDPPUM

        // Enhanced debugging untuk melihat structure
        console.log('🗺️ GeoJSON Feature Properties:', {
            kabupaten: kabupatenName,
            provinsiCode: provinsiCode,
            allProperties: Object.keys(feature.properties).slice(0, 10), // Show first 10 keys
            selectedProvinceCode: selectedProvinceInfo?.kode_provinsi,
            isMatch: provinsiCode === selectedProvinceInfo?.kode_provinsi
        })

        // Check if this kabupaten should be highlighted based on filter
        const isInSelectedProvince = selectedRegion === 'all' ||
            (selectedProvinceInfo && provinsiCode === selectedProvinceInfo.kode_provinsi)

        console.log('🔍 Province Filter Check:', {
            kabupaten: kabupatenName,
            geoJSONProvinceCode: provinsiCode,
            selectedProvinceCode: selectedProvinceInfo?.kode_provinsi,
            selectedRegion,
            isInSelectedProvince
        })

        if (!isInSelectedProvince) {
            // Outside selected province - show very faded
            layer.setStyle({
                fillColor: '#f9fafb',
                weight: 0.5,
                opacity: 0.1,
                color: '#e5e7eb',
                fillOpacity: 0.05
            })
            return
        }

        // This kabupaten is in the selected province (or we're showing all Indonesia)
        // Try to find matching district data from API
        const district = getDistrictByKabupatenName(kabupatenName, districts)

        if (district) {
            console.log('🎨 SUCCESS! Coloring kabupaten:', kabupatenName, 'with level:', district.dangerLevel, 'color:', getDangerColor(district.dangerLevel))

            const displayCases = selectedCrimeType === 'all'
                ? district.totalCases
                : district.crimeTypes[selectedCrimeType] || district.totalCases

            // Apply color based on cluster level from API
            layer.setStyle({
                fillColor: getDangerColor(district.dangerLevel),
                weight: 2,
                opacity: 1,
                color: '#ffffff',
                dashArray: '3',
                fillOpacity: 0.7
            })

            // Add hover effect
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

            // Bind popup with cluster information
            layer.bindPopup(`
                <div class="p-3 min-w-[280px]">
                    <div class="mb-3">
                        <h3 class="font-bold text-black text-lg mb-1">
                            ${kabupatenName}
                        </h3>
                        <div class="text-sm text-gray-600 mb-2">
                            ${selectedProvinceInfo ? selectedProvinceInfo.nama_provinsi : 'Indonesia'}
                        </div>
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
                                    ${displayCases}
                                </div>
                                <div class="text-sm text-gray-600">
                                    ${selectedCrimeType === 'all' ? 'Total Kasus' :
                    `Kasus ${selectedCrimeType.charAt(0).toUpperCase() + selectedCrimeType.slice(1)}`}
                                </div>
                                <div class="text-xs text-gray-500 mt-1">
                                    Normalized: ${district.normalized_count.toFixed(3)}
                                </div>
                            </div>
                        </div>

                        <div class="text-xs space-y-1">
                            <div class="flex justify-between">
                                <span>Total Kasus:</span>
                                <span class="font-medium">${district.totalCases}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Level Cluster:</span>
                                <span class="font-medium">${getDangerLabel(district.dangerLevel)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>GeoJSON Provinsi:</span>
                                <span class="font-medium">${provinsiCode}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>API Name:</span>
                                <span class="font-medium text-xs">${district.name}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Match Success:</span>
                                <span class="font-medium text-green-600">✅</span>
                            </div>
                        </div>
                    </div>
                </div>
            `)
        } else {
            // This kabupaten is in selected province but has no API data
            console.log('⚠️ No API data for kabupaten:', kabupatenName, 'in province:', provinsiCode)

            layer.setStyle({
                fillColor: '#e5e7eb',
                weight: 1,
                opacity: 0.4,
                color: '#9ca3af',
                fillOpacity: 0.3
            })

            // Add tooltip for areas without data
            layer.bindTooltip(`
                <div class="text-center">
                    <div class="font-medium">${kabupatenName}</div>
                    <div class="text-xs text-gray-500">Data tidak tersedia</div>
                    <div class="text-xs text-gray-400">Provinsi: ${provinsiCode}</div>
                </div>
            `, { permanent: false, direction: 'top' })
        }
    }

    // Prevent SSR/hydration error
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
                    data={kabupatenGeoJSON as any}
                    onEachFeature={onEachFeature}
                    key={`geojson-${selectedRegion}-${districts.length}-${selectedCrimeType}`}
                />
            </MapContainer>
        </div>
    )
}