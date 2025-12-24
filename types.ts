export interface FearGreedData {
  score: number;
  rating: string;
  timestamp: string;
  previous_close: number;
  previous_1_week: number;
  previous_1_month: number;
  previous_1_year: number;
}

export interface HistoricalDataPoint {
  x: number; // Unix timestamp
  y: number; // Score
  rating: string;
}

export interface HistoricalData {
  data: HistoricalDataPoint[];
  score: number;
  rating: string;
  timestamp: number;
}

export interface APIResponse {
  fear_and_greed: FearGreedData;
  fear_and_greed_historical: HistoricalData;
}

export enum SentimentRating {
  EXTREME_FEAR = 'Extreme Fear',
  FEAR = 'Fear',
  NEUTRAL = 'Neutral',
  GREED = 'Greed',
  EXTREME_GREED = 'Extreme Greed',
}