# Forexa - AI-Powered Forex Trading Platform

A modern forex trading application built with Bun, Hono, Drizzle ORM, and Gemini 2.0 Flash AI integration.

## 🚀 Features

- **Real-time Market Data**: Integration with Alpha Vantage, Polygon.io, Quandl, and Xignite
- **AI-Powered Predictions**: Using Google's Gemini 2.0 Flash for market analysis
- **Database Management**: PostgreSQL with Drizzle ORM
- **Modern API**: Built with Hono framework
- **Type Safety**: Full TypeScript support

## 📊 How Data Providers Enhance AI Predictions

### Alpha Vantage

- **Technical Indicators**: RSI, MACD, Bollinger Bands for pattern recognition
- **Economic Calendar**: Fundamental analysis data
- **News Sentiment**: Market sentiment analysis
- **Real-time FX Data**: Live currency pair prices

### Polygon.io (OANDA Alternative)

- **Real-time Forex Data**: Live currency rates and aggregates
- **Market Snapshots**: Current market state and ticker information
- **Technical Indicators**: Built-in technical analysis (SMA, EMA, RSI, etc.)
- **Market Movers**: Top gainers and losers in forex markets
- **Market News**: Latest forex market news and updates
- **Market Status**: Real-time market open/close status
- **Historical Aggregates**: High-quality historical price data

### Quandl

- **Economic Indicators**: GDP, inflation, employment data
- **Central Bank Data**: Interest rates, monetary policy
- **Alternative Data**: Social media sentiment, satellite data
- **Commodity Prices**: Oil, gold, and other commodities

### Xignite

- **Institutional Data**: High-frequency trading data
- **Market Depth**: Order book analysis
- **Cross-Asset Data**: Correlations between markets
- **Regulatory Data**: Compliance and reporting

## 🛠️ Setup

1. **Install Dependencies**

```bash
bun install
```

2. **Environment Variables**
   Create a `.env` file:

```env
# Database
DATABASE_URL=postgresql://localhost:5432/forexa

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key

# Google AI (Gemini)
GOOGLE_API_KEY=your_gemini_api_key

# Data Providers
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
POLYGON_API_KEY=your_polygon_key
QUANDL_API_KEY=your_quandl_key
XIGNITE_API_KEY=your_xignite_key
```

3. **Database Setup**

```bash
# Generate migrations
bun run db:generate

# Run migrations
bun run db:migrate

# Open Drizzle Studio
bun run db:studio
```

4. **Start Development Server**

```bash
bun run dev
```

## 📡 API Endpoints

### Health Check

```http
GET /
```

### Market Data

```http
GET /market-data/{symbol}
# Example: GET /market-data/EUR/USD
```

### Forex Rate

```http
GET /forex-rate/{from}/{to}
# Example: GET /forex-rate/EUR/USD
```

### Market Movers

```http
GET /market-movers
# Returns top gainers and losers in forex markets
```

### Technical Indicators

```http
GET /technical-indicators/{currencyPair}/{indicator}
# Example: GET /technical-indicators/EURUSD/SMA
# Available indicators: SMA, EMA, RSI, MACD, etc.
```

### Market Status

```http
GET /market-status
# Returns current market open/close status
```

### AI Prediction

```http
GET /ai/predict/{symbol}
# Example: GET /ai/predict/EUR/USD
```

### Batch Predictions

```http
POST /ai/predict/batch
Content-Type: application/json

{
  "symbols": ["EUR/USD", "GBP/USD", "USD/JPY"]
}
```

## 🤖 AI Prediction Process

1. **Data Collection**: Fetches real-time data from multiple providers
2. **Feature Engineering**: Extracts technical indicators and market signals
3. **AI Analysis**: Gemini 2.0 Flash analyzes patterns and trends
4. **Prediction Output**: Returns BUY/SELL/HOLD with confidence scores

### Example AI Response

```json
{
  "prediction": "BUY",
  "confidence": 0.85,
  "reasoning": "Strong bullish momentum with RSI oversold and MACD crossover",
  "risk_level": "MEDIUM",
  "timeframe": "SHORT_TERM"
}
```

## 🔧 Development

### Project Structure

```
src/
├── index.ts              # Main server file
├── services/
│   ├── aiService.ts      # Gemini AI integration
│   └── dataProviders.ts  # Market data services
config/
├── env.ts               # Environment configuration
db/
├── schema.ts            # Database schema
├── connection.ts        # Database connection
└── migrations/          # Database migrations
```

### Available Scripts

- `bun run dev` - Start development server with hot reload
- `bun run start` - Start production server
- `bun run db:generate` - Generate database migrations
- `bun run db:migrate` - Run database migrations
- `bun run db:studio` - Open Drizzle Studio

## 🔐 Security

- Environment variables for sensitive data
- API key management
- Input validation
- Error handling

## 📈 Future Enhancements

- [ ] Real-time WebSocket connections
- [ ] Advanced technical analysis
- [ ] Machine learning model training
- [ ] Portfolio management
- [ ] Risk management tools
- [ ] Backtesting framework
- [ ] Mobile app integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
