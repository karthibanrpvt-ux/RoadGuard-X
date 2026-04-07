import React from 'react';
import { Filter, Map as MapIcon, BarChart3, Database, ShieldAlert, Cpu, Zap, Bell, ChevronDown, Share2 } from 'lucide-react';
import { DamageClass, Severity } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  selectedClasses: DamageClass[];
  setSelectedClasses: (classes: DamageClass[]) => void;
  selectedSeverities: Severity[];
  setSelectedSeverities: (severities: Severity[]) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  selectedClasses,
  setSelectedClasses,
  selectedSeverities,
  setSelectedSeverities,
  activeTab,
  setActiveTab,
}) => {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const classes: DamageClass[] = ['Pothole', 'Longitudinal Crack', 'Transverse Crack'];
  const severities: Severity[] = ['Low', 'Medium', 'High'];

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'edge', label: 'Edge Simulation', icon: Cpu },
    { id: 'mlops', label: 'MLOps Pipeline', icon: Zap },
    { id: 'topology', label: 'Pipeline Topology', icon: Share2 },
  ];

  const toggleClass = (c: DamageClass) => {
    if (selectedClasses.includes(c)) {
      setSelectedClasses(selectedClasses.filter((item) => item !== c));
    } else {
      setSelectedClasses([...selectedClasses, c]);
    }
  };

  const toggleSeverity = (s: Severity) => {
    if (selectedSeverities.includes(s)) {
      setSelectedSeverities(selectedSeverities.filter((item) => item !== s));
    } else {
      setSelectedSeverities([...selectedSeverities, s]);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-[#02040a]/60 backdrop-blur-2xl border-b border-cyan-500/10 z-[100] px-8 flex items-center justify-between shadow-[0_10px_50px_rgba(0,0,0,0.5)]">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      </div>

      <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('analytics')}>
        <motion.div 
          whileHover={{ rotate: 180, scale: 1.1 }}
          className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20 shadow-[0_0_15px_rgba(0,186,255,0.2)] group-hover:shadow-[0_0_25px_rgba(0,186,255,0.4)] transition-all"
        >
          <ShieldAlert className="w-6 h-6 text-cyan-500" />
        </motion.div>
        <div>
          <h1 className="text-xl font-black tracking-tighter text-white font-display uppercase glitch" data-text="ROADGUARD X">
            ROADGUARD <span className="text-cyan-500">X</span>
          </h1>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(0,186,255,1)]"></span>
            <p className="text-[8px] text-cyan-500/70 font-black uppercase tracking-[0.3em]">Neural Network Active</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <ul className="hidden md:flex items-center gap-8">
          {tabs.map((tab) => (
            <motion.li key={tab.id} whileHover={{ y: -2 }}>
              <button 
                onClick={() => setActiveTab(tab.id)}
                className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === tab.id ? 'text-cyan-500 neon-text' : 'text-slate-500 hover:text-cyan-400'
                }`}
              >
                <tab.icon className="w-3 h-3" />
                {tab.label}
              </button>
            </motion.li>
          ))}
        </ul>

        <div className="h-8 w-px bg-white/5" />

        <div className="relative">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-3 px-5 py-2 bg-cyan-500/5 border border-cyan-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all"
          >
            <Filter className="w-3 h-3 text-cyan-500" />
            Matrix Filters
            <ChevronDown className={`w-3 h-3 transition-transform duration-500 ${isFilterOpen ? 'rotate-180' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-4 w-72 cyber-card p-6 rounded-2xl z-[110]"
              >
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Zap className="w-3 h-3 text-cyan-500" />
                      Damage Classes
                    </p>
                    <div className="space-y-2">
                      {classes.map((c) => (
                        <label key={c} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedClasses.includes(c)}
                            onChange={() => toggleClass(c)}
                            className="w-4 h-4 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-500"
                          />
                          <span className="text-xs text-slate-400 group-hover:text-white transition-colors">{c}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Bell className="w-3 h-3 text-cyan-500" />
                      Priority
                    </p>
                    <div className="space-y-2">
                      {severities.map((s) => (
                        <label key={s} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedSeverities.includes(s)}
                            onChange={() => toggleSeverity(s)}
                            className="w-4 h-4 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-500"
                          />
                          <span className="text-xs text-slate-400 group-hover:text-white transition-colors">{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
