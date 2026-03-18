import { db, marketplacesTable, plansTable } from "@workspace/db";
import { eq } from "drizzle-orm";

async function main() {
  console.log("🌱 Seeding marketplaces and plans...");

  const existingMps = await db.select({ id: marketplacesTable.id }).from(marketplacesTable).limit(1);
  if (existingMps.length === 0) {
    await db.insert(marketplacesTable).values([
      { name: "Shopee", slug: "shopee", affiliateCode: "KEROPROMO_SH01", commissionPercent: 8.5, color: "#EE4D2D", secondaryColor: null, logoUrl: null },
      { name: "Temu", slug: "temu", affiliateCode: "KEROPROMO_TM01", commissionPercent: 10.0, color: "#FF6B35", secondaryColor: null, logoUrl: null },
      { name: "Amazon", slug: "amazon", affiliateCode: "KEROPROMO_AZ01", commissionPercent: 6.0, color: "#FF9900", secondaryColor: "#232F3E", logoUrl: null },
      { name: "Mercado Livre", slug: "mercado-livre", affiliateCode: "KEROPROMO_ML01", commissionPercent: 7.5, color: "#FFE600", secondaryColor: "#3483FA", logoUrl: null },
      { name: "Magalu", slug: "magalu", affiliateCode: "KEROPROMO_MG01", commissionPercent: 8.0, color: "#0086FF", secondaryColor: null, logoUrl: null },
    ]);
    console.log("✅ Marketplaces criados.");
  } else {
    console.log("⏩ Marketplaces já existem, pulando.");
  }

  const existingPlans = await db.select({ id: plansTable.id }).from(plansTable).limit(1);
  if (existingPlans.length === 0) {
    await db.insert(plansTable).values([
      { name: "Starter", slug: "starter", price: 9.90, maxGroups: 1, maxSchedulesPerMonth: 30, maxCollaborators: 0, hasAdvancedMetrics: false, isPopular: false },
      { name: "Pro", slug: "pro", price: 29.90, maxGroups: 3, maxSchedulesPerMonth: 150, maxCollaborators: 2, hasAdvancedMetrics: true, isPopular: true },
      { name: "Business", slug: "business", price: 99.90, maxGroups: 999, maxSchedulesPerMonth: 999999, maxCollaborators: 10, hasAdvancedMetrics: true, isPopular: false },
    ]);
    console.log("✅ Planos criados.");
  } else {
    console.log("⏩ Planos já existem, pulando.");
  }

  console.log("✅ Seed concluído!");
  process.exit(0);
}

main().catch((e) => {
  console.error("Seed falhou:", e);
  process.exit(1);
});
