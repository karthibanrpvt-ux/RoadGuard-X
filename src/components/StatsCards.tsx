import React from 'react';
import { AlertTriangle, ShieldCheck, Activity, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface StatsCardsProps {
  totalDetections: number;
  avgConfidence: number;
  highSeverityCount: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({ totalDetections, avgConfidence, highSeverityCount }) => {
  const cards = [
    {
      label: 'Live Detections',
      value: totalDetections,
      icon: Activity,
      color: 'cyan',
      trend: '+12.5%',
    },
    {
      label: 'Neural Confidence',
      value: `${(avgConfidence * 100).toFixed(1)}%`,
      icon: ShieldCheck,
      color: 'cyan',
      trend: '+0.4%',
    },
    {
      label: 'Critical Alerts',
      value: highSeverityCount,
      icon: AlertTriangle,
      color: 'rose',
      trend: '-2.1%',
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {cards.map((card, idx) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1, type: 'spring', stiffness: 100 }}
          whileHover={{ 
            y: -10, 
            scale: 1.05,
            rotateX: -5,
            rotateY: 5,
            boxShadow: '0 20px 50px rgba(0, 186, 255, 0.2)',
            transition: { duration: 0.2 }
          }}
          className="cyber-card p-8 rounded-2xl group cursor-pointer perspective-1000"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
            <Zap className="w-12 h-12 text-cyan-500" />
          </div>
          
          <div className="flex justify-between items-start mb-6">
            <div className={`p-4 rounded-2xl bg-${card.color === 'rose' ? 'rose' : 'cyan'}-500/10 border border-${card.color === 'rose' ? 'rose' : 'cyan'}-500/20 shadow-[0_0_20px_rgba(0,186,255,0.1)] group-hover:border-cyan-500 transition-colors`}>
              <card.icon className={`w-6 h-6 text-${card.color === 'rose' ? 'rose' : 'cyan'}-500`} />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <TrendingUp className={`w-3 h-3 ${card.trend.startsWith('+') ? 'text-cyan-400' : 'text-rose-400'}`} />
              <span className={`text-[10px] font-black tracking-tighter ${card.trend.startsWith('+') ? 'text-cyan-400' : 'text-rose-400'}`}>{card.trend}</span>
            </div>
          </div>
          
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 group-hover:text-slate-400 transition-colors">{card.label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-black text-white font-display tracking-tighter neon-text group-hover:scale-110 transition-transform origin-left">{card.value}</h3>
              <span className="text-[10px] font-bold text-cyan-500/50 uppercase">Active</span>
            </div>
          </div>

          <div className="mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '70%' }}
              transition={{ duration: 2, delay: 0.5 }}
              className={`h-full bg-${card.color === 'rose' ? 'rose' : 'cyan'}-500 shadow-[0_0_10px_rgba(0,186,255,0.5)]`}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;
