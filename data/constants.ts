export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  ENDPOINTS: {
    CLUSTER: '/api/cluster',
    TRENDS: '/api/trends',
    MASTER_PROVINSI: '/api/master/provinsi',
    MASTER_TAHUN: '/api/master/tahun',
    MASTER_JENIS_KEJAHATAN: '/api/master/jenis-kejahatan'
  }
} as const

export const MAP_CONFIG = {
  DEFAULT_CENTER: [-2.5, 118.0] as [number, number],
  DEFAULT_ZOOM: 5,
  PROVINCE_ZOOM: 8,
  KABUPATEN_ZOOM: 10
} as const

export const DANGER_COLORS = {
  high: '#ef4444',    // Red
  medium: '#eab308',  // Yellow
  low: '#22c55e',     // Green
  default: '#6b7280'  // Gray
} as const

export const DANGER_LABELS = {
  high: 'Tinggi',
  medium: 'Sedang',
  low: 'Rendah'
} as const

export const LOADING_MESSAGES = {
  MAP: 'Memuat peta Indonesia...',
  DATA: 'Memuat data clustering...',
  PROCESSING: 'Memproses data wilayah'
} as const

export const ERROR_MESSAGES = {
  FETCH_FAILED: 'Gagal memuat data dari server',
  NETWORK_ERROR: 'Tidak dapat terhubung ke server',
  DATA_NOT_FOUND: 'Data tidak ditemukan'
} as const

// Province code mapping for better debugging
export const PROVINCE_CODE_MAP: { [key: string]: string } = {
  '11': 'Aceh',
  '12': 'Sumatera Utara',
  '13': 'Sumatera Barat',
  '14': 'Riau',
  '15': 'Jambi',
  '16': 'Sumatera Selatan',
  '17': 'Bengkulu',
  '18': 'Lampung',
  '19': 'Kepulauan Bangka Belitung',
  '21': 'Kepulauan Riau',
  '31': 'DKI Jakarta',
  '32': 'Jawa Barat',
  '33': 'Jawa Tengah',
  '34': 'DI Yogyakarta',
  '35': 'Jawa Timur',
  '36': 'Banten',
  '51': 'Bali',
  '52': 'Nusa Tenggara Barat',
  '53': 'Nusa Tenggara Timur',
  '61': 'Kalimantan Barat',
  '62': 'Kalimantan Tengah',
  '63': 'Kalimantan Selatan',
  '64': 'Kalimantan Timur',
  '65': 'Kalimantan Utara',
  '71': 'Sulawesi Utara',
  '72': 'Sulawesi Tengah',
  '73': 'Sulawesi Selatan',
  '74': 'Sulawesi Tenggara',
  '75': 'Gorontalo',
  '76': 'Sulawesi Barat',
  '81': 'Maluku',
  '82': 'Maluku Utara',
  '91': 'Papua',
  '92': 'Papua Barat'
} as const