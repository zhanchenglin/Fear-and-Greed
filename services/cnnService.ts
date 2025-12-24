import { APIResponse } from '../types';

// The endpoint provided by CNN
// Note: We use the base URL without trailing slash to avoid double slashes when appending
const TARGET_URL = "https://production.dataviz.cnn.io/index/fearandgreed/graphdata";

interface ProxyStrategy {
  name: string;
  getUrl: (target: string) => string;
  parseResponse: (data: any) => any;
}

const PROXY_STRATEGIES: ProxyStrategy[] = [
  // Strategy 1: AllOrigins (Wrapped) 
  // Most reliable because it returns a JSON wrapper, avoiding browser strictness on headers.
  {
    name: "AllOrigins (Wrapped)",
    getUrl: (target) => `https://api.allorigins.win/get?url=${encodeURIComponent(target)}&disableCache=true`,
    parseResponse: (data) => {
      if (!data.contents) throw new Error("Empty contents from AllOrigins");
      // AllOrigins returns the stringified JSON in 'contents'
      return JSON.parse(data.contents);
    }
  },
  // Strategy 2: CORSProxy.io
  // Good performance, but sometimes blocked by strict WAFs.
  {
    name: "CORSProxy.io",
    getUrl: (target) => `https://corsproxy.io/?${target}`,
    parseResponse: (data) => data
  }
];

export const fetchFearAndGreedIndex = async (): Promise<APIResponse> => {
  let lastError: Error | null = null;

  for (const strategy of PROXY_STRATEGIES) {
    try {
      // Add a random parameter to the TARGET URL to prevent caching at the source/proxy level
      // We append it to the target url before encoding
      const timestamp = new Date().getTime();
      const targetWithCacheBuster = `${TARGET_URL}/${timestamp}`; // CNN endpoint accepts path segments, but safe query param is better usually. 
      // Actually CNN API ignores extra path segments usually, but let's stick to the base URL and rely on the proxy's cache busting
      
      const proxyUrl = strategy.getUrl(TARGET_URL);
      
      console.log(`Attempting fetch via ${strategy.name}...`);
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
            // Standard headers to avoid triggering WAFs
            'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();
      const finalData = strategy.parseResponse(rawData);

      // Validate strict structure to ensure we have valid data
      if (typeof finalData?.fear_and_greed?.score !== 'number') {
        throw new Error("Invalid data structure received");
      }

      return finalData as APIResponse;

    } catch (error: any) {
      console.warn(`Failed via ${strategy.name}:`, error.message);
      lastError = error;
      // Continue to next strategy loop
    }
  }

  console.error("All proxies failed to fetch Fear & Greed Index");
  throw lastError || new Error("Unable to retrieve market data. Please try again later.");
};

export const getSentimentColor = (score: number): string => {
  if (score < 25) return '#ef4444'; // Red - Extreme Fear
  if (score < 45) return '#f97316'; // Orange - Fear
  if (score < 55) return '#eab308'; // Yellow - Neutral
  if (score < 75) return '#84cc16'; // Lime - Greed
  return '#22c55e'; // Green - Extreme Greed
};

export const getSentimentLabel = (score: number): string => {
  if (score < 25) return 'Extreme Fear';
  if (score < 45) return 'Fear';
  if (score < 55) return 'Neutral';
  if (score < 75) return 'Greed';
  return 'Extreme Greed';
};