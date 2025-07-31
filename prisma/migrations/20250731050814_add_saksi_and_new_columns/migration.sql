-- AlterTable
ALTER TABLE "putusan" ADD COLUMN     "hasil_putusan" TEXT,
ADD COLUMN     "kode_kabupaten" TEXT;

-- AlterTable
ALTER TABLE "putusan_detail" ADD COLUMN     "saksi_id" TEXT;

-- CreateTable
CREATE TABLE "saksi" (
    "id" TEXT NOT NULL,
    "nama_saksi" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saksi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "saksi_nama_saksi_idx" ON "saksi"("nama_saksi");

-- CreateIndex
CREATE INDEX "putusan_kode_kabupaten_idx" ON "putusan"("kode_kabupaten");

-- AddForeignKey
ALTER TABLE "putusan" ADD CONSTRAINT "putusan_kode_kabupaten_fkey" FOREIGN KEY ("kode_kabupaten") REFERENCES "kabupaten"("kode_kabupaten") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "putusan_detail" ADD CONSTRAINT "putusan_detail_saksi_id_fkey" FOREIGN KEY ("saksi_id") REFERENCES "saksi"("id") ON DELETE SET NULL ON UPDATE CASCADE;
