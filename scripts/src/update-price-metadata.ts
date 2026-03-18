import { getUncachableStripeClient } from "./stripeClient";

async function main() {
  const stripe = await getUncachableStripeClient();
  const priceIds = [
    "price_1TCSBLBI1ehmFus2N6dh1Bwf",
    "price_1TCSBMBI1ehmFus2Wc9Jhxgs",
    "price_1TCSBMBI1ehmFus21cAGvvl5",
  ];
  const planIds = [1, 2, 3];

  for (let i = 0; i < priceIds.length; i++) {
    await stripe.prices.update(priceIds[i], {
      metadata: { planId: String(planIds[i]) },
    });
    console.log("Updated", priceIds[i], "with planId", planIds[i]);
  }
  console.log("Done!");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
