import axios from "axios";
import { config } from "../../config/env";

// Alpha Vantage API Service
export class AlphaVantageService {
  private baseUrl = "https://www.alphavantage.co/query";
  private apiKey = config.alphaVantageKey;

  async getForexData(symbol: string, interval: string = "5min") {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          function: "FX_INTRADAY",
          from_symbol: symbol.split("/")[0],
          to_symbol: symbol.split("/")[1],
          interval,
          apikey: this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Alpha Vantage API error:", error);
      throw error;
    }
  }

  async getTechnicalIndicators(symbol: string, indicator: string = "RSI") {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          function: indicator,
          symbol,
          interval: "daily",
          time_period: 14,
          series_type: "close",
          apikey: this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Technical indicators error:", error);
      throw error;
    }
  }

  async getEconomicIndicators(indicator: string = "REAL_GDP") {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          function: "ECONOMIC_CALENDAR",
          apikey: this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Economic indicators error:", error);
      throw error;
    }
  }
}

// Polygon.io API Service (OANDA Alternative)
export class PolygonService {
  private baseUrl = "https://api.polygon.io";
  private apiKey = config.polygonApiKey;

  async getForexRates(from: string, to: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/v1/conversion/${from}/${to}`,
        {
          params: {
            apikey: this.apiKey,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Polygon forex rates error:", error);
      throw error;
    }
  }

  async getForexAggregates(
    currencyPair: string,
    multiplier: number = 5,
    timespan: string = "minute",
    from: string,
    to: string
  ) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/v2/aggs/ticker/C:${currencyPair}/range/${multiplier}/${timespan}/${from}/${to}`,
        {
          params: {
            apikey: this.apiKey,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Polygon aggregates error:", error);
      throw error;
    }
  }

  async getForexPreviousClose(currencyPair: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/v2/aggs/ticker/C:${currencyPair}/prev`,
        {
          params: {
            apikey: this.apiKey,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Polygon previous close error:", error);
      throw error;
    }
  }

  async getForexSnapshot(currencyPair: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/v2/snapshot/locale/global/markets/forex/tickers/C:${currencyPair}`,
        {
          params: {
            apikey: this.apiKey,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Polygon snapshot error:", error);
      throw error;
    }
  }

  async getForexGainersLosers() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/v2/snapshot/locale/global/markets/forex/gainers`,
        {
          params: {
            apikey: this.apiKey,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Polygon gainers/losers error:", error);
      throw error;
    }
  }

  async getMarketNews(ticker: string = "C:FOREX") {
    try {
      const response = await axios.get(`${this.baseUrl}/v2/reference/news`, {
        params: {
          ticker,
          apikey: this.apiKey,
          limit: 10,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Polygon market news error:", error);
      throw error;
    }
  }

  async getTechnicalIndicators(
    currencyPair: string,
    indicator: string = "SMA",
    timespan: string = "day",
    window: number = 14
  ) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/v1/indicators/${indicator}/C:${currencyPair}`,
        {
          params: {
            timespan,
            window,
            apikey: this.apiKey,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Polygon technical indicators error:", error);
      throw error;
    }
  }

  async getMarketStatus() {
    try {
      const response = await axios.get(`${this.baseUrl}/v1/marketstatus/now`, {
        params: {
          apikey: this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Polygon market status error:", error);
      throw error;
    }
  }
}

// Data Aggregation Service
export class MarketDataService {
  private alphaVantage = new AlphaVantageService();
  private polygon = new PolygonService();

  async getComprehensiveMarketData(symbol: string) {
    try {
      const now = new Date().toISOString().split("T")[0];
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      const currencyPair = symbol.replace("/", "");

      // Fetch data from multiple sources
      const [forexData, technicalData, aggregates, snapshot, newsData] =
        await Promise.all([
          this.alphaVantage.getForexData(symbol),
          this.alphaVantage.getTechnicalIndicators(symbol),
          this.polygon.getForexAggregates(
            currencyPair,
            5,
            "minute",
            oneDayAgo,
            now
          ),
          this.polygon.getForexSnapshot(currencyPair),
          this.polygon.getMarketNews(),
        ]);

      return {
        symbol,
        timestamp: new Date().toISOString(),
        forexData,
        technicalData,
        aggregates,
        snapshot,
        newsData,
        dataSources: ["Alpha Vantage", "Polygon.io"],
      };
    } catch (error) {
      console.error("Market data aggregation error:", error);
      throw error;
    }
  }

  // Prepare data for AI analysis
  prepareDataForAI(marketData: any) {
    const features = {
      price:
        marketData.forexData?.["Time Series FX (5min)"]?.[
          Object.keys(marketData.forexData["Time Series FX (5min)"])[0]
        ] || {},
      technical: marketData.technicalData?.["Technical Analysis: RSI"] || {},
      aggregates: marketData.aggregates?.results?.[0] || {},
      snapshot: marketData.snapshot?.results || {},
      news: marketData.newsData?.results?.slice(0, 5) || [], // Latest 5 news items
    };

    return {
      features,
      metadata: {
        symbol: marketData.symbol,
        timestamp: marketData.timestamp,
        dataSource: marketData.dataSources.join(" + "),
      },
    };
  }

  // Get forex rates for a specific pair
  async getForexRate(from: string, to: string) {
    try {
      const rate = await this.polygon.getForexRates(from, to);
      return rate;
    } catch (error) {
      console.error("Error fetching forex rate:", error);
      throw error;
    }
  }

  // Get market gainers and losers
  async getMarketGainersLosers() {
    try {
      const data = await this.polygon.getForexGainersLosers();
      return data;
    } catch (error) {
      console.error("Error fetching market gainers/losers:", error);
      throw error;
    }
  }

  // Get technical indicators from Polygon
  async getPolygonTechnicalIndicators(
    currencyPair: string,
    indicator: string = "SMA"
  ) {
    try {
      const indicators = await this.polygon.getTechnicalIndicators(
        currencyPair,
        indicator
      );
      return indicators;
    } catch (error) {
      console.error("Error fetching technical indicators:", error);
      throw error;
    }
  }

  // Get market status
  async getMarketStatus() {
    try {
      const status = await this.polygon.getMarketStatus();
      return status;
    } catch (error) {
      console.error("Error fetching market status:", error);
      throw error;
    }
  }
}
