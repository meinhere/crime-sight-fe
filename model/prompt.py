prompt_summarize = """
Saya memiliki dokumen putusan pengadilan pidana dan ingin Anda merangkum isinya secara sistematis dalam format poin-poin penting. Format yang saya inginkan mencakup:
  1. Identitas Perkara: Nomor dan asal pengadilan.
  2. Terdakwa: Nama lengkap terdakwa.
  3. Dakwaan/Tuduhan: Pasal KUHP yang didakwakan.
  4. Fakta Singkat Kejadian: Waktu, tempat, modus operandi, barang yang dicuri, dan nilai kerugian.
  5. Unsur Terbukti: Sebutkan jika unsur-unsur pasal dinyatakan terbukti.
  6. Putusan Hakim: Amar putusan secara ringkas, termasuk lamanya pidana, status tahanan, dan masa penahanan.
  7. Barang Bukti: Rincian barang bukti dan kepada siapa dikembalikan atau dirampas.
  8. Biaya Perkara: Siapa yang dibebankan dan besarannya.
  9. Hal Memberatkan dan Hal Meringankan: Faktor-faktor yang dipertimbangkan hakim dalam menjatuhkan putusan.
  10. Deskripsi Kejadian: penjelasan singkat tentang gambaran kejadian.
"""

prompt_detail_putusan = """
Saya memiliki dokumen putusan pengadilan pidana dan ingin Anda merangkum isinya dalam format berikut.
{
  "alamat_kejadian": <berisi alamat atau tempat kejadian perkara dengan format dusun (tanpa rt rw), desa, kecamatan, kabupaten, provinsi>
  "status_tahanan": <berisi status tahanan terdakwa saat ini>,
  "lama_tahanan": <berisi lama tahanan terdakwa dalam format tahun dan bulan, contohnya: 1 tahun dan 2 bulan (jka tidak ada tahun tampilkan bulan saja)>,
  "barang_bukti": <berisi barang bukti yang ditemukan secara singkat, disebutkan jumlah dan merk (jika ada), dan tidak perlu disebutkan ciri-cirinya, jika lebih dari 1 barang bukti pisahkan dengan tanda ','>,
  "hasil_putusan": <berisi hasil putusan sidang yang telah dilakukan>,
  "hakim": [
    {
      "nama_hakim": <berisi nama hakim>,
      "jabatan": <berisi nama jabatan hakim>
    },
    ...
  ],
  "terdakwa": [
    {
      "nama_lengkap": <berisi nama lengkap terdakwa>,
      "jenis_kelamin": <berisi nama jenis_kelamin terdakwa (Laki-Laki atau Perempuan)>,
      "alamat": <berisi alamat terdakwa>,
      "tempat_lahir": <berisi tempat lahir terdakwa>,
      "pekerjaan": <berisi pekerjaan terdakwa>,
      "umur": <berisi umur terdakwa (hanya angka)>,
      "kebangsaan": <berisi kebangsaan terdakwa>,
      "agama": <berisi agama terdakwa>,
    },
    ...
  ],
  "penasihat": [
    {
      "nama_penasihat": <berisi nama penasihat>
    },
    ...
  ],
  "penuntut_umum": [
    {
      "nama_penuntut": <berisi nama penuntut>
    },
    ...
  ],
  "saksi": [
    {
      "nama_saksi": <berisi nama saksi>
    },
    ...
  ],
  "lokasi_kejadian_id": <berdasarkan hasil pembacaan dokumen dan memilih salah satu dari pilihan berikut secara tepat: 'Rumah', 'Jalan Umum', 'Perkantoran', 'Pertokoan/Mal/Pusat Perbelanjaan', 'Pasar', 'Persawahan', 'Tempat Parkir', 'Pergudangan', 'SPBU', 'Bank', 'Perairan', 'Pertambangan'>,
  "waktu_kejadian_id": <berdasarkan hasil pembacaan dokumen dan memilih salah satu dari pilihan berikut secara tepat: 'Pagi (06:00 - 11:59)', 'Siang (12:00 - 15:59)', S'ore (16:00 - 18:59)', 'Malam (19:00 - 23:59)', 'Dini Hari (00:00 - 05:59)', 'Tidak Diketahui'>,
  "kode_kabupaten": <berdasarkan hasil pembacaan dokumen untuk melihat kode dari kabupaten atau kota di indonesia (tanpa tambahan tanda baca) contohnya: '3528'>
}
"""