export interface CaseData {
    id: string
    title: string
    location: string
    defendant: string
    charges: string
    victim: string
    verdict: string
    punishment: string
    amount: string
    document: string
    summary: string
    date: string
    court: string
    caseNumber: string
}

export const casesData: CaseData[] = [
    {
        id: "case-001",
        title: "Perkara Tindak Pidana Korupsi atas Nama Ir. Budi Santoso dan Hendra Wijaya Dana Bantuan Sosial",
        location: "Surabaya, Jawa Timur",
        defendant: "Ir. Budi Santoso (Kepala Dinas PU), Hendra Wijaya (Direktur PT. Maju Lancar)",
        charges: "Sek. Ron Kartika, Tim Audit BPK",
        victim: "Hakim. Dr. Rachmad Hidayat",
        verdict: "Status Sidang: Putusan dibacakan",
        punishment: "Hukuman mati dan denda 1.5 milliar Rupiah",
        amount: "1.5 milliar Rupiah",
        document: "Lihat dokumen",
        summary: "Kasus korupsi dana bantuan sosial senilai 1.5 milliar rupiah yang melibatkan pejabat dinas PU dan direktur perusahaan swasta. Terdakwa terbukti melakukan penyalahgunaan wewenang dalam penyaluran dana bantuan sosial.",
        date: "2024-01-15",
        court: "Pengadilan Negeri Surabaya",
        caseNumber: "PN.SBY/Pid.Sus/2024/001"
    },
    {
        id: "case-002",
        title: "Perkara Pembunuhan Berencana atas Nama Riko Pratama terhadap Korban Melati Ayu di Wilayah Dago, Bandung",
        location: "Bandung, Jawa Barat",
        defendant: "Riko Pratama (25 tahun)",
        charges: "Pembunuhan berencana Pasal 340 KUHP",
        victim: "Melati Ayu (23 tahun)",
        verdict: "Status Sidang: Vonis dijatuhkan",
        punishment: "Hukuman penjara 15 tahun",
        amount: "Denda 50 juta Rupiah",
        document: "Lihat dokumen",
        summary: "Kasus pembunuhan berencana yang terjadi di kawasan Dago, Bandung. Terdakwa terbukti merencanakan dan melaksanakan pembunuhan terhadap korban karena motif dendam pribadi.",
        date: "2024-02-20",
        court: "Pengadilan Negeri Bandung",
        caseNumber: "PN.BDG/Pid.Sus/2024/047"
    },
    {
        id: "case-003",
        title: "Perkara Tindak Pidana Peretasan Sistem Perbankan oleh Terdakwa Kevin Aditya di Jakarta Selatan",
        location: "Jakarta Selatan, DKI Jakarta",
        defendant: "Kevin Aditya (28 tahun)",
        charges: "Kejahatan Siber Pasal 30 UU ITE",
        victim: "Bank Mandiri",
        verdict: "Status Sidang: Dalam proses",
        punishment: "Belum dijatuhkan",
        amount: "Kerugian 2.3 milliar Rupiah",
        document: "Lihat dokumen",
        summary: "Kasus peretasan sistem perbankan yang mengakibatkan kerugian miliaran rupiah. Terdakwa menggunakan teknik social engineering dan malware untuk mengakses sistem bank.",
        date: "2024-03-10",
        court: "Pengadilan Negeri Jakarta Selatan",
        caseNumber: "PN.JKS/Pid.Sus/2024/089"
    },
    {
        id: "case-004",
        title: "Perkara Pencurian Kendaraan Bermotor oleh Komplotan Terdakwa di Denpasar, Bali",
        location: "Denpasar, Bali",
        defendant: "Ahmad Fajar (24 tahun), Rizki Pratama (26 tahun), Dedi Susanto (30 tahun)",
        charges: "Pencurian dengan Pemberatan Pasal 363 KUHP",
        victim: "Warga Denpasar (Multiple)",
        verdict: "Status Sidang: Putusan dibacakan",
        punishment: "Hukuman penjara 3-5 tahun masing-masing",
        amount: "Denda 25 juta Rupiah per orang",
        document: "Lihat dokumen",
        summary: "Kasus pencurian kendaraan bermotor yang dilakukan secara sistematis oleh komplotan. Total 15 sepeda motor berhasil dicuri dalam kurun waktu 3 bulan.",
        date: "2024-01-28",
        court: "Pengadilan Negeri Denpasar",
        caseNumber: "PN.DPS/Pid.Sus/2024/032"
    },
    {
        id: "case-005",
        title: "Perkara Tindak Pidana Narkotika Jenis Sabu-sabu oleh Jaringan Internasional di Medan",
        location: "Medan, Sumatera Utara",
        defendant: "Tony Wijaya (35 tahun), Maria Santos (29 tahun)",
        charges: "Pasal 114 ayat (2) UU No. 35 Tahun 2009",
        victim: "Masyarakat luas",
        verdict: "Status Sidang: Vonis dijatuhkan",
        punishment: "Hukuman mati (Tony), Penjara seumur hidup (Maria)",
        amount: "Denda 1 milliar Rupiah",
        document: "Lihat dokumen",
        summary: "Kasus narkotika internasional dengan barang bukti 50 kg sabu-sabu. Jaringan ini beroperasi lintas negara dengan melibatkan sindikat Malaysia.",
        date: "2024-02-14",
        court: "Pengadilan Negeri Medan",
        caseNumber: "PN.MDN/Pid.Sus/2024/018"
    },
    {
        id: "case-006",
        title: "Perkara Penipuan Investasi Bodong dengan Kerugian 10 Milliar Rupiah di Yogyakarta",
        location: "Yogyakarta, DI Yogyakarta",
        defendant: "Sari Dewi (42 tahun), Bambang Hartono (45 tahun)",
        charges: "Penipuan Pasal 378 KUHP",
        victim: "1.200 investor",
        verdict: "Status Sidang: Dalam proses",
        punishment: "Belum dijatuhkan",
        amount: "Kerugian 10 milliar Rupiah",
        document: "Lihat dokumen",
        summary: "Skema ponzi dengan kedok investasi emas yang merugikan ribuan investor. Modus operandi menggunakan iming-iming keuntungan 30% per bulan.",
        date: "2024-03-05",
        court: "Pengadilan Negeri Yogyakarta",
        caseNumber: "PN.YGY/Pid.Sus/2024/067"
    }
]