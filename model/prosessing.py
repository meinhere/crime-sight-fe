import re
import string
import os
import pandas as pd
import PyPDF2

"""### **KODE UNTUK KONVERSI PDF KE TXT**"""

# Tentukan direktori input dan output
pdf_directory = '/content/drive/MyDrive/KULIAH/EKSTRAKSI INFORMASI/KUMPULAN_TUGAS/PDF/PDF_FILTERED_B-SUS_FINAL/'
output_directory = '/content/drive/MyDrive/KULIAH/EKSTRAKSI INFORMASI/KUMPULAN_TUGAS/TXT/TXT_FILTERED_B-SUS_FINAL/'

# Buat direktori output jika belum ada
if not os.path.exists(output_directory):
    os.makedirs(output_directory)


total_konversi = 0
# Looping untuk membaca setiap file PDF di direktori
for filename in os.listdir(pdf_directory):

    if filename.endswith(".pdf"):
        # Buka file PDF
        pdf_file = open(pdf_directory + filename, 'rb')
        try:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            total_konversi += 1
        except Exception as e:
            print(f"Error membuka {filename}: {e}")
            continue

        # Inisialisasi variabel untuk menyimpan teks
        text = ''

        # Looping untuk membaca setiap halaman PDF
        for page in range(len(pdf_reader.pages)):
            # Baca teks dari halaman
            page_text = pdf_reader.pages[page].extract_text()
            text += page_text

        # Tutup file PDF
        pdf_file.close()

        text = text.replace("Mahkamah Agung Republik Indonesia\nMahkamah Agung Republik Indonesia\nMahkamah Agung Republik Indonesia\nMahkamah Agung Republik Indonesia\nMahkamah Agung Republik Indonesia\nDirektori Putusan Mahkamah Agung Republik Indonesia\nputusan.mahkamahagung.go.id\n", "")
        text = text.replace("\nDisclaimer\nKepaniteraan Mahkamah Agung Republik Indonesia berusaha untuk selalu mencantumkan informasi paling kini dan akurat sebagai bentuk komitmen Mahkamah Agung untuk pelayanan publik, transparansi dan akuntabilitas\npelaksanaan fungsi peradilan. Namun dalam hal-hal tertentu masih dimungkinkan terjadi permasalahan teknis terkait dengan akurasi dan keterkinian informasi yang kami sajikan, hal mana akan terus kami perbaiki dari waktu kewaktu.\nDalam hal Anda menemukan inakurasi informasi yang termuat pada situs ini atau informasi yang seharusnya ada, namun belum tersedia, maka harap segera hubungi Kepaniteraan Mahkamah Agung RI melalui :\nEmail : kepaniteraan@mahkamahagung.go.id", "")
        text = text.replace('P U T U S A N', 'PUTUSAN').replace('T erdakwa', 'Terdakwa').replace('T empat', 'Tempat').replace('T ahun', 'Tahun')
        text = text.replace('P  E  N  E  T  A  P  A  N', 'PENETAPAN').replace('J u m l a h', 'Jumlah').replace('M E N G A D I L I', 'MENGADILI')
        text = text.replace("Telp : 021-384 3348 (ext.318)", "")

        # Menghapus nomor halaman dan elemen unik
        text = re.sub(r'\b(Halaman|hal\.)\b.*', '', text)
        text = re.sub(r'\nHalaman \d+ dari \d+ .*', '', text)
        text = re.sub(r'\d+\s+Halaman\s+\d+', '', text)
        text = re.sub(r'Halaman \d+ dari \d+ .*', '', text)
        text = re.sub(r'\nHal. \d+ dari \d+ .*', '', text)
        text = re.sub(r'Hal. \d+ dari \d+ .*', '', text)
        text = re.sub(r' +|[\uf0fc\uf0a7\uf0a8\uf0b7]', ' ', text)

        text = text.strip()
        text = re.sub(r'(Nama\s+(lengkap|terdakwa)?\s*:\s*)(.*)', r'\1\3.', text)
        text = re.sub(r'(Tempat\s*lahir\s*:\s*)(.*)', r'\1\2.', text)
        text = re.sub(r'(Umur\s*/\s*tanggal\s*lahir\s*:\s*)(.*)', r'\1\2.', text)
        text = re.sub(r'(Jenis\s*kelamin\s*:\s*)(.*)', r'\1\2.', text)
        text = re.sub(r'(kewarganegaraan\s*:\s*)(.*)', r'\1\2.', text)
        text = re.sub(r'(Kebangsaan\s*:\s*)(.*)', r'\1\2.', text)
        text = re.sub(r'(Tempat\s*tinggal\s*:\s*)(.*)', r'\1\2.', text)
        text = re.sub(r'(Agama\s*:\s*)(.*)', r'\1\2.', text)

        text = re.sub(r'(?<![.;:])\n', ' ', text)
        text = re.sub(r'(\d+)\.\s+', '\n', text)
        text = re.sub(r';\s{1,}', ';\n', text)
        text = re.sub(r':\s{4,}', ':\n', text)
        text = re.sub(r'\s{2,}(\d+)\.\s?', r'\n\1. ', text)
#         text = re.sub(r'(\.)(\S?)', r'\1 \2', text)
        text = re.sub(r'(PUTUSAN)', r'\1\n', text)
        text= re.sub(r'(MENGADILI)', r'\1\n', text)
        text = re.sub(r'[\u2026]+|\.{3,}', '', text)

        output_filename = filename.replace('.pdf', '.txt')
        with open(output_directory + output_filename, 'w', encoding='utf-8') as output_file:
            output_file.write(text)

        print(f"File {filename} telah dikonversi ke TXT")

print(f"Total konversi : {total_konversi}")

"""## **STEP 2 - MENERAPKAN RULE BASED DAN MENYIMPAN HASIL KE CSV**

Setelah file pdf di konversi ke teks dan sekaligus melakakukan pembersihan apda kode di atas, lalu pada tahap ini yaitu menerapkan metode rule based untuk menyimpan informasi penting saja, lalu menyimpannya ke file csv yang nantinya akan menjadi dataset kita untuk ke tahap kedepannya
"""

import re  # Mengimpor modul regular expressions untuk pencarian pola dalam teks
import os  # Mengimpor modul os untuk berinteraksi dengan sistem file
import csv  # Mengimpor modul csv untuk menyimpan data dalam format CSV

def generateEntity(pathFile, fileName):
    folderData = pathFile
    folderHasil = "OUPUT"
    namaFile = fileName
    listHasil = []

    # Membuat folder hasil jika belum ada
    if not os.path.exists(folderHasil):
        os.makedirs(folderHasil)  # Membuat folder hasil

    # Membuka file untuk dibaca
    try:
        with open(os.path.join(folderData, namaFile), "r", encoding='utf-8') as file_putusan:
            baca_baris = file_putusan.readlines()  # Membaca semua baris dari file
            isiFile = ''.join(baca_baris)  # Menggabungkan semua baris menjadi satu string (isi file)
    except UnicodeDecodeError:
        with open(os.path.join(folderData, namaFile), "r", encoding='latin-1') as file_putusan:
            baca_baris = file_putusan.readlines()  # Membaca semua baris dari file
            isiFile = ''.join(baca_baris)  # Menggabungkan semua baris menjadi satu string (isi file)

    # Variabel untuk menyimpan data
    nomor_putusan = ""
    listTerdakwa = []
    tuntutan_pidana = ""
    tuntutanKUHP = ""
    tuntutanHukuman = ""
    putusan_pidana = ""
    putusanHukuman = ""
    tanggalPutusan = ""
    hakimKetua = ""
    hakimAnggota = []
    panitera = ""
    penuntutUmum = ""

    print("\n====== KEPUTUSAN PENGADILAN =====")
    for baris in baca_baris:
        panjang_baris = len(baris)  # Menghitung panjang baris
        if panjang_baris > 3:  # Memproses hanya jika panjang baris lebih dari 3
            baris = baris.lower().strip()  # Mengubah baris menjadi huruf kecil dan menghapus spasi

            # Mendapatkan entitas NOMOR PUTUSAN
            if "pid.b" in baris or "pid.sus" in baris:
                eNomor = re.search(r'\d{1,10}/(.{1,10})/\d{4}/(.{1,7})', baris, re.M | re.I)
                if eNomor:
                    nomor_putusan = eNomor.group().rstrip("\n")  # Menyimpan nomor putusan ke list hasil
                    print("Nomor Putusan : " + nomor_putusan)  # Mencetak nomor putusan

            # Mengambil data terdakwa
            if re.search(r'nama\s+(terdakwa|lengkap)?\s*:', baris, re.I):
                eTerdakwa = re.search(r'nama (lengkap|terdakwa)?\s*:\s*(.*)', baris, re.M | re.I)
                if eTerdakwa:
                    listTerdakwa.append(eTerdakwa.group(2).rstrip("\n"))  # Menyimpan nama terdakwa

            # Mendapatkan entitas TUNTUTAN PIDANA
            if re.search(r'\bmenyatakan\s+(?:mereka\s+)?terdakwa', baris, re.M | re.I):
                ePidana = re.search(r'melakukan\s+tindak\s+pidana\s+(.*?)(sebagaimana|;)', baris, re.M | re.I)
                if ePidana:
                    tuntutan_pidana = ePidana.group(1).strip()  # Menyimpan tuntutan pidana ke list hasil

                eKUHP = re.search(r'pasal\s+(.*?)(kuhp|undang|uu)', baris, re.M | re.I)  # Mencari pasal KUHP atau undang-undang
                if eKUHP:
                    tuntutanKUHP = eKUHP.group().strip()  # Menyimpan pasal ke list hasil

            # Mendapatkan entitas TUNTUTAN HUKUMAN
            if re.search(r'\bmenjatuhkan\s+pidana', baris, re.M | re.I):
                etuntutan = re.search(r'selama (.*)', baris, re.M | re.I)  # Mencari tuntutan hukuman
                if etuntutan:
                    tuntutanHukuman = etuntutan.group(1)  # Menyimpan tuntutan hukuman ke list hasil

            # Mendapatkan entitas PUTUSAN
            if re.search(r'\bmenyatakan\s+(?:mereka\s+)?', baris, re.M | re.I) and "terbukti" in baris:
                ePutPidana = re.search(r'tindak\s+pidana\s+(.*?)(?:sebagaimana|;|\.|$)', baris, re.M | re.I)
                if ePutPidana:
                    putusan_pidana = ePutPidana.group(1).strip()  # Menyimpan putusan pidana ke list hasil

            # Mendapatkan HUKUMAN
            if re.search(r'\bmenjatuhkan\s+pidana', baris, re.M | re.I):
                ePutusan = re.search(r'selama (.*)', baris, re.M | re.I)  # Mencari putusan hukuman
                if ePutusan:
                    putusanHukuman = ePutusan.group(1)  # Menyimpan putusan hukuman ke list hasil

            # Mendapatkan HAKIM KETUA MAJLIS HAKIM
            if re.search(r'diputuskan\s+dalam', baris, re.M | re.I):
                tanggalPutusan = baris[baris.find("hari") + 10:baris.find("oleh")].strip()
                halaman_pattern = r'oleh Halaman (\d+)\s+'
                halaman_match = re.search(halaman_pattern, baris)
                if halaman_match:
                    print("ada halaman")
                    # Jika ditemukan informasi halaman, hapus bagian tersebut dari teks
                    baris = baris.replace(halaman_match.group(), '')
                eHakimKetua = re.search(r'oleh\s+(?:kami,\s+)?(.+?)\s*,', baris)
                if eHakimKetua:
                    hakimKetua = eHakimKetua.group(1).strip()  # Mengambil nama hakim ketua

                eHakimAnggota = re.search(r'hakim\s+ketua\s+(.*?)(masing)', baris, re.M | re.I)
                if eHakimAnggota:
                    hakimAnggota = eHakimAnggota.group(1).strip().split(" dan")  # Mengambil nama hakim anggota

                ePanitera = re.search(r'dibantu\s+(?:oleh\s+)?(.*?)(?:\s+sebagai)?\s+panitera\s+pengganti', baris, re.M | re.I)
                if ePanitera:
                    panitera = ePanitera.group(1).strip()  # Mengambil nama panitera

                ePenuntut = re.search(r'dihadiri\s+(?:oleh\s+)?(.*?)(?:\s+sebagai)?\s+(?:Jaksa\s*/\s*)?penuntut\s+umum', baris, re.M | re.I)
                if ePenuntut:
                    penuntutUmum = ePenuntut.group(1).strip()  # Mengambil nama penuntut umum

                # Mencetak hasil akhir
                print(f"Tanggal Putusan: {tanggalPutusan}")
                print(f"Hakim Ketua: {hakimKetua}")
                print(f"Hakim Anggota: {', '.join(hakimAnggota)}")
                print(f"Panitera: {panitera}")
                print(f"Penuntut Umum: {penuntutUmum}")

                # Menyimpan hasil ke dalam list dengan tambahan nama file dan isi file
                listHasil.append((namaFile,
                                  nomor_putusan,
                                  listTerdakwa[0] if len(listTerdakwa) > 0 else "",
                                  listTerdakwa[1] if len(listTerdakwa) > 1 else "",
                                  listTerdakwa[2] if len(listTerdakwa) > 2 else "",
                                  tuntutan_pidana,
                                  tuntutanKUHP,
                                  tuntutanHukuman,
                                  putusan_pidana,
                                  putusanHukuman,
                                  tanggalPutusan,
                                  hakimKetua,
                                  hakimAnggota[0] if len(hakimAnggota) > 0 else "",
                                  hakimAnggota[1] if len(hakimAnggota) > 1 else "",
                                  panitera,
                                  penuntutUmum,
                                  isiFile
                                 ))

    return listHasil

def saveToCSV(data, outputFile):
    # Menyimpan data ke file CSV
    with open(outputFile, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['nama_file','Nomor Putusan', 'Nama Terdakwa 1', 'Nama Terdakwa 2', 'Nama Terdakwa 3',
                         'Tuntutan Pidana', 'Tuntutan KUHP', 'Tuntutan Hukuman',
                         'Putusan Pidana', 'Putusan Hukuman', 'Tanggal Putusan',
                         'Hakim Ketua', 'Hakim Anggota 1', 'Hakim Anggota 2',
                         'Panitera', 'Penuntut Umum','content'])
        writer.writerows(data)

if __name__ == '__main__':
    folderData = "/content/drive/MyDrive/KULIAH/EKSTRAKSI INFORMASI/KUMPULAN_TUGAS/TXT/TXT_FILTERED_B-SUS_FINAL"
    outputFile = "/content/drive/MyDrive/KULIAH/EKSTRAKSI INFORMASI/KUMPULAN_TUGAS/DATASET/DATASET_PUTUSAN_PIDB_SUS_FINAL.csv"  # File output CSV

    all_data = []  # List untuk menyimpan semua data

    # Mengiterasi semua file dalam folder
    for file_name in os.listdir(folderData):
        if file_name.endswith(".txt"):  # Memastikan hanya memproses file .txt
            extracted_data = generateEntity(folderData, file_name)  # Mengambil entitas dari setiap file
            all_data.extend(extracted_data)  # Menambahkan data yang diekstrak ke dalam list semua data

    # Menyimpan semua data ke CSV
    saveToCSV(all_data, outputFile)
    print(f"Data berhasil disimpan dalam file: {outputFile}")

"""### **MENAMPILKAN DATASET YANG SUDAH DIBUAT**"""

df = pd.read_csv("/content/drive/MyDrive/KULIAH/EKSTRAKSI INFORMASI/KUMPULAN_TUGAS/DATASET/DATASET_PUTUSAN_PIDB_SUS_FINAL.csv")
df.head(100)

df.shape

df.isnull().sum()

df = df.dropna(subset=['Nomor Putusan', 'Nama Terdakwa 1','Hakim Ketua', 'Tuntutan Hukuman', 'Putusan Hukuman', 'Penuntut Umum'])
df.shape

"""Total datasetnya 201 baris"""

df.to_csv("/content/drive/MyDrive/KULIAH/EKSTRAKSI INFORMASI/KUMPULAN_TUGAS/DATASET/DATASET_PUTUSAN_PIDB_SUS_CLEN.csv")