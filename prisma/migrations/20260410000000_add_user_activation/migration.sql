-- AlterTable
ALTER TABLE "User" ADD COLUMN "isActivated" BOOLEAN NOT NULL DEFAULT false;

-- Mark all existing users as activated (they registered before activation flow existed)
UPDATE "User" SET "isActivated" = true;
