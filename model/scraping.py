import requests
import io
import uuid
import json
import time
import httpx
import pathlib
from supabase import create_client, Client
from bs4 import BeautifulSoup
from PyPDF2 import PdfReader, PdfWriter
from urllib.parse import urljoin
from datetime import datetime
from itertools import zip_longest
from google import genai
from google.genai import types

import os
from dotenv import load_dotenv
load_dotenv()  # take environment variables

from prompt import prompt_detail_putusan

# Inisialisasi Supabase Client
supabase: Client = create_client(
  os.getenv("SUPABASE_URL"),
  os.getenv("SUPABASE_KEY")
)

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

def extract_url_document(prompt, doc_url):
  """Ekstrak data dokumen putusan dari public storage supabase"""
  doc_data = httpx.get(doc_url).content

  response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=[
        types.Part.from_bytes(
          data=doc_data,
          mime_type='application/pdf',
        ),
        prompt])

  return response.text

def extract_local_document(prompt, filename):
  """Ekstrak data dokumen putusan dari local storage"""
  filepath = pathlib.Path(filename)

  response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=[
        types.Part.from_bytes(
          data=filepath.read_bytes(),
          mime_type='application/pdf',
        ),
        prompt])
  return response.text

def get_all_links(base_url, page=1, page_end=20):
    """Ambil semua link putusan dari semua halaman"""
    links = []
    while True:
        # Cek jika halaman melebihi batas
        if page > page_end:
            break

        url = f"{base_url}/page/{page}.html" if page > 1 else base_url
        print(f"Mengambil halaman {page}...")

        try:
            response = requests.get(url)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')

            # Cek jika sudah di halaman terakhir
            if "Tidak ditemukan" in soup.text:
                break

            # Ambil semua link putusan
            items = soup.select('.spost.clearfix .entry-c strong a')
            if not items:
                break

            for item in items:
                # Cek jika judul putusan (pid.c -> banyak data yg tidak lengkap)
                if "pid.c" not in item.text.lower():
                  links.append(urljoin(base_url, item['href']))

            page += 1
            time.sleep(1)  # Delay untuk menghindari blocking

        except Exception as e:
            print(f"Error saat mengambil halaman {page}: {e}")
            break

    return links

def compress_pdf(input_buffer):
    """Kompresi PDF untuk mengurangi ukuran file"""
    reader = PdfReader(input_buffer)
    writer = PdfWriter()

    for page in reader.pages:
        page.compress_content_streams()
        writer.add_page(page)

    output_buffer = io.BytesIO()
    writer.write(output_buffer)
    output_buffer.seek(0)
    return output_buffer

def upload_to_supabase_storage(file_buffer, file_name):
    """Upload file ke Supabase Storage"""
    try:
        # Upload file dengan content type PDF
        res = supabase.storage.from_(os.getenv("SUPABASE_BUCKET")).upload(
            file=file_buffer.getvalue(),
            path=file_name,
            file_options={
                "content-type": "application/pdf"
            }
        )

        public_url = supabase.storage.from_(os.getenv("SUPABASE_BUCKET")).get_public_url(file_name)
        return public_url

    except Exception as e:
        print(f"Error uploading to Supabase Storage: {e}")
        return None

def convert_date(date):
  # Mapping bulan dari Indonesia ke Inggris
  month_mapping = {
    "Januari": "January", "Februari": "February", "Maret": "March",
    "April": "April", "Mei": "May", "Juni": "June",
    "Juli": "July", "Agustus": "August", "September": "September",
    "Oktober": "October", "Nopember": "November", "Desember": "December"
  }

  # Ganti bulan ke bahasa Inggris
  for indo, eng in month_mapping.items():
      if indo in date:
          date = date.replace(indo, eng)
          break

  return str(datetime.strptime(date, '%d %B %Y').strftime('%Y-%m-%d %H:%M:%S'))

def extract_putusan_data(url):
    """Ekstrak data putusan dari halaman detail"""
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        # Cek apakah ada PDF
        pdf_link = None
        pdf_btn = soup.select_one('a[href*="/pdf/"]')
        if pdf_btn:
            pdf_link = urljoin(url, pdf_btn['href'])
        else:
          return None

        # Ekstrak metadata
        data = {
            "nomor_putusan": None,
            "uri_dokumen": pdf_link,
            "judul_putusan": None,
            "tahun": None,
            "lembaga_peradilan": None,
            "panitera": None,
            "jenis_kejahatan": None,
            "lokasi_kejadian_id": None,
            "waktu_kejadian_id": None,
            "tanggal_upload": None,
            "tanggal_musyawarah": None,
            "tanggal_dibacakan": None,
            "vonis_hukuman": None,
            "updated_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }

        # Format data dari scraping ke kolom table
        format_data = {
            "nomor": "nomor_putusan",
            "kata_kunci": "jenis_kejahatan",
            "tanggal_register": "tanggal_upload",
            "amar_lainnya": "vonis_hukuman"
        }

        # Ekstrak data dari tabel
        rows = soup.select('.table tr')
        for row in rows:
            cols = row.find_all('td')

            if len(cols) == 1:
              value = cols[0].find('strong').text.strip()
              if value:
                data['judul_putusan'] = value
            elif len(cols) == 2:
                key = cols[0].text.strip().lower().replace(" ", "_")
                value = cols[1].text.strip()

                if key in format_data:
                    key = format_data[key]

                if key in ['tanggal_upload', 'tanggal_musyawarah', 'tanggal_dibacakan']:
                    value = convert_date(value)

                if key in data:
                    data[key] = value

        return data

    except Exception as e:
        print(f"Error saat ekstrak data dari {url}: {e}")
        return None

def process_putusan(putusan_url):
    """Proses satu putusan: ekstrak data + simpan PDF"""
    try:
        # Ekstrak metadata
        data = extract_putusan_data(putusan_url)
        if not data:
            print(f"Gagal memproses {putusan_url} karena tidak memiliki link dokumen, dilewati...")
            return True

        # Ekstrak data detail
        data_detail = {
            "alamat_kejadian": None,
            "status_tahanan": None,
            "lama_tahanan": None,
            "barang_bukti": None,
            "hasil_putusan": None,
            "lokasi_kejadian_id": None,
            "waktu_kejadian_id": None,
            "kode_kabupaten": None,
            "hakim": [],
            "terdakwa": [],
            "penasihat": [],
            "penuntut_umum": [],
            "saksi": []
        }

        # Cek apakah sudah ada di database
        existing_data = supabase.table('putusan').select('id').eq('nomor_putusan', data['nomor_putusan']).execute()
        if existing_data.data:
            print(f"Putusan {data['nomor_putusan']} sudah ada, dilewati...")
            return True

        # Download PDF
        pdf_response = requests.get(data['uri_dokumen'])
        pdf_response.raise_for_status()
        pdf_buffer = io.BytesIO(pdf_response.content)

        # Kompres PDF
        compressed_pdf = compress_pdf(pdf_buffer)

        # Upload ke Supabase Storage
        format_file_name = data['nomor_putusan'].strip().replace(" ", "_").replace("/", "_")
        file_name = f"putusan/{format_file_name}.pdf"

        # Cek apakah sudah ada data di storage
        existing_data = supabase.storage.from_(os.getenv("SUPABASE_BUCKET")).list('putusan', {"limit": 1, "search": format_file_name})
        if existing_data:
          print(f"File {file_name} sudah ada di storage, dilewati...")
          return None

        public_url = upload_to_supabase_storage(compressed_pdf, file_name)

        if public_url:
            # Update data dengan URL Supabase
            data['uri_dokumen'] = public_url

            # Data ekstrak dokumen
            result_extract_document = extract_url_document(prompt_detail_putusan, public_url).strip()[7:-3]
            detail_document = json.loads(result_extract_document)

            # Ambil data waktu dan lokasi kejadian
            data_waktu_kejadian = supabase.table('waktu_kejadian').select('id', 'waktu_kejadian').execute().data
            data_lokasi_kejadian = supabase.table('lokasi_kejadian').select('id', 'nama_lokasi').execute().data
            waktu_kejadian_default = '5179ef1c-aaba-46d8-81eb-c4e5594a2a6f' # id dari data 'Tidak Diketahui' pada database
            lokasi_kejadian_default = 'd6681071-1eb0-4995-b33e-de78fd87e7c1' # id dari data 'Jalan Umum' pada database

            # Isi data detail
            for key in detail_document:
              if key == 'waktu_kejadian_id':
                id_waktu_kejadian = next((item['id'] for item in data_waktu_kejadian if item['waktu_kejadian'] == detail_document['waktu_kejadian_id']), waktu_kejadian_default)
                detail_document['waktu_kejadian_id'] = id_waktu_kejadian
              elif key == 'lokasi_kejadian_id':
                id_lokasi_kejadian = next((item['id'] for item in data_lokasi_kejadian if item['nama_lokasi'] == detail_document['lokasi_kejadian_id']), lokasi_kejadian_default)
                detail_document['lokasi_kejadian_id'] = id_lokasi_kejadian

              if key in data_detail:
                data_detail[key] = detail_document[key]

            # Kelola data untuk simpan ke db
            data.update(data_detail)
            data_putusan = dict(list(data.items())[:-5])
            data_hakim = data['hakim']
            data_terdakwa = data['terdakwa']
            data_penasihat = data['penasihat']
            data_penuntut_umum = data['penuntut_umum']
            data_saksi = data['saksi']

            # Simpan data putusan
            data_putusan['id'] = str(uuid.uuid4())
            res = supabase.table('putusan').insert(data_putusan).execute()
            nomor_putusan = res.data[0]['nomor_putusan']

            # Simpan data hakim
            for idx, hakim in enumerate(data_hakim):
              data_existing = supabase.table('hakim').select('id').eq('nama_hakim', hakim['nama_hakim']).execute()
              if len(data_existing.data) == 0:
                hakim['id'] = str(uuid.uuid4())
                hakim['updated_at'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                res = supabase.table('hakim').insert(hakim).execute()
                id = res.data[0]['id']
              else:
                id = data_existing.data[0]['id']

              data_hakim[idx]['id'] = id

            # Simpan data terdakwa
            for idx, terdakwa in enumerate(data_terdakwa):
              data_existing = supabase.table('terdakwa').select('id').eq('nama_lengkap', terdakwa['nama_lengkap']).execute()
              if len(data_existing.data) == 0:
                terdakwa['id'] = str(uuid.uuid4())
                terdakwa['updated_at'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                res = supabase.table('terdakwa').insert(terdakwa).execute()
                id = res.data[0]['id']
              else:
                id = data_existing.data[0]['id']

              data_terdakwa[idx]['id'] = id

            # Simpan data penasihat
            for idx, penasihat in enumerate(data_penasihat):
              data_existing = supabase.table('penasihat').select('id').eq('nama_penasihat', penasihat['nama_penasihat']).execute()
              if len(data_existing.data) == 0:
                penasihat['id'] = str(uuid.uuid4())
                penasihat['updated_at'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                res = supabase.table('penasihat').insert(penasihat).execute()
                id = res.data[0]['id']
              else:
                id = data_existing.data[0]['id']

              data_penasihat[idx]['id'] = id

            # Simpan data penuntut_umum
            for idx, penuntut_umum in enumerate(data_penuntut_umum):
              data_existing = supabase.table('penuntut_umum').select('id').eq('nama_penuntut', penuntut_umum['nama_penuntut']).execute()
              if len(data_existing.data) == 0:
                penuntut_umum['id'] = str(uuid.uuid4())
                penuntut_umum['updated_at'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                res = supabase.table('penuntut_umum').insert(penuntut_umum).execute()
                id = res.data[0]['id']
              else:
                id = data_existing.data[0]['id']

              data_penuntut_umum[idx]['id'] = id

            # Simpan data saksi
            for idx, saksi in enumerate(data_saksi):
              data_existing = supabase.table('saksi').select('id').eq('nama_saksi', saksi['nama_saksi']).execute()
              if len(data_existing.data) == 0:
                saksi['id'] = str(uuid.uuid4())
                saksi['updated_at'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                res = supabase.table('saksi').insert(saksi).execute()
                id = res.data[0]['id']
              else:
                id = data_existing.data[0]['id']

              data_saksi[idx]['id'] = id

            # Gabung data putusan detail
            data_putusan_detail = []
            for hakim, terdakwa, penasihat, penuntut, saksi in zip_longest(
                data_hakim,
                data_terdakwa,
                data_penasihat,
                data_penuntut_umum,
                data_saksi,
                fillvalue={}
            ):
                data_putusan_detail.append({
                    'id': str(uuid.uuid4()),
                    'nomor_putusan': nomor_putusan,
                    'hakim_id': hakim.get('id') if hakim else None,
                    'terdakwa_id': terdakwa.get('id') if terdakwa else None,
                    'penasihat_id': penasihat.get('id') if penasihat else None,
                    'penuntut_umum_id': penuntut.get('id') if penuntut else None,
                    'saksi_id': saksi.get('id') if saksi else None,
                    'updated_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                })

            # Simpan data putusan detail
            for detail in data_putusan_detail:
              supabase.table('putusan_detail').insert(detail).execute()

            print(f"Berhasil menyimpan putusan {data['nomor_putusan']}")
            return True

        return False

    except Exception as e:
        print(f"Error memproses {putusan_url}: {e}")
        return False
def main():
    base_url = "https://putusan3.mahkamahagung.go.id/direktori/index/pengadilan/pn-bandung/kategori/pidana-umum-1"

    # 1. Ambil semua link putusan
    links = get_all_links(base_url, 1, 5)
    print(f"Total {len(links)} putusan ditemukan.")

    # 2. Proses setiap putusan
    for idx, link in enumerate(links):
        print(f"{idx + 1}. ", end="")
        result = process_putusan(link)

        # if result == None:
        #   break

        time.sleep(2)  # Delay untuk hindari rate limiting

if __name__ == "__main__":
    main()