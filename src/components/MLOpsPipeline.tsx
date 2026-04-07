import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { AlertTriangle, Zap, Cpu, ShieldCheck, Activity, RefreshCcw, Database, HardDrive, Share2 } from 'lucide-react';

const MLOpsPipeline: React.FC = () => {
  const [isRetraining, setIsRetraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const API_BASE_URL = 'http://localhost:8000/api/v1';

  const driftData = Array.from({ length: 30 }, (_, i) => {
    const base = 0.85;
    const drop = (i / 29) * 0.23;
    const noise = Math.random() * 0.05;
    return {
      day: i + 1,
      mAP: (base - drop + noise).toFixed(2),
    };
  });

  const handleRetrain = async () => {
    setIsRetraining(true);
    setProgress(0);
    const steps = [
      'Fetching new data from Coimbatore nodes...',
      'Preprocessing image dataset...',
      'Fine-tuning YOLOv8 model...',
      'Validating against test set...',
      'Converting to ONNX format...',
      'Pushing updated weights to Edge Nodes...'
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });

      if (stepIdx < steps.length && Math.random() > 0.7) {
        setCurrentStep(steps[stepIdx]);
        stepIdx++;
      }
    }, 100);

    // Call backend retrain endpoint
    try {
      const res = await fetch(`${API_BASE_URL}/mlops/retrain`, { method: 'POST' });
      const result = await res.json();
      setCurrentStep(`Backend: ${result.status}`);
      setTimeout(() => {
        setIsRetraining(false);
      }, 500);
    } catch (err) {
      console.error('Retrain failed:', err);
      setIsRetraining(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Alert Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-rose-500/10 border border-rose-500/30 rounded-3xl p-8 flex items-center justify-between shadow-[0_0_30px_rgba(244,63,94,0.1)]"
      >
        <div className="flex items-center gap-6">
          <div className="p-4 bg-rose-500/20 rounded-2xl border border-rose-500/40 animate-pulse">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-1">Model Drift Detected</h3>
            <p className="text-rose-500/70 text-xs font-bold uppercase tracking-widest">mAP threshold below 0.70. Confidence levels unstable.</p>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(244,63,94,0.4)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRetrain}
          disabled={isRetraining}
          className="px-8 py-4 bg-rose-500 rounded-2xl text-black text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50"
        >
          Trigger Airflow Retraining DAG
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* mAP Chart */}
          <div className="cyber-card p-10 rounded-3xl">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                <Activity className="w-5 h-5 text-cyan-500" />
              </div>
              <div>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Performance Monitoring</h3>
                <p className="text-xs font-bold text-white">Mean Average Precision (mAP) - Last 30 Days</p>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={driftData}>
                  <defs>
                    <linearGradient id="colorMap" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    stroke="#475569" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: '#475569', fontWeight: 900 }}
                  />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    domain={[0.5, 1]}
                    tick={{ fill: '#475569', fontWeight: 900 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(10, 12, 20, 0.9)', 
                      border: '1px solid rgba(244, 63, 94, 0.3)',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: 900,
                      color: '#fff'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="mAP" 
                    stroke="#f43f5e" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorMap)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Retraining Progress */}
          <AnimatePresence>
            {isRetraining && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="cyber-card p-10 rounded-3xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <RefreshCcw className="w-5 h-5 text-cyan-500 animate-spin" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">{currentStep || 'Initializing Pipeline...'}</span>
                  </div>
                  <span className="text-xs font-black text-cyan-500">{progress}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-full rounded-full shadow-[0_0_15px_rgba(0,186,255,0.4)]"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-10">
          <div className="cyber-card p-10 rounded-3xl">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                <Database className="w-5 h-5 text-cyan-500" />
              </div>
              <div>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Dataset Health</h3>
                <p className="text-xs font-bold text-white">Training Distribution</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {[
                { label: 'Pothole Images', count: '12,402', color: 'bg-cyan-500' },
                { label: 'Crack Images', count: '8,150', color: 'bg-cyan-500/60' },
                { label: 'Negative Samples', count: '4,200', color: 'bg-white/10' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                    <span className="text-[10px] font-black text-white">{item.count}</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1">
                    <div className={`${item.color} h-full rounded-full`} style={{ width: i === 0 ? '80%' : i === 1 ? '60%' : '40%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cyber-card p-10 rounded-3xl">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                <HardDrive className="w-5 h-5 text-cyan-500" />
              </div>
              <div>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Edge Nodes</h3>
                <p className="text-xs font-bold text-white">Weight Distribution</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Model Version</span>
                <span className="text-[10px] font-black text-cyan-500">v8.4.2-STABLE</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Sync</span>
                <span className="text-[10px] font-black text-slate-500">2h 14m ago</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Nodes</span>
                <span className="text-[10px] font-black text-cyan-500">12 / 12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLOpsPipeline;
