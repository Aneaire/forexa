import {
  boolean,
  decimal,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Trading pairs table
export const tradingPairs = pgTable("trading_pairs", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull().unique(), // e.g., 'EUR/USD'
  baseCurrency: text("base_currency").notNull(), // e.g., 'EUR'
  quoteCurrency: text("quote_currency").notNull(), // e.g., 'USD'
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Price data table
export const priceData = pgTable("price_data", {
  id: serial("id").primaryKey(),
  pairId: integer("pair_id")
    .references(() => tradingPairs.id)
    .notNull(),
  timestamp: timestamp("timestamp").notNull(),
  open: decimal("open", { precision: 10, scale: 5 }).notNull(),
  high: decimal("high", { precision: 10, scale: 5 }).notNull(),
  low: decimal("low", { precision: 10, scale: 5 }).notNull(),
  close: decimal("close", { precision: 10, scale: 5 }).notNull(),
  volume: decimal("volume", { precision: 15, scale: 2 }).notNull(),
});

// AI predictions table
export const aiPredictions = pgTable("ai_predictions", {
  id: serial("id").primaryKey(),
  pairId: integer("pair_id")
    .references(() => tradingPairs.id)
    .notNull(),
  timestamp: timestamp("timestamp").notNull(),
  prediction: text("prediction").notNull(), // 'BUY', 'SELL', 'HOLD'
  confidence: decimal("confidence", { precision: 5, scale: 4 }).notNull(), // 0.0000 to 1.0000
  reasoning: text("reasoning").notNull(),
  model: text("model").notNull(), // 'gemini-2.0-flash'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Trading signals table
export const tradingSignals = pgTable("trading_signals", {
  id: serial("id").primaryKey(),
  pairId: integer("pair_id")
    .references(() => tradingPairs.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  signalType: text("signal_type").notNull(), // 'BUY', 'SELL'
  entryPrice: decimal("entry_price", { precision: 10, scale: 5 }).notNull(),
  stopLoss: decimal("stop_loss", { precision: 10, scale: 5 }),
  takeProfit: decimal("take_profit", { precision: 10, scale: 5 }),
  status: text("status").notNull().default("PENDING"), // 'PENDING', 'ACTIVE', 'CLOSED', 'CANCELLED'
  aiPredictionId: integer("ai_prediction_id").references(
    () => aiPredictions.id
  ),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
