-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('CHAT_SESSION', 'DOCUMENT_UPLOAD', 'DOCUMENT_SEARCH');

-- CreateTable
CREATE TABLE "waktu_kejadian" (
    "id" TEXT NOT NULL,
    "waktu_kejadian" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "waktu_kejadian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terdakwa" (
    "id" TEXT NOT NULL,
    "nama_lengkap" TEXT NOT NULL,
    "jenis_kelamin" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "tempat_lahir" TEXT NOT NULL,
    "pekerjaan" TEXT,
    "umur" INTEGER,
    "kebangsaan" TEXT,
    "agama" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "terdakwa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "putusan" (
    "id" TEXT NOT NULL,
    "nomor_putusan" TEXT NOT NULL,
    "uri_dokumen" TEXT,
    "judul_putusan" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "lembaga_peradilan" TEXT NOT NULL,
    "panitera" TEXT,
    "jenis_kejahatan" TEXT,
    "alamat_kejadian" TEXT,
    "status_tahanan" TEXT,
    "lama_tahanan" TEXT,
    "barang_bukti" TEXT,
    "lokasi_kejadian_id" TEXT,
    "tanggal_upload" TIMESTAMP(3),
    "tanggal_musyawarah" TIMESTAMP(3),
    "tanggal_dibacakan" TIMESTAMP(3),
    "vonis_hukuman" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "putusan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "putusan_detail" (
    "id" TEXT NOT NULL,
    "nomor_putusan" TEXT NOT NULL,
    "terdakwa_id" TEXT,
    "penasihat_id" TEXT,
    "hakim_id" TEXT,
    "penuntut_umum_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "putusan_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penuntut_umum" (
    "id" TEXT NOT NULL,
    "nama_penuntut" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "penuntut_umum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penasihat" (
    "id" TEXT NOT NULL,
    "nama_penasihat" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "penasihat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hakim" (
    "id" TEXT NOT NULL,
    "nama_hakim" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hakim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nama_lengkap" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lokasi_kejadian" (
    "id" TEXT NOT NULL,
    "nama_lokasi" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lokasi_kejadian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provinsi" (
    "id" TEXT NOT NULL,
    "kode_provinsi" TEXT NOT NULL,
    "nama_provinsi" TEXT NOT NULL,
    "lang" DOUBLE PRECISION,
    "lat" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provinsi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kabupaten" (
    "id" TEXT NOT NULL,
    "kode_provinsi" TEXT NOT NULL,
    "kode_kabupaten" TEXT NOT NULL,
    "nama_kabupaten" TEXT NOT NULL,
    "lang" DOUBLE PRECISION,
    "lat" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kabupaten_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sesi_chat" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "judul" TEXT NOT NULL DEFAULT 'Percakapan Baru',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "ip_address" TEXT,
    "user_agent" TEXT,
    "referensi_dokumen" JSONB,

    CONSTRAINT "sesi_chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pesan_chat" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_user_message" BOOLEAN NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "intent" TEXT,
    "entities" JSONB,
    "uri_dokumen" JSONB,

    CONSTRAINT "pesan_chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log_history" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "tipe_aktivitas" "ActivityType" NOT NULL DEFAULT 'CHAT_SESSION',
    "detail_aktivitas" JSONB,
    "nomor_putusan" TEXT,
    "search_query" TEXT,
    "sesi_chat_id" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "log_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_HakimToPutusan" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_HakimToPutusan_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "terdakwa_nama_lengkap_idx" ON "terdakwa"("nama_lengkap");

-- CreateIndex
CREATE UNIQUE INDEX "putusan_nomor_putusan_key" ON "putusan"("nomor_putusan");

-- CreateIndex
CREATE INDEX "putusan_nomor_putusan_idx" ON "putusan"("nomor_putusan");

-- CreateIndex
CREATE INDEX "putusan_lokasi_kejadian_id_idx" ON "putusan"("lokasi_kejadian_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "provinsi_kode_provinsi_key" ON "provinsi"("kode_provinsi");

-- CreateIndex
CREATE INDEX "provinsi_nama_provinsi_idx" ON "provinsi"("nama_provinsi");

-- CreateIndex
CREATE UNIQUE INDEX "kabupaten_kode_provinsi_key" ON "kabupaten"("kode_provinsi");

-- CreateIndex
CREATE UNIQUE INDEX "kabupaten_kode_kabupaten_key" ON "kabupaten"("kode_kabupaten");

-- CreateIndex
CREATE INDEX "kabupaten_nama_kabupaten_idx" ON "kabupaten"("nama_kabupaten");

-- CreateIndex
CREATE INDEX "sesi_chat_user_id_idx" ON "sesi_chat"("user_id");

-- CreateIndex
CREATE INDEX "sesi_chat_created_at_idx" ON "sesi_chat"("created_at");

-- CreateIndex
CREATE INDEX "pesan_chat_session_id_idx" ON "pesan_chat"("session_id");

-- CreateIndex
CREATE INDEX "pesan_chat_timestamp_idx" ON "pesan_chat"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "log_history_sesi_chat_id_key" ON "log_history"("sesi_chat_id");

-- CreateIndex
CREATE INDEX "log_history_user_id_idx" ON "log_history"("user_id");

-- CreateIndex
CREATE INDEX "log_history_tipe_aktivitas_idx" ON "log_history"("tipe_aktivitas");

-- CreateIndex
CREATE INDEX "log_history_created_at_idx" ON "log_history"("created_at");

-- CreateIndex
CREATE INDEX "_HakimToPutusan_B_index" ON "_HakimToPutusan"("B");

-- AddForeignKey
ALTER TABLE "putusan" ADD CONSTRAINT "putusan_lokasi_kejadian_id_fkey" FOREIGN KEY ("lokasi_kejadian_id") REFERENCES "lokasi_kejadian"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "putusan_detail" ADD CONSTRAINT "putusan_detail_nomor_putusan_fkey" FOREIGN KEY ("nomor_putusan") REFERENCES "putusan"("nomor_putusan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "putusan_detail" ADD CONSTRAINT "putusan_detail_terdakwa_id_fkey" FOREIGN KEY ("terdakwa_id") REFERENCES "terdakwa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "putusan_detail" ADD CONSTRAINT "putusan_detail_penasihat_id_fkey" FOREIGN KEY ("penasihat_id") REFERENCES "penasihat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "putusan_detail" ADD CONSTRAINT "putusan_detail_hakim_id_fkey" FOREIGN KEY ("hakim_id") REFERENCES "hakim"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "putusan_detail" ADD CONSTRAINT "putusan_detail_penuntut_umum_id_fkey" FOREIGN KEY ("penuntut_umum_id") REFERENCES "penuntut_umum"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kabupaten" ADD CONSTRAINT "kabupaten_kode_provinsi_fkey" FOREIGN KEY ("kode_provinsi") REFERENCES "provinsi"("kode_provinsi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesi_chat" ADD CONSTRAINT "sesi_chat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pesan_chat" ADD CONSTRAINT "pesan_chat_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sesi_chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log_history" ADD CONSTRAINT "log_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log_history" ADD CONSTRAINT "log_history_nomor_putusan_fkey" FOREIGN KEY ("nomor_putusan") REFERENCES "putusan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log_history" ADD CONSTRAINT "log_history_sesi_chat_id_fkey" FOREIGN KEY ("sesi_chat_id") REFERENCES "sesi_chat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HakimToPutusan" ADD CONSTRAINT "_HakimToPutusan_A_fkey" FOREIGN KEY ("A") REFERENCES "hakim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HakimToPutusan" ADD CONSTRAINT "_HakimToPutusan_B_fkey" FOREIGN KEY ("B") REFERENCES "putusan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
