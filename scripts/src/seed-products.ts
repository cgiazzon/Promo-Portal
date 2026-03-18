import { getUncachableStripeClient } from "./stripeClient";

const PLANS = [
  { planId: 1, name: "Starter", price: 990, description: "Plano Starter - até 1 grupo, 50 envios/mês" },
  { planId: 2, name: "Pro", price: 2990, description: "Plano Pro - até 3 grupos, 150 envios/mês, 2 colaboradores" },
  { planId: 3, name: "Business", price: 9990, description: "Plano Business - grupos ilimitados, envios ilimitados, colaboradores ilimitados" },
];

async function main() {
  const stripe = await getUncachableStripeClient();

  const existingProducts = await stripe.products.list({ limit: 100, active: true });
  const existingByName = new Map(existingProducts.data.map(p => [p.name, p]));

  for (const plan of PLANS) {
    const productName = `KERO PROMO ${plan.name}`;
    let product = existingByName.get(productName);

    if (!product) {
      product = await stripe.products.create({
        name: productName,
        description: plan.description,
        metadata: { planId: String(plan.planId) },
      });
      console.log(`Created product: ${productName} (${product.id})`);
    } else {
      console.log(`Product already exists: ${productName} (${product.id})`);
    }

    const existingPrices = await stripe.prices.list({
      product: product.id,
      active: true,
      limit: 10,
    });

    const brlPrice = existingPrices.data.find(p => p.currency === "brl");

    if (!brlPrice) {
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.price,
        currency: "brl",
        recurring: { interval: "month" },
        metadata: { planId: String(plan.planId) },
      });
      console.log(`Created price: R$${(plan.price / 100).toFixed(2)}/mês for ${productName} (${price.id})`);
    } else {
      console.log(`Price already exists for ${productName}: ${brlPrice.id} (R$${((brlPrice.unit_amount ?? 0) / 100).toFixed(2)}/mês)`);
    }
  }

  console.log("\nStripe products seeded successfully!");
}

main().catch(e => {
  console.error("Error seeding Stripe products:", e);
  process.exit(1);
});
