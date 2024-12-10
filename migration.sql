-- AlterTable
ALTER TABLE "Image" DROP COLUMN "takenAt";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'USER';

