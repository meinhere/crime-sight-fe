export interface DocumentSummary {
    id: string
    fileName: string
    fileSize: string
    uploadDate: string
    summary: {
        hakim: string
        terdakwa: string
        jenisKejahatan: string
        pasal: string
        korban: string
        lokasi: string
        tanggalKejadian: string
        statusPutusan: string
        vonis: string
        denda: string
        pertimbangan: string[]
        faktaHukum: string[]
        kesimpulan: string
    }
}

export const dummySummaryData: DocumentSummary = {
    id: "doc-001",
    fileName: "Putusan_Korupsi_Budi_Santoso.pdf",
    fileSize: "2.3 MB",
    uploadDate: new Date().toISOString(),
    summary: {
        hakim: "Dr. Rachmad Hidayat, S.H., M.H.",
        terdakwa: "Ir. Budi Santoso (Kepala Dinas PU) dan Hendra Wijaya (Direktur PT. Maju Lancar)",
        jenisKejahatan: "Tindak Pidana Korupsi Dana Bantuan Sosial",
        pasal: "Pasal 2 ayat (1) jo. Pasal 18 UU No. 31 Tahun 1999 jo. UU No. 20 Tahun 2001",
        korban: "Masyarakat dan Negara",
        lokasi: "Surabaya, Jawa Timur",
        tanggalKejadian: "Januari 2023 - September 2023",
        statusPutusan: "Putusan telah berkekuatan hukum tetap",
        vonis: "Hukuman penjara 8 tahun dan denda 1.5 milliar rupiah",
        denda: "Rp 1.500.000.000 (satu milliar lima ratus juta rupiah)",
        pertimbangan: [
            "Terdakwa telah terbukti secara sah dan meyakinkan melakukan tindak pidana korupsi",
            "Perbuatan terdakwa merugikan keuangan negara dalam jumlah yang sangat besar",
            "Terdakwa tidak menunjukkan itikad baik untuk mengembalikan kerugian negara",
            "Perbuatan terdakwa merusak kepercayaan masyarakat terhadap pemerintah",
            "Diperlukan efek jera agar tidak ada pejabat lain yang melakukan hal serupa"
        ],
        faktaHukum: [
            "Terdakwa menyalahgunakan wewenang dalam pengadaan barang dan jasa",
            "Adanya mark-up harga proyek infrastruktur sebesar 60% dari harga wajar",
            "Terdakwa menerima suap dari kontraktor sebesar Rp 300.000.000",
            "Dokumen proyek dipalsukan untuk menutupi jejak korupsi",
            "Saksi ahli menyatakan adanya kerugian negara sebesar Rp 1.500.000.000"
        ],
        kesimpulan: "Berdasarkan fakta-fakta yang terungkap di persidangan, terdakwa terbukti melakukan tindak pidana korupsi yang merugikan keuangan negara. Majelis hakim memutuskan untuk menjatuhkan pidana penjara dan denda sebagai bentuk pertanggungjawaban atas perbuatan yang dilakukan."
    }
}