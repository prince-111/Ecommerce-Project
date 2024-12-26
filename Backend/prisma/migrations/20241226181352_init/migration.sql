/*
  Warnings:

  - You are about to drop the column `address` on the `Order` table. All the data in the column will be lost.
  - Added the required column `addressId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "address",
ADD COLUMN     "addressId" TEXT NOT NULL,
ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "paymentOderId" TEXT,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
