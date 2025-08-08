// data/filter-options.ts - Update dengan dummy data
import { provinsi } from './provinsi'

// ✅ Crime type options - menggunakan data dummy sesuai permintaan
export const crimeTypeOptions = [
    { value: 'all', label: 'Semua Jenis Kejahatan' },
    { value: 'pencurian', label: 'Pencurian' },
    { value: 'penganiayaan', label: 'Penganiayaan' },
    { value: 'pembunuhan', label: 'Pembunuhan' },
    { value: 'penghinaan', label: 'Penghinaan' },
    { value: 'penipuan', label: 'Penipuan' },
    { value: 'perlindungan_anak', label: 'Perlindungan Anak' }
]

// Period options
export const periodOptions = [
    { value: 'all', label: 'Semua Tahun' },
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
    { value: '2019', label: '2019' },
    { value: '2018', label: '2018' },
    { value: '2017', label: '2017' },
    { value: '2016', label: '2016' },
    { value: '2015', label: '2015' }
]

// Region options - generated from real province data
export const regionOptions = [
    { value: 'all', label: 'Seluruh Indonesia' },
    ...provinsi.map(prov => ({
        value: prov.kode_provinsi,
        label: prov.nama_provinsi
    }))
]

// Helper functions for province data
export const getProvinsiByKode = (kode: string) => {
    return provinsi.find(p => p.kode_provinsi === kode)
}

export const getProvinsiName = (kode: string) => {
    const prov = getProvinsiByKode(kode)
    return prov ? prov.nama_provinsi : kode
}

// ✅ Helper function to get crime type label
export const getCrimeTypeLabel = (value: string): string => {
    const option = crimeTypeOptions.find(opt => opt.value === value)
    return option?.label || value
}

// ✅ Helper function to convert filter value to API format
export const getCrimeTypeForAPI = (value: string): string => {
    const mapping: Record<string, string> = {
        'pencurian': 'Pencurian',
        'penganiayaan': 'Penganiayaan',
        'pembunuhan': 'Pembunuhan',
        'penghinaan': 'Penghinaan',
        'penipuan': 'Penipuan',
        'perlindungan_anak': 'Perlindungan Anak'
    }

    return mapping[value] || value
}