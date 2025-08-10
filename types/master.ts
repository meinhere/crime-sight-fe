export interface Provinsi {
    kode_provinsi: string
    nama_provinsi: string
}

export interface MasterProvinsiResponse {
    data: Provinsi[]
}

export interface MasterTahunResponse {
    data: number[]
}

export interface MasterJenisKejahatanResponse {
    data: string[]
}