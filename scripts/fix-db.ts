import prisma from "../src/lib/prisma";

async function fixDb() {
  try {
    await prisma.$executeRaw`ALTER TABLE services ADD COLUMN IF NOT EXISTS features TEXT`;
    console.log("Added features column");
    
    const result = await prisma.$queryRaw`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'services' ORDER BY ordinal_position`;
    console.log("Services columns:", JSON.stringify(result, null, 2));
  } catch (e) {
    console.error("DB fix error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

fixDb();
