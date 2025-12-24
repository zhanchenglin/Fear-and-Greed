import React, { useEffect, useState } from 'react';
import { fetchFearAndGreedIndex } from './services/cnnService';
import { APIResponse } from './types';
import Gauge from './components/Gauge';
import HistoryChart from './components/HistoryChart';
import { TrendingUp, TrendingDown, RefreshCcw, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFearAndGreedIndex();
      setData(result);
    } catch (err) {
      setError('Failed to fetch market data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              Fear & Greed Index
            </h1>
            <p className="text-slate-500 mt-1">Real-time market sentiment analysis based on CNN data</p>
          </div>
          <button 
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-lg hover:bg-slate-50 hover:shadow transition-all text-sm font-medium text-slate-700 disabled:opacity-50"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Updating...' : 'Refresh Data'}
          </button>
        </header>

        {/* Content Area */}
        {error ? (
          <div className="w-full p-6 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700">
            <AlertCircle className="w-6 h-6" />
            <p>{error}</p>
          </div>
        ) : loading || !data ? (
          // Skeleton Loading
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-[500px] lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 animate-pulse"></div>
            <div className="h-[500px] lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 animate-pulse"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Gauge */}
            <div className="lg:col-span-1 h-full min-h-[500px]">
              <Gauge 
                score={data.fear_and_greed.score}
                rating={data.fear_and_greed.rating}
                timestamp={data.fear_and_greed.timestamp}
                previousClose={data.fear_and_greed.previous_close}
                weekAgo={data.fear_and_greed.previous_1_week}
                monthAgo={data.fear_and_greed.previous_1_month}
                yearAgo={data.fear_and_greed.previous_1_year}
              />
            </div>

            {/* Right Column: Chart */}
            <div className="lg:col-span-2 h-full min-h-[500px]">
              <HistoryChart data={data.fear_and_greed_historical.data} />
            </div>

          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-slate-400 text-sm">
          <p>Data provided by CNN Business. This is a visualization demo.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;