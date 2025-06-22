import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { config } from "../config/env";
import { GeminiAIService } from "./services/aiService";
import { MarketDataService } from "./services/dataProviders";

const app = new Hono();
const aiService = new GeminiAIService();
const marketDataService = new MarketDataService();

// Health check endpoint
app.get("/", (c) =>
  c.json({ status: "ok", message: "Welcome to Forexa API!" })
);

// Market data endpoint
app.get("/market-data/:symbol", async (c) => {
  try {
    const symbol = c.req.param("symbol");
    const data = await marketDataService.getComprehensiveMarketData(symbol);
    return c.json({ success: true, data });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Forex rate endpoint
app.get("/forex-rate/:from/:to", async (c) => {
  try {
    const from = c.req.param("from");
    const to = c.req.param("to");
    const rate = await marketDataService.getForexRate(from, to);
    return c.json({ success: true, rate });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Market gainers and losers endpoint
app.get("/market-movers", async (c) => {
  try {
    const data = await marketDataService.getMarketGainersLosers();
    return c.json({ success: true, data });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Technical indicators endpoint
app.get("/technical-indicators/:currencyPair/:indicator", async (c) => {
  try {
    const currencyPair = c.req.param("currencyPair");
    const indicator = c.req.param("indicator") || "SMA";
    const indicators = await marketDataService.getPolygonTechnicalIndicators(
      currencyPair,
      indicator
    );
    return c.json({ success: true, indicators });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Market status endpoint
app.get("/market-status", async (c) => {
  try {
    const status = await marketDataService.getMarketStatus();
    return c.json({ success: true, status });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// AI prediction endpoint
app.get("/ai/predict/:symbol", async (c) => {
  try {
    const symbol = c.req.param("symbol");
    const prediction = await aiService.generatePrediction(symbol);
    return c.json({ success: true, prediction });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Batch predictions endpoint
app.post("/ai/predict/batch", async (c) => {
  try {
    const { symbols } = await c.req.json();
    if (!Array.isArray(symbols)) {
      return c.json({ success: false, error: "Symbols must be an array" }, 400);
    }

    const predictions = await aiService.generateBatchPredictions(symbols);
    return c.json({ success: true, predictions });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

serve({
  fetch: app.fetch,
  port: Number(config.port),
});

console.log(`🚀 Server running on http://localhost:${config.port}`);
