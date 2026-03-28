export type Bias = 'bullish' | 'bearish' | 'neutral';

export type ForexPair = 'EURUSD' | 'USDJPY' | 'EURCAD' | 'XAUUSD';

export interface NewsItem {
  id: string;
  pair: ForexPair;
  title: string;
  description: string;
  bias: Bias;
  timestamp: string;
  source: string;
}
