-- AlterTable: Remove fields that are now derived from PMX API
ALTER TABLE "Market" 
  DROP COLUMN IF EXISTS "yesTokenMint",
  DROP COLUMN IF EXISTS "noTokenMint",
  DROP COLUMN IF EXISTS "pmxLink",
  DROP COLUMN IF EXISTS "jupiterLink";

