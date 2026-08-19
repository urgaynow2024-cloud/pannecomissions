const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  const res = await prisma.SitePhoto.deleteMany({
    where: { slug: { in: ["textures", "entire-avatars"] } },
  });
  console.log("Deleted orphaned site_photo slots:", res.count);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
