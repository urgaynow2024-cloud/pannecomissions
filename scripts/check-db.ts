import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkAndMigrate() {
  console.log("Checking database schema...\n");

  const issues: string[] = [];

  try {
    await prisma.$connect();
    console.log("✓ Database connection successful\n");
  } catch (error) {
    console.error("✗ Database connection failed:", error);
    process.exit(1);
  }

  try {
    await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'display_name'`;
    console.log("✓ reviews.display_name exists");
  } catch {
    issues.push("reviews.display_name column missing");
    console.log("✗ reviews.display_name missing");
  }

  try {
    await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'review_text'`;
    console.log("✓ reviews.review_text exists");
  } catch {
    issues.push("reviews.review_text column missing");
    console.log("✗ reviews.review_text missing");
  }

  try {
    await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'rejection_reason'`;
    console.log("✓ reviews.rejection_reason exists");
  } catch {
    issues.push("reviews.rejection_reason column missing");
    console.log("✗ reviews.rejection_reason missing");
  }

  try {
    await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'hidden'`;
    console.log("✓ reviews.hidden exists");
  } catch {
    issues.push("reviews.hidden column missing");
    console.log("✗ reviews.hidden missing");
  }

  try {
    await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'image_url'`;
    console.log("✓ reviews.image_url exists");
  } catch {
    issues.push("reviews.image_url column missing");
    console.log("✗ reviews.image_url missing");
  }

  try {
    await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'commission_submissions' AND column_name = 'additional'`;
    console.log("✓ commission_submissions.additional exists");
  } catch {
    issues.push("commission_submissions.additional column missing");
    console.log("✗ commission_submissions.additional missing");
  }

  try {
    await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'portfolio_items' AND column_name = 'alt_text'`;
    console.log("✓ portfolio_items.alt_text exists");
  } catch {
    issues.push("portfolio_items.alt_text column missing");
    console.log("✗ portfolio_items.alt_text missing");
  }

  try {
    await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'portfolio_items' AND column_name = 'visible'`;
    console.log("✓ portfolio_items.visible exists");
  } catch {
    issues.push("portfolio_items.visible column missing");
    console.log("✗ portfolio_items.visible missing");
  }

  try {
    await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'support_requests' AND column_name = 'subject'`;
    console.log("✓ support_requests.subject exists");
  } catch {
    issues.push("support_requests.subject column missing");
    console.log("✗ support_requests.subject missing");
  }

  console.log("\n" + "=".repeat(50));

  if (issues.length === 0) {
    console.log("\n✓ All database columns are present!");
    console.log("\nYour database schema is up to date.");
  } else {
    console.log(`\n✗ Found ${issues.length} missing column(s):`);
    issues.forEach((issue) => console.log(`  - ${issue}`));
    console.log("\nTo fix this, run the SQL from supabase/schema.sql in your Supabase SQL Editor.");
    console.log("The schema file includes CREATE TABLE IF NOT EXISTS and ALTER TABLE statements.");
  }

  await prisma.$disconnect();
}

checkAndMigrate().catch((error) => {
  console.error("Migration check failed:", error);
  process.exit(1);
});
