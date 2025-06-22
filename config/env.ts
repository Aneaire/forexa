export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",

  // Database
  databaseUrl: process.env.DATABASE_URL || "postgresql://localhost:5432/forexa",

  // Supabase
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseKey: process.env.SUPABASE_ANON_KEY || "",

  // Google AI (Gemini)
  googleApiKey: process.env.GOOGLE_API_KEY || "",

  // Data Providers
  alphaVantageKey: process.env.ALPHA_VANTAGE_API_KEY || "",
  polygonApiKey: process.env.POLYGON_API_KEY || "",
  quandlApiKey: process.env.QUANDL_API_KEY || "",
  xigniteApiKey: process.env.XIGNITE_API_KEY || "",

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
} as const;
