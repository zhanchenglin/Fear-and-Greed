import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine
} from 'recharts';
import { HistoricalDataPoint } from '../types';
import { format } from 'date-fns';

interface HistoryChartProps {
  data: HistoricalDataPoint[];
}

const HistoryChart: React.FC<HistoryChartProps> = ({ data }) => {
  // Filter data to valid points and ensure sorted by date
  const chartData = data
    .filter(d => d.y !== null && d.x !== null)
    .sort((a, b) => a.x - b.x)
    .map(d => ({
      ...d,
      date: new Date(d.x), // Convert unix timestamp to Date object
      value: Math.round(d.y)
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg">
          <p className="text-sm font-semibold text-slate-700 mb-1">{format(dataPoint.date, 'MMM d, yyyy')}</p>
          <p className="text-sm font-bold text-slate-900">Score: {dataPoint.value}</p>
          <p className="text-xs text-slate-500 capitalize">{dataPoint.rating}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Historical Trend (1 Year)</h2>
        <div className="flex items-center gap-2 text-xs">
           <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span>Fear</span>
           <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400"></span>Neutral</span>
           <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span>Greed</span>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>

            {/* Background Zones */}
            <ReferenceArea y1={0} y2={25} fill="#fee2e2" fillOpacity={0.3} />
            <ReferenceArea y1={25} y2={45} fill="#ffedd5" fillOpacity={0.3} />
            <ReferenceArea y1={45} y2={55} fill="#f1f5f9" fillOpacity={0.3} />
            <ReferenceArea y1={55} y2={75} fill="#ecfccb" fillOpacity={0.3} />
            <ReferenceArea y1={75} y2={100} fill="#dcfce7" fillOpacity={0.3} />

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => format(date, 'MMM')}
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            
            <YAxis 
              domain={[0, 100]} 
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              ticks={[0, 25, 50, 75, 100]}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Line
              type="monotone"
              dataKey="value"
              stroke="#0f172a"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: "#0f172a", stroke: "#fff", strokeWidth: 2 }}
            />
            
            {/* Threshold Lines */}
            <ReferenceLine y={25} stroke="#94a3b8" strokeDasharray="2 2" strokeOpacity={0.5} />
            <ReferenceLine y={50} stroke="#94a3b8" strokeDasharray="2 2" strokeOpacity={0.5} />
            <ReferenceLine y={75} stroke="#94a3b8" strokeDasharray="2 2" strokeOpacity={0.5} />

          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HistoryChart;