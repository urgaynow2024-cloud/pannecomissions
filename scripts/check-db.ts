import prisma from "../src/lib/prisma";

async function checkDb() {
  try {
    const mediaCount = await prisma.mediaLibrary.count();
    console.log("Total media library items:", mediaCount);
    
    const mediaSample = await prisma.mediaLibrary.findMany({ take: 1 });
    console.log("Media sample:", JSON.stringify(mediaSample, null, 2));
    
    const settings = await prisma.siteSetting.findMany();
    console.log("Settings:", JSON.stringify(settings, null, 2));
  } catch (e) {
    console.error("DB check error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

checkDb();
