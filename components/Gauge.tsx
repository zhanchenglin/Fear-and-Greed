import React from 'react';
import { motion } from 'framer-motion';
import { getSentimentColor } from '../services/cnnService';

interface GaugeProps {
  score: number;
  rating: string;
  timestamp: string;
  previousClose: number;
  weekAgo: number;
  monthAgo: number;
  yearAgo: number;
}

const Gauge: React.FC<GaugeProps> = ({ 
  score, 
  rating, 
  timestamp,
  previousClose,
  weekAgo,
  monthAgo,
  yearAgo
}) => {
  const radius = 85;
  const stroke = 12;
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const circumference = normalizedScore * Math.PI * (radius / 100); 
  
  // Calculate needle rotation (0 to 180 degrees)
  const rotation = (normalizedScore / 100) * 180;
  
  const currentColor = getSentimentColor(score);

  const StatItem = ({ label, value }: { label: string, value: number }) => (
    <div className="flex flex-col items-center p-2 rounded-lg bg-slate-50 border border-slate-100 min-w-[80px]">
      <span className="text-xs text-slate-500 font-medium mb-1">{label}</span>
      <span className="text-sm font-bold text-slate-800">{Math.round(value)}</span>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-between h-full">
      <h2 className="text-xl font-bold text-slate-800 self-start mb-6">Current Sentiment</h2>
      
      <div className="relative w-64 h-32 mb-4 overflow-hidden">
        {/* Background Arc */}
        <svg className="w-full h-full" viewBox="0 0 200 100">
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          
          {/* Colored Sections Overlay (Optional visual guide) */}
          <path d="M 20 100 A 80 80 0 0 1 60 100" stroke="transparent" fill="none" />
          
          {/* Foreground Arc (The Value) */}
          <motion.path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={currentColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${Math.PI * 80}`} // Full semi-circle length
            strokeDashoffset={Math.PI * 80} // Initial hide
            initial={{ strokeDashoffset: Math.PI * 80 }}
            animate={{ strokeDashoffset: Math.PI * 80 - (Math.PI * 80 * (normalizedScore / 100)) }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>

        {/* Needle */}
        <motion.div 
          className="absolute bottom-0 left-1/2 w-full h-1 origin-bottom-left"
          initial={{ rotate: 0 }}
          animate={{ rotate: rotation }}
          transition={{ duration: 1.5, ease: "circOut" }}
          style={{ 
            width: '80px', 
            marginLeft: '-80px', // Center the pivot
            zIndex: 10
          }}
        >
          <div className="w-full h-full flex justify-end items-center">
             <div className="w-3 h-3 rounded-full bg-slate-800 -mr-1.5 shadow-md"></div>
             <div className="flex-1 h-1 bg-slate-800 rounded-l-full"></div>
          </div>
        </motion.div>
        
        {/* Center Text */}
        <div className="absolute bottom-0 left-0 w-full text-center mb-0">
          <div className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
            {Math.round(score)}
          </div>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="text-lg font-semibold uppercase tracking-wide" style={{ color: currentColor }}>
          {rating}
        </div>
        <div className="text-xs text-slate-400 mt-2 font-mono">
          Last updated: {new Date(timestamp).toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 w-full mt-auto">
        <StatItem label="Close" value={previousClose} />
        <StatItem label="1 Week" value={weekAgo} />
        <StatItem label="1 Month" value={monthAgo} />
        <StatItem label="1 Year" value={yearAgo} />
      </div>
    </div>
  );
};

export default Gauge;