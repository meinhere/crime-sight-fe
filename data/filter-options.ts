import { provinsi } from './provinsi'

// Crime type options - dummy data for now since API doesn't support filtering yet
export const crimeTypeOptions = [
    { value: 'all', label: 'Semua Jenis Kejahatan' },
    { value: 'korupsi', label: 'Korupsi' },
    { value: 'pencurian', label: 'Pencurian' },
    { value: 'narkoba', label: 'Narkoba' },
    { value: 'penipuan', label: 'Penipuan' },
    { value: 'pembunuhan', label: 'Pembunuhan' },
    { value: 'pemerkosaan', label: 'Pemerkosaan' },
    { value: 'penggelapan', label: 'Penggelapan' },
    { value: 'kekerasan', label: 'Kekerasan' },
    { value: 'penganiayaan', label: 'Penganiayaan' },
    { value: 'perampokan', label: 'Perampokan' },
    { value: 'penculikan', label: 'Penculikan' }
]

// ✅ Period options - Updated with more recent years and better range
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

// Crime type mapping for API calls (when API supports it)
export const crimeTypeApiMapping: { [key: string]: string } = {
    'korupsi': 'Korupsi',
    'pencurian': 'Pencurian',
    'narkoba': 'Narkoba',
    'penipuan': 'Penipuan',
    'pembunuhan': 'Pembunuhan',
    'pemerkosaan': 'Pemerkosaan',
    'penggelapan': 'Penggelapan',
    'kekerasan': 'Kekerasan',
    'penganiayaan': 'Penganiayaan',
    'perampokan': 'Perampokan',
    'penculikan': 'Penculikan'
}