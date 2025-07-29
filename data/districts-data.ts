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

// Data kabupaten (saat ini hanya Madura, nanti akan bertambah)
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