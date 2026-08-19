const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const REMOVE_NAMES = ["Textures", "Entire Avatars"];

const INTENDED = [
  "Clothing Add-ons",
  "Complete Avatars",
  "Toggles",
  "Custom Textures",
  "Models",
];

async function cleanup() {
  await prisma.$connect();
  console.log("Connected to database.\n");

  const all = await prisma.Service.findMany({ orderBy: { sort_order: "asc" } });
  console.log(`Found ${all.length} service rows:\n`);
  for (const s of all) {
    console.log(`  - "${s.name}" (id=${s.id}, visible=${s.visible}, sort=${s.sort_order})`);
  }
  console.log("");

  // 1. Delete the old/duplicate names entirely.
  for (const name of REMOVE_NAMES) {
    const res = await prisma.Service.deleteMany({ where: { name } });
    if (res.count > 0) console.log(`Deleted ${res.count} "${name}" row(s).`);
  }

  // 2. Dedupe the intended services: keep the lowest sort_order, delete the rest.
  for (const name of INTENDED) {
    const matches = await prisma.Service.findMany({
      where: { name },
      orderBy: { sort_order: "asc" },
    });
    if (matches.length > 1) {
      const keep = matches[0];
      const removeIds = matches.slice(1).map((m) => m.id);
      const res = await prisma.Service.deleteMany({ where: { id: { in: removeIds } } });
      console.log(`Deduplicated "${name}": kept 1 (id=${keep.id}), deleted ${res.count}.`);
    }
  }

  const remaining = await prisma.Service.findMany({ orderBy: { sort_order: "asc" } });
  console.log(`\nFinal service rows (${remaining.length}):`);
  for (const s of remaining) {
    console.log(`  - "${s.name}" (id=${s.id})`);
  }

  const names = remaining.map((s) => s.name.trim());
  const uniqueNames = new Set(names.map((n) => n.toLowerCase()));
  if (names.length !== uniqueNames.size) {
    console.error("\nERROR: duplicate service names still present!");
    process.exit(1);
  }
  if (!INTENDED.every((n) => names.includes(n))) {
    console.error("\nERROR: not all intended services present!");
    process.exit(1);
  }

  console.log("\nCleanup complete — exactly the 5 intended services remain, once each.");
  await prisma.$disconnect();
}

cleanup().catch(async (err) => {
  console.error("Cleanup failed:", err);
  await prisma.$disconnect();
  process.exit(1);
});
