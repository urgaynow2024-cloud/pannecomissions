import prisma from "../src/lib/prisma";

async function runMigration() {
  try {
    await prisma.$executeRaw`
      ALTER TABLE services ADD COLUMN IF NOT EXISTS image_fit TEXT NOT NULL DEFAULT 'cover';
    `;
    console.log("Added image_fit column");
  } catch (e) {
    console.log("image_fit column may already exist:", e);
  }

  try {
    await prisma.$executeRaw`
      ALTER TABLE services ADD COLUMN IF NOT EXISTS image_position TEXT NOT NULL DEFAULT 'center';
    `;
    console.log("Added image_position column");
  } catch (e) {
    console.log("image_position column may already exist:", e);
  }

  try {
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS media_library (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        url TEXT NOT NULL,
        alt_text TEXT,
        filename TEXT,
        file_size INTEGER,
        mime_type TEXT,
        width INTEGER,
        height INTEGER,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now()
      );
    `;
    console.log("Created media_library table");
  } catch (e) {
    console.log("media_library table may already exist:", e);
  }

  try {
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_media_library_filename ON media_library(filename);
    `;
    console.log("Created media_library index");
  } catch (e) {
    console.log("Index may already exist:", e);
  }

  try {
    await prisma.$executeRaw`
      INSERT INTO site_settings (key, value) VALUES
        ('hero_image_url', ''),
        ('about_image_url', ''),
        ('featured_work_heading', '')
      ON CONFLICT (key) DO NOTHING;
    `;
    console.log("Inserted homepage settings");
  } catch (e) {
    console.log("Settings may already exist:", e);
  }

  console.log("Migration complete");
}

runMigration()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
