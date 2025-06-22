import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../../config/env";
import { MarketDataService } from "./dataProviders";

export class GeminiAIService {
  private genAI: GoogleGenerativeAI;
  private marketDataService: MarketDataService;

  constructor() {
    this.genAI = new GoogleGenerativeAI(config.googleApiKey);
    this.marketDataService = new MarketDataService();
  }

  async generatePrediction(symbol: string): Promise<any> {
    try {
      // 1. Fetch comprehensive market data
      const marketData =
        await this.marketDataService.getComprehensiveMarketData(symbol);
      const aiReadyData = this.marketDataService.prepareDataForAI(marketData);

      // 2. Create prompt for Gemini
      const prompt = this.createAnalysisPrompt(aiReadyData);

      // 3. Generate prediction using Gemini 2.0 Flash
      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // 4. Parse AI response
      const prediction = this.parseAIResponse(text);

      return {
        symbol,
        prediction,
        confidence: prediction.confidence,
        reasoning: prediction.reasoning,
        timestamp: new Date().toISOString(),
        model: "gemini-2.0-flash",
        marketData: aiReadyData,
      };
    } catch (error) {
      console.error("AI prediction error:", error);
      throw error;
    }
  }

  private createAnalysisPrompt(marketData: any): string {
    return `
You are an expert forex trading analyst. Analyze the following market data and provide a trading prediction.

Market Data:
- Symbol: ${marketData.metadata.symbol}
- Timestamp: ${marketData.metadata.timestamp}
- Price Data: ${JSON.stringify(marketData.features.price, null, 2)}
- Technical Indicators: ${JSON.stringify(
      marketData.features.technical,
      null,
      2
    )}

Please provide your analysis in the following JSON format:
{
  "prediction": "BUY|SELL|HOLD",
  "confidence": 0.85,
  "reasoning": "Detailed explanation of your analysis",
  "risk_level": "LOW|MEDIUM|HIGH",
  "timeframe": "SHORT_TERM|MEDIUM_TERM|LONG_TERM"
}

Consider:
1. Technical analysis patterns
2. Market sentiment
3. Risk factors
4. Economic indicators
5. Historical patterns

Be concise but thorough in your reasoning.
`;
  }

  private parseAIResponse(response: string): any {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback parsing
      return {
        prediction: "HOLD",
        confidence: 0.5,
        reasoning: response,
        risk_level: "MEDIUM",
        timeframe: "SHORT_TERM",
      };
    } catch (error) {
      console.error("AI response parsing error:", error);
      return {
        prediction: "HOLD",
        confidence: 0.5,
        reasoning: "Error parsing AI response",
        risk_level: "MEDIUM",
        timeframe: "SHORT_TERM",
      };
    }
  }

  // Batch prediction for multiple symbols
  async generateBatchPredictions(symbols: string[]): Promise<any[]> {
    const predictions = await Promise.all(
      symbols.map((symbol) => this.generatePrediction(symbol))
    );
    return predictions;
  }
}
