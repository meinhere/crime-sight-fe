export interface ApiClusterItem {
  name: string
  count: number
  level: "Tinggi" | "Sedang" | "Rendah"
  normalized_count: number
}

export interface ApiClusterResponse {
  data: ApiClusterItem[]
  meta: {
    total_records: number
    filters: {
      jenis_kejahatan: string | null
      tahun: number | null
      provinsi: string | null
    }
  }
}

export interface ClusterFilters {
  jenis_kejahatan?: string
  tahun?: number
  provinsi?: string
}

export interface District {
  id: string
  name: string
  position: [number, number]
  totalCases: number
  dangerLevel: 'high' | 'medium' | 'low'
  normalized_count: number
  provinsi_kode?: string
  crimeTypes: {
    [key: string]: number
  }
}

export interface ProvinsiInfo {
  kode_provinsi: string
  nama_provinsi: string
  lat: number
  lang: number
}