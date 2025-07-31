export interface District {
    id: string
    name: string
    position: [number, number]
    dangerLevel: 'high' | 'medium' | 'low'
    totalCases: number
    crimeTypes: {
        korupsi: number
        narkotika: number
        pencurian: number
        penganiayaan: number
        penggelapan: number
    }
}

export interface YearlyData {
    year: number
    totalCases: number
    crimeTypes: {
        korupsi: number
        narkotika: number
        pencurian: number
        penganiayaan: number
        penggelapan: number
    }
}

// Data kabupaten Madura
export const districtsData: District[] = [
    {
        id: 'bangkalan',
        name: 'Kabupaten Bangkalan',
        position: [-7.0454, 112.7351],
        dangerLevel: 'high',
        totalCases: 42,
        crimeTypes: {
            korupsi: 12,
            narkotika: 8,
            pencurian: 15,
            penganiayaan: 4,
            penggelapan: 3
        }
    },
    {
        id: 'sampang',
        name: 'Kabupaten Sampang',
        position: [-7.1864, 113.2394],
        dangerLevel: 'medium',
        totalCases: 25,
        crimeTypes: {
            korupsi: 6,
            narkotika: 5,
            pencurian: 9,
            penganiayaan: 3,
            penggelapan: 2
        }
    },
    {
        id: 'pamekasan',
        name: 'Kabupaten Pamekasan',
        position: [-7.1568, 113.4746],
        dangerLevel: 'medium',
        totalCases: 18,
        crimeTypes: {
            korupsi: 4,
            narkotika: 3,
            pencurian: 7,
            penganiayaan: 2,
            penggelapan: 2
        }
    },
    {
        id: 'sumenep',
        name: 'Kabupaten Sumenep',
        position: [-7.0167, 113.8667],
        dangerLevel: 'low',
        totalCases: 12,
        crimeTypes: {
            korupsi: 2,
            narkotika: 1,
            pencurian: 6,
            penganiayaan: 2,
            penggelapan: 1
        }
    }
]

export const crimeTypeOptions = [
    { value: 'all', label: 'Semua Jenis Kejahatan' },
    { value: 'korupsi', label: 'Korupsi' },
    { value: 'narkotika', label: 'Narkotika' },
    { value: 'pencurian', label: 'Pencurian' },
    { value: 'penganiayaan', label: 'Penganiayaan' },
    { value: 'penggelapan', label: 'Penggelapan' }
]

export const periodOptions = [
    { value: 'all', label: 'Semua Periode' },
    { value: '7d', label: '7 Hari Terakhir' },
    { value: '30d', label: '30 Hari Terakhir' },
    { value: '3m', label: '3 Bulan Terakhir' },
    { value: '1y', label: '1 Tahun Terakhir' }
]

export const regionOptions = [
    { value: 'all', label: 'Seluruh Indonesia' },
    { value: 'jawa-timur', label: 'Jawa Timur' },
    { value: 'bangkalan', label: 'Kabupaten Bangkalan' },
    { value: 'sampang', label: 'Kabupaten Sampang' },
    { value: 'pamekasan', label: 'Kabupaten Pamekasan' },
    { value: 'sumenep', label: 'Kabupaten Sumenep' }
]


export const yearlyTrendData: YearlyData[] = [
    {
        year: 2020,
        totalCases: 287,
        crimeTypes: {
            korupsi: 78,
            narkotika: 65,
            pencurian: 89,
            penganiayaan: 34,
            penggelapan: 21
        }
    },
    {
        year: 2021,
        totalCases: 321,
        crimeTypes: {
            korupsi: 89,
            narkotika: 72,
            pencurian: 98,
            penganiayaan: 41,
            penggelapan: 21
        }
    },
    {
        year: 2022,
        totalCases: 389,
        crimeTypes: {
            korupsi: 102,
            narkotika: 87,
            pencurian: 123,
            penganiayaan: 52,
            penggelapan: 25
        }
    },
    {
        year: 2023,
        totalCases: 398,
        crimeTypes: {
            korupsi: 98,
            narkotika: 91,
            pencurian: 128,
            penganiayaan: 56,
            penggelapan: 25
        }
    },
    {
        year: 2024,
        totalCases: 356,
        crimeTypes: {
            korupsi: 87,
            narkotika: 79,
            pencurian: 115,
            penganiayaan: 49,
            penggelapan: 26
        }
    },
    {
        year: 2025,
        totalCases: 189,
        crimeTypes: {
            korupsi: 45,
            narkotika: 42,
            pencurian: 67,
            penganiayaan: 23,
            penggelapan: 12
        }
    }
]

// Options untuk filter tahun
export const yearRangeOptions = [
    { value: '3', label: '3 Tahun Terakhir' },
    { value: '5', label: '5 Tahun Terakhir' },
    { value: 'all', label: 'Semua Tahun' },
    { value: 'custom', label: 'Custom Range' }
]