import requests
import time
import warnings
from bs4 import BeautifulSoup
import re
import csv
import os
import os.path
from github import Github
from dotenv import load_dotenv
load_dotenv()

# Replace with your personal access token
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
# Replace with your username and repository name
REPO_OWNER = os.getenv('REPO_OWNER')
REPO_NAME = os.getenv('REPO_NAME')
FILE_PATH = "https://github.com/meinhere/clustering-kejahatan/data_scrap/hasil_list_url.txt"
COMMIT_MESSAGE = "Update hasil_list_url.txt"

"""*   **request** digunakan untuk melakukan permintaan HTTP untuk mengakses konten dari website
*   **time**  digunakan untuk menghitung eksekusi dari proses program
*   **warnnings** digunakan untuk menonaktifkan peringatan

*   **BeautifulSoup** dari bs4  digunakan untuk memparsing html dan mengambil elemen elemen bahkan text dari elemen itu dari halaman website
*   **re** digunakan untuk pencocokan pola menggunakan regular expression
*   **csv** untuk menulis dan menyimpan data dalam format csv
*   **os**  digunakan ketika ingin berinteraksi dengan sistem operasi seperti membuat direktori

### Kode untuk mengambil link putusan
"""

def getURLfromWeb(url):
    response = requests.get(url, verify=False)

    htmlCode1 = BeautifulSoup(response.text, 'html.parser')
    result1 = htmlCode1.findAll('a')

    urlHasil=[] # tempat untuk menyimpan kumpulan url perhalaman
    for eachResult1 in result1:
        cariURLawal=str(eachResult1).find('https://putusan3.mahkamahagung.go.id/direktori/putusan/')
        cariURLakhir=str(eachResult1).find('html">Putusan') + 4
        if cariURLawal == 9 and cariURLakhir >= 4:
            cariURL=str(eachResult1)[cariURLawal:cariURLakhir]
            urlHasil.append(cariURL)
    return urlHasil

def main():
    warnings.filterwarnings('ignore')
    url = "https://putusan3.mahkamahagung.go.id/direktori/index/pengadilan/pn-banyuwangi/kategori/pidana-umum-1"

    end = 107 + 1
    listHasil = []
    start = 57

    startTime = time.time()
    
    for i in range(start, end):
        url = f"{url}/page/{i}.html"
        listHasil = getURLfromWeb(url)
        print(f"--- PAGE {i}")
        NEW_CONTENT = ''

        for listURL in listHasil:
            NEW_CONTENT += f"{listURL}\n"

        try:
            g = Github(GITHUB_TOKEN)
            repo = g.get_user(REPO_OWNER).get_repo(REPO_NAME)

            try:
                # Try to get the file to update it
                contents = repo.get_contents(FILE_PATH)
                repo.update_file(contents.path, COMMIT_MESSAGE, NEW_CONTENT, contents.sha)
                print(f"File '{FILE_PATH}' updated successfully.")
            except Exception:
                # If the file doesn't exist, create it
                repo.create_file(FILE_PATH, COMMIT_MESSAGE, NEW_CONTENT)
                print(f"File '{FILE_PATH}' created successfully.")

        except Exception as e:
            print(f"An error occurred: {e}")

    # file_hasil.close()
    g.close()
    endTime = time.time()
    print(listHasil)
    print('Time Processing : ', endTime-startTime, ' Second')

main()

# """pada fungsi **getURLfromWeb** digunakan untuk melakukan proses pengambilan url putusan yang dinginkan pada halaman putusan pengadilan negeri banyuwangi


# ## **STEP 2 - Mendapatkan MetaData Putusan**

# Pada step 2 ini nertujuan untuk mendapatkan metaData dari url yang kita sudah dapatkan, berikut contoh halaman yang metadanya ingin kita ambil https://putusan3.mahkamahagung.go.id/direktori/putusan/zaec82579b6441609a3f313233353332.html. yang ingin kita ambil yaitu terdakwa, penuntut umum, sampai link pdf putusannya. Semua akan disimpan ke dalam format csv yang akan dijadikan dataset

# ### Kode untuk generate Meta (mengambil Metadata)
# """

# def generateMeta(urlMeta):

#     url = str(urlMeta).strip()
#     response = requests.get(url, verify=False)
#     print(response)

#     soup = BeautifulSoup(response.text, 'html.parser')
#     cleanTags = re.compile('<.*?>')

#     # list data yang akan di ambil
#     listMetaHead = ["terdakwa", "penuntut_umum", "nomor", "tingkat_proses", "klasifikasi", "kata_kunci", "tahun", "tanggal_register",
#               "lembaga_peradilan", "jenis_lembaga_peradilan", "hakim_ketua", "hakim_anggota", "panitera", "amar",
#               "amar_lainnya", "catatan_amar", "tanggal_musyawarah", "tanggal_dibacakan", "kaidah", "abstrak", "url"]

#     listMeta = []

#     rowsMETA1 = soup.find("ul", {"class": "portfolio-meta nobottommargin"}).find("table").findAll("tr")
#     rowsMETA2 = soup.findAll("ul", {"class": "portfolio-meta nobottommargin"})

#     #print('-------------------------')
#     for row in rowsMETA1:
#         coll = row.findAll("td")

#         cleantext2 =''
#         cleantext1 =''

#         if len(coll) > 1:
#             cleantext2 = (re.sub(cleanTags, '', str(coll[1]))).strip()
#             listMeta.append(cleantext2.replace('\n',' '))
#         else:
#             cleantext1 = (re.sub(cleanTags, ' ', str(coll[0]))).strip()
#             # untuk putusan pidana akan muncul terdakwa dan penuntut umum pada meta
#             # sedangkan untuk putusan selain pidana tidak muncul

#             pidorpdt = re.search( r'(.*)/Pdt.(.*)',str(cleantext1), re.M|re.I)

#             # check dokumen putusannya pidana atau perdata
#             if pidorpdt == None:
#                 entTerdakwah = re.search( r'(.*)Terdakwa:(.*)',str(cleantext1), re.M|re.I)
#                 entPenuntut = re.search( r'Penuntut Umum:(.*)Terdakwa:',str(cleantext1), re.M|re.I)
#             else:
#                 entTerdakwah = re.search( r'(.*)Tergugat:(.*)',str(cleantext1), re.M|re.I)
#                 entPenuntut = re.search( r'Penggugat:(.*)Tergugat:',str(cleantext1), re.M|re.I)

#             if entTerdakwah == None:
#                 listMeta.append("")
#             else:
#                 listMeta.append(entTerdakwah.group(2))

#             if entPenuntut == None:
#                 listMeta.append("")
#             else:
#                 listMeta.append(entPenuntut.group(1))
#     # proses url dokumen
#     urlDL = rowsMETA2[1].findAll("li")
#     urlDLStr = str(urlDL[4])
#     listMeta.append(urlDLStr[urlDLStr.find("https"):urlDLStr.find('">')])

#     return listMeta

# """Fungsi `generateMeta()` bertujuan untuk mengambil metadata dari sebuah halaman web dengan melakukan permintaan HTTP GET ke URL yang diberikan, kemudian memparsing teks HTML respons menggunakan BeautifulSoup. Fungsi ini mengekstrak berbagai metadata terkait putusan pengadilan, seperti nama terdakwa, penuntut umum, nomor kasus, tingkat proses, dan URL dokumen. Metadata yang diambil berasal dari elemen-elemen HTML tertentu, yang diproses menggunakan teknik pencarian tag HTML dan regex untuk membedakan apakah dokumen tersebut adalah putusan pidana atau perdata. Jika regex menemukan data yang sesuai, seperti nama terdakwa atau tergugat, data tersebut akan ditambahkan ke dalam daftar metadata. Selain itu, fungsi ini juga mengekstrak URL dokumen dari halaman. Hasil akhirnya adalah daftar metadata yang berisi informasi penting yang telah diekstrak dan dibersihkan dari halaman web tersebut.

# ### Kode untuk generate kedalam format csv

# Setelah dapat metadatanya nah informasi tersebut akan di simpan ke format csv
# """

# def generateFileCSV(listHasil,csvName1):

# 	csvName = csvName1 #nama file csv

# 	if os.path.exists(csvName): # cek ada atau belum
# 		# jika ada maka akan menambahkan
# 		f = open(csvName, 'a', newline='\n')
# 		print(f)
# 		print("ada")
# 		w = csv.writer(f)

# 	else:
# 		# jika tidaka da maka akan membuat baru
# 		f = open(csvName, 'w', newline='\n')
# 		print(f)
# 		print("tidak ada")
# 		# menambahkan baris pertama (header)
# 		w = csv.writer(f)
# 		w.writerow(("terdakwa", "penuntut_umum", "nomor", "tingkat_proses", "klasifikasi", "kata_kunci", "tahun", "tanggal_register",
#               "lembaga_peradilan", "jenis_lembaga_peradilan", "hakim_ketua", "hakim_anggota", "panitera", "amar",
#               "amar_lainnya", "catatan_amar", "tanggal_musyawarah", "tanggal_dibacakan", "kaidah", "abstrak", "url"))

# 	# menulis file csv
# 	for s in listHasil:
# 		# mengiterasi data list hasil satu persatu lalu dimasukkan seusai dengan kolomnya
# 		w.writerow(s)
# 	#tutup file
# 	f.close()
# 	berhasil = "\nCreate Csv file Berhasil\n"
# 	return berhasil

# """Fungsi `generateFileCSV()` bertujuan untuk membuat atau menambahkan data ke dalam file CSV. Fungsi ini menerima dua parameter: `listHasil`, yaitu daftar data yang akan dimasukkan ke dalam file CSV, dan `csvName1`, yang merupakan nama file CSV. Pertama, fungsi memeriksa apakah file dengan nama yang diberikan sudah ada menggunakan `os.path.exists()`. Jika file sudah ada, fungsi membuka file tersebut dalam mode append untuk menambahkan data baru ke bagian akhir file. Jika file belum ada, fungsi membuat file baru dalam mode write dan menambahkan header berisi nama-nama kolom yang sesuai seperti `terdakwa`, `penuntut_umum`, `nomor`, dan sebagainya. Setelah itu, fungsi menulis setiap elemen dari listHasil ke file CSV baris demi baris. Terakhir, file CSV ditutup untuk memastikan data tersimpan dengan benar, dan fungsi mengembalikan pesan bahwa pembuatan atau penambahan data ke file CSV telah berhasil.

# ### Kode utama untuk mengambil metada dari pagenya dan menyimpan ke format csv
# """

# def main():

#     warnings.filterwarnings('ignore')

#     fileListURL = "/content/drive/MyDrive/Colab Notebooks/INFORMATION EXTRACTION/hasilListURLNEW_TEST.txt"
#     fileMetaCSV = "/content/drive/MyDrive/Colab Notebooks/INFORMATION EXTRACTION/metaPidananUmumPN-Banyuwangi_new-Page-57-107_NEW_TEST.csv"
#     listHasil =[]

#     startTime = time.time()
#     # membaca setiap link pada file txt
#     openfileListURL = open(fileListURL, "r", encoding='UTF8')
#     bacaListURL = openfileListURL.readlines()

#     ukuran_batch = 200

#     i = 1
#     for barisURL in bacaListURL:
#         try:
#             # ekstrak informasi metadata
#             hasil = generateMeta(str(barisURL))
#             listHasil.append(hasil)
#             print(f"link ke - {i} berhasil diproses.")

#             if len(listHasil) >= ukuran_batch:
#                 generateFileCSV(listHasil, fileMetaCSV)
#                 listHasil = []
#         except Exception as e:
#             print(f"Error Get Meta Inf, {e}")
#         i=i+1

#     createFile = generateFileCSV(listHasil,fileMetaCSV)

#     openfileListURL.close()
#     endTime = time.time()
#     print('Time Processing : ', endTime-startTime, ' Second')

# main()

# """Fungsi `main()` berfungsi sebagai program utama yang mengatur proses pengambilan dan penyimpanan metadata dari beberapa halaman web dalam bentuk CSV. Pertama, fungsi ini menonaktifkan peringatan menggunakan `warnings.filterwarnings('ignore')` dan menetapkan dua variabel: `fileListURL`, yang berisi path ke file teks dengan daftar URL yang akan diekstrak, serta `fileMetaCSV`, yaitu path di mana hasil metadata akan disimpan dalam file CSV. Data metadata yang dihasilkan akan disimpan sementara dalam `listHasil`. Fungsi ini kemudian mencatat waktu mulai pemrosesan dengan `time.time()`.

# Setelah itu, fungsi membuka dan membaca file teks `fileListURL` yang berisi daftar URL. Setiap baris di file tersebut berisi URL yang akan diproses untuk mengekstraksi metadata menggunakan fungsi `generateMeta()` yang telah dijelaskan sebelumnya. Fungsi `generateMeta()` digunakan di dalam loop yang mengiterasi setiap URL. Metadata dari setiap URL yang berhasil diproses ditambahkan ke dalam `listHasil`, dan setiap kali jumlah hasil mencapai batas ukuran batch yang ditentukan (`ukuran_batch = 200`), fungsi `generateFileCSV()` dipanggil untuk menyimpan metadata yang terkumpul ke file CSV. Fungsi ini bertugas menulis data ke file CSV, baik dengan membuat file baru atau menambahkannya jika sudah ada, seperti yang dijelaskan sebelumnya.

# Jika terjadi kesalahan saat memproses URL tertentu, program menangkap pengecualian menggunakan blok `try-except`, dan melanjutkan ke URL berikutnya, sambil mencatat kesalahan. Setelah semua URL diproses, sisa metadata yang belum tersimpan dalam batch terakhir akan disimpan ke file CSV menggunakan `generateFileCSV()`. File yang dibuka untuk membaca URL kemudian ditutup, dan waktu total yang dibutuhkan untuk memproses semua URL dihitung dan ditampilkan.

# Secara keseluruhan, fungsi `main()` mengatur alur kerja utama dengan memanfaatkan fungsi `generateMeta()` untuk ekstraksi metadata dari setiap URL dan fungsi `generateFileCSV()` untuk menyimpan hasil tersebut ke file CSV dalam batch. Kedua fungsi ini bekerja bersama-sama untuk memastikan proses pengekstrakan metadata dari sejumlah URL berjalan dengan efisien dan data hasilnya tersimpan dengan benar.

# ## **STEP 3 - Prepocessing Dataset MetaData**

# Pada taham ini bertujuan untuk memberishkan dataset yang sudah kita dpatkan, yang nantinya kita akan menghapus baris data yang mempunyai missing vale pada kolom url pdfnya, karena pada tahep selanjutnya ialah kita mengunduh file pdf yang ada pada kolom url pdfnya

# ### Import Library yang digunakan
# """

# import pandas as pd

# """### Load Dataset"""

# file_path = "/content/drive/MyDrive/Colab Notebooks/INFORMATION EXTRACTION/metaPidananUmumPN-Banyuwangi_new-Page-57-107_NEW.csv"
# data = pd.read_csv(file_path, on_bad_lines='skip')
# data.head()

# """terdapat 1098 baris dan 21 kolom

# ## Info Data
# """

# print(data.shape)

# print(data.info())

# """### Misiing Value"""

# print(data.isnull().sum())

# """### Hapus baris data yang memiliki missing value pada **kolom url** dan asimpan hasilnya"""

# data_cleaned = data.dropna(subset=['url'])
# print(f"Jumlah baris data setelah dihapus penghapusan: {data_cleaned.shape[0]} baris")
# output_path = "/content/drive/MyDrive/Colab Notebooks/INFORMATION EXTRACTION/cleanedmetaPidananUmumPN-Banyuwangi_new-Page-57-107.csv"
# data_cleaned.to_csv(output_path, index=False)

# df = pd.read_csv(output_path)
# df.head(100)

# """### **Menghitung distribusi tiap putusan**"""

# kode_list = ['Pid.Sus', 'Pid.B', 'Pid.C']

# # Menghitung jumlah kemunculan tiap kode
# for kode in kode_list:
#     jumlah = df['nomor'].str.contains(kode).sum()
#     print(f"Jumlah {kode}: {jumlah}")

# filtered_data = df[df['nomor'].str.contains('Pid.B|Pid.Sus', na=False)]
# filtered_data

# kode_list = ['Pid.Sus', 'Pid.B', 'Pid.C']

# # Menghitung jumlah kemunculan tiap kode
# for kode in kode_list:
#     jumlah = filtered_data['nomor'].str.contains(kode).sum()
#     print(f"Jumlah {kode}: {jumlah}")

# # jadikan variebal yang filtered_data menjadi csv
# output_path = "/content/drive/MyDrive/Colab Notebooks/INFORMATION EXTRACTION/filtered_metaPidB_SUS_PN-Banyuwangi_NEW.csv"
# filtered_data.to_csv(output_path, index=False)

# df_pid_b_sus = pd.read_csv(output_path)
# df_pid_b_sus.head()

# kode_list = ['Pid.Sus', 'Pid.B']

# # Menghitung jumlah kemunculan tiap kode
# for kode in kode_list:
#     jumlah = df_pid_b_sus['nomor'].str.contains(kode).sum()
#     print(f"Jumlah {kode}: {jumlah}")

# """## **STEP 4 - Download file pdf putusan**

# pada step ini bertujuan mendownload file pdf yang ada di kolom url pada dataset yang sudah di bersihkan
# """

# def download_files_from_csv(csv_file_path, output_folder):
#     with open(csv_file_path, 'r') as file:
#         csv_reader = csv.reader(file)
#         next(csv_reader)  # skip header
#         for row in csv_reader:
#             url = row[20]
#             download_file(url, output_folder)

# def download_file(url, output_folder):
#     response = requests.get(url)
#     if response.status_code == 200:
#         file_name = url.split("/")[-1]
#         file_path = f"{output_folder}/{file_name}.pdf"
#         with open(file_path, 'wb') as file:
#             file.write(response.content)
#         print(f"Downloaded: {file_name}")
#     else:
#         print(f"Failed to download: {url}")

# csv_file_path = "/content/drive/MyDrive/Colab Notebooks/INFORMATION EXTRACTION/filtered_metaPidB_SUS_PN-Banyuwangi_NEW.csv"
# output_folder = "/content/drive/MyDrive/Colab Notebooks/INFORMATION EXTRACTION/PDF_FILTERED_B-SUS_FINAL"
# download_files_from_csv(csv_file_path, output_folder)

# """Setelah file CSV yang berisi metadata berhasil dibuat menggunakan fungsi sebelumnya dan dibersihkan, kode ini digunakan untuk mendownload file PDF berdasarkan URL yang terdapat di kolom ke-20 dari file CSV tersebut. Fungsi utama, `download_files_from_csv()`, membuka dan membaca file CSV, kemudian mengambil URL dari kolom ke-20 (indeks ke-19) di setiap baris data. URL tersebut digunakan untuk memanggil fungsi `download_file()`, yang bertanggung jawab untuk mendownload file PDF dari URL yang diberikan dan menyimpannya di folder output yang telah ditentukan. `Fungsi download_file()` memeriksa apakah permintaan download berhasil `(status code 200)`, lalu menyimpan file dengan nama yang diambil dari URL dan menambahkan ekstensi .pdf."""