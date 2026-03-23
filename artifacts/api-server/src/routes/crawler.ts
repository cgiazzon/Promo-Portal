import { Router } from "express";

const router = Router();

router.get("/crawler/ml-search", async (req, res) => {
  try {
    const { q, limit, price } = req.query;
    let url = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(q as string)}&limit=${limit || 15}`;
    if (price) {
      url += `&price=${price}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (error: any) {
    console.error("ML Proxy Error:", error);
    res.status(500).json({ error: "Falha ao consultar Mercado Livre" });
  }
});

export default router;
