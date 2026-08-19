const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  const m = await prisma.Pricing.updateMany({ where: { name: "Textures" }, data: { name: "Custom Textures" } });
  const m2 = await prisma.Pricing.updateMany({ where: { name: "Entire Avatars" }, data: { name: "Complete Avatars" } });
  console.log("renamed Textures->Custom Textures:", m.count, " Entire Avatars->Complete Avatars:", m2.count);
  const all = await prisma.Pricing.findMany({ orderBy: { sort_order: "asc" } });
  all.forEach((x) => console.log("  -", x.name, x.min_price + "-" + x.max_price));
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
