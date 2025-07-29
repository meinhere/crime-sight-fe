-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('CHAT_SESSION', 'DOCUMENT_UPLOAD', 'DOCUMENT_SEARCH', 'SYSTEM_LOGIN', 'DOCUMENT_VIEW');

-- CreateTable
CREATE TABLE "waktu_kejadian" (
    "id" TEXT NOT NULL,
    "waktuKejadian" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "waktu_kejadian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terdakwa" (
    "id" TEXT NOT NULL,
    "namaLengkap" TEXT NOT NULL,
    "jenisKelamin" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "tempatLahir" TEXT NOT NULL,
    "pekerjaan" TEXT,
    "umur" INTEGER,
    "kebangsaan" TEXT,
    "agama" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "terdakwa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "putusan" (
    "id" TEXT NOT NULL,
    "nomorPutusan" TEXT NOT NULL,
    "uriDokumen" TEXT,
    "judulPutusan" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "lembagaPeradilan" TEXT NOT NULL,
    "panitera" TEXT,
    "penuntutUmum" TEXT,
    "jenisKejahatan" TEXT,
    "alamatKejadian" TEXT,
    "lokasiKejadianId" TEXT,
    "tanggalUpload" TIMESTAMP(3),
    "tanggalMusyawarah" TIMESTAMP(3),
    "tanggalDibacakan" TIMESTAMP(3),
    "VonisHukuman" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "putusan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "putusan_detail" (
    "id" TEXT NOT NULL,
    "nomorPutusan" TEXT NOT NULL,
    "terdakwaId" TEXT,
    "penasihatId" TEXT,
    "hakimId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "putusan_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penasihat" (
    "id" TEXT NOT NULL,
    "namaPenasihat" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "penasihat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hakim" (
    "id" TEXT NOT NULL,
    "namaHakim" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "tahun" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hakim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "namaLengkap" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lokasi_kejadian" (
    "id" TEXT NOT NULL,
    "namaLokasi" TEXT NOT NULL,
    "kabupatenId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lokasi_kejadian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provinsi" (
    "id" TEXT NOT NULL,
    "kodeProvinsi" TEXT NOT NULL,
    "namaProvinsi" TEXT NOT NULL,
    "lang" TEXT,
    "lat" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provinsi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kabupaten" (
    "id" TEXT NOT NULL,
    "kodeProvinsi" TEXT NOT NULL,
    "kodeKabupaten" TEXT NOT NULL,
    "namaKabupaten" TEXT NOT NULL,
    "lang" TEXT,
    "lat" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kabupaten_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sesi_chat" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "judul" TEXT NOT NULL DEFAULT 'Percakapan Baru',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "referensiDokumen" JSONB,

    CONSTRAINT "sesi_chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pesan_chat" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isUserMessage" BOOLEAN NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "intent" TEXT,
    "entities" JSONB,
    "uriDokumen" JSONB,

    CONSTRAINT "pesan_chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tipeAktivitas" "ActivityType" NOT NULL DEFAULT 'CHAT_SESSION',
    "detailAktivitas" JSONB,
    "nomorPutusan" TEXT,
    "searchQuery" TEXT,
    "sesiChatId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "log_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_HakimToPutusan" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_HakimToPutusan_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "terdakwa_namaLengkap_idx" ON "terdakwa"("namaLengkap");

-- CreateIndex
CREATE UNIQUE INDEX "putusan_nomorPutusan_key" ON "putusan"("nomorPutusan");

-- CreateIndex
CREATE INDEX "putusan_nomorPutusan_idx" ON "putusan"("nomorPutusan");

-- CreateIndex
CREATE INDEX "putusan_lokasiKejadianId_idx" ON "putusan"("lokasiKejadianId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "provinsi_namaProvinsi_idx" ON "provinsi"("namaProvinsi");

-- CreateIndex
CREATE INDEX "kabupaten_namaKabupaten_idx" ON "kabupaten"("namaKabupaten");

-- CreateIndex
CREATE INDEX "sesi_chat_userId_idx" ON "sesi_chat"("userId");

-- CreateIndex
CREATE INDEX "sesi_chat_createdAt_idx" ON "sesi_chat"("createdAt");

-- CreateIndex
CREATE INDEX "pesan_chat_sessionId_idx" ON "pesan_chat"("sessionId");

-- CreateIndex
CREATE INDEX "pesan_chat_timestamp_idx" ON "pesan_chat"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "log_history_sesiChatId_key" ON "log_history"("sesiChatId");

-- CreateIndex
CREATE INDEX "log_history_userId_idx" ON "log_history"("userId");

-- CreateIndex
CREATE INDEX "log_history_tipeAktivitas_idx" ON "log_history"("tipeAktivitas");

-- CreateIndex
CREATE INDEX "log_history_createdAt_idx" ON "log_history"("createdAt");

-- CreateIndex
CREATE INDEX "_HakimToPutusan_B_index" ON "_HakimToPutusan"("B");

-- AddForeignKey
ALTER TABLE "putusan" ADD CONSTRAINT "putusan_lokasiKejadianId_fkey" FOREIGN KEY ("lokasiKejadianId") REFERENCES "lokasi_kejadian"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "putusan_detail" ADD CONSTRAINT "putusan_detail_nomorPutusan_fkey" FOREIGN KEY ("nomorPutusan") REFERENCES "putusan"("nomorPutusan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "putusan_detail" ADD CONSTRAINT "putusan_detail_terdakwaId_fkey" FOREIGN KEY ("terdakwaId") REFERENCES "terdakwa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "putusan_detail" ADD CONSTRAINT "putusan_detail_penasihatId_fkey" FOREIGN KEY ("penasihatId") REFERENCES "penasihat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "putusan_detail" ADD CONSTRAINT "putusan_detail_hakimId_fkey" FOREIGN KEY ("hakimId") REFERENCES "hakim"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lokasi_kejadian" ADD CONSTRAINT "lokasi_kejadian_kabupatenId_fkey" FOREIGN KEY ("kabupatenId") REFERENCES "kabupaten"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kabupaten" ADD CONSTRAINT "kabupaten_kodeProvinsi_fkey" FOREIGN KEY ("kodeProvinsi") REFERENCES "provinsi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesi_chat" ADD CONSTRAINT "sesi_chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pesan_chat" ADD CONSTRAINT "pesan_chat_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sesi_chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log_history" ADD CONSTRAINT "log_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log_history" ADD CONSTRAINT "log_history_nomorPutusan_fkey" FOREIGN KEY ("nomorPutusan") REFERENCES "putusan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log_history" ADD CONSTRAINT "log_history_sesiChatId_fkey" FOREIGN KEY ("sesiChatId") REFERENCES "sesi_chat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HakimToPutusan" ADD CONSTRAINT "_HakimToPutusan_A_fkey" FOREIGN KEY ("A") REFERENCES "hakim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HakimToPutusan" ADD CONSTRAINT "_HakimToPutusan_B_fkey" FOREIGN KEY ("B") REFERENCES "putusan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
