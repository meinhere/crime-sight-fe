-- AlterTable
ALTER TABLE "putusan" ADD COLUMN     "waktu_kejadian_id" TEXT;

-- CreateIndex
CREATE INDEX "putusan_waktu_kejadian_id_idx" ON "putusan"("waktu_kejadian_id");

-- AddForeignKey
ALTER TABLE "putusan" ADD CONSTRAINT "putusan_waktu_kejadian_id_fkey" FOREIGN KEY ("waktu_kejadian_id") REFERENCES "waktu_kejadian"("id") ON DELETE SET NULL ON UPDATE CASCADE;
