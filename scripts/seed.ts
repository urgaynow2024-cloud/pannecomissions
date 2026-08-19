import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_SERVICES = [
  { name: "Clothing Add-ons", description: "Adding clothing pieces, accessories, and outfit options to existing avatars.", sort_order: 0 },
  { name: "Complete Avatars", description: "Full avatar assemblies from premade assets, tailored to your needs.", sort_order: 1 },
  { name: "Toggles", description: "Avatar toggles and options for switching between different looks or states.", sort_order: 2 },
  { name: "Custom Textures", description: "Custom texture work for your avatar, from subtle tweaks to full repaints.", sort_order: 3 },
  { name: "Models", description: "3D modelling work for avatars, accessories, and custom parts.", sort_order: 4 },
];

const DEFAULT_PRICING = [
  { name: "Custom Textures", min_price: 5, max_price: 25, description: "depending on complexity.", category: "sfw", sort_order: 0 },
  { name: "Complete Avatars", min_price: 55, max_price: 100, description: "depending on complexity.", category: "sfw", sort_order: 1 },
  { name: "Models", min_price: 65, max_price: 150, description: "depending on complexity.", category: "sfw", sort_order: 2 },
];

async function seed() {
  console.log("Seeding database...\n");

  try {
    await prisma.$connect();
    console.log("✓ Connected to database\n");
  } catch (error) {
    console.error("✗ Database connection failed:", error);
    process.exit(1);
  }

  for (const service of DEFAULT_SERVICES) {
    const existing = await prisma.Service.findFirst({ where: { name: service.name } });
    if (existing) {
      console.log(`- Service "${service.name}" already exists, skipping.`);
    } else {
      await prisma.Service.create({ data: service });
      console.log(`✓ Created service "${service.name}"`);
    }
  }

  for (const pricing of DEFAULT_PRICING) {
    const existing = await prisma.Pricing.findFirst({ where: { name: pricing.name } });
    if (existing) {
      console.log(`- Pricing "${pricing.name}" already exists, skipping.`);
    } else {
      await prisma.Pricing.create({ data: pricing });
      console.log(`✓ Created pricing "${pricing.name}"`);
    }
  }

  console.log("\n✓ Seeding complete!");
  await prisma.$disconnect();
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
