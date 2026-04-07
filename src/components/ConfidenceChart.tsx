import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { DriftData } from '../types';
import { motion } from 'motion/react';

interface ConfidenceChartProps {
  data: DriftData[];
}

const ConfidenceChart: React.FC<ConfidenceChartProps> = ({ data }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-[350px] w-full cyber-card p-8 rounded-2xl"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Neural Drift Analysis</h3>
          <p className="text-xs font-bold text-white">Model Stability Index</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
          <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></div>
          <span className="text-[8px] font-black text-cyan-500 uppercase tracking-widest">Live Sync</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="cyberGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00baff" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#00baff" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0, 186, 255, 0.05)" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#475569', fontSize: 10, fontWeight: 800 }}
            dy={10}
          />
          <YAxis 
            domain={[0.5, 1]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#475569', fontSize: 10, fontWeight: 800 }}
            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0a0c14', 
              border: '1px solid rgba(0, 186, 255, 0.2)',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 'bold'
            }}
            itemStyle={{ color: '#00baff' }}
            formatter={(value: number) => [`${(value * 100).toFixed(2)}%`, 'Confidence']}
          />
          <Area 
            type="monotone" 
            dataKey="avgConfidence" 
            stroke="#00baff" 
            strokeWidth={4} 
            fillOpacity={1} 
            fill="url(#cyberGradient)" 
            dot={{ r: 5, fill: '#00baff', strokeWidth: 2, stroke: '#02040a' }}
            activeDot={{ r: 8, strokeWidth: 0, fill: '#fff' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default ConfidenceChart;
