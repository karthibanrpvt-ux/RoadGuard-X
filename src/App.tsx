import React, { useState, useMemo } from 'react';
import { generateMockData, generateDriftData } from './mockData';
import { DamageClass, Severity } from './types';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import StatsCards from './components/StatsCards';
import DamageMap from './components/DamageMap';
import ConfidenceChart from './components/ConfidenceChart';
import DataTable from './components/DataTable';
import CyberBackground from './components/CyberBackground';
import CyberTerminal from './components/CyberTerminal';
import EdgeSimulation from './components/EdgeSimulation';
import MLOpsPipeline from './components/MLOpsPipeline';
import PipelineTopology from './components/PipelineTopology';
import { RefreshCcw, Download, Share2, Terminal, Shield, Globe, Cpu, Activity, Zap, Eye, Target, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export default function App() {
  const [allData, setAllData] = useState(() => generateMockData(50));
  const [driftData] = useState(() => generateDriftData());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('analytics');

  // Fetch detections from backend on mount
  React.useEffect(() => {
    const fetchDetections = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/detections`);
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          const transformed = json.data.map((item: any) => ({
            id: item.id,
            timestamp: item.timestamp,
            latitude: item.latitude,
            longitude: item.longitude,
            damage_class: item.damage_class,
            severity: item.severity,
            model_confidence: item.confidence * 100,
          }));
          setAllData(transformed);
        }
      } catch (err) {
        console.log('Backend not reachable, using mock data');
      }
    };
    fetchDetections();
    const interval = setInterval(fetchDetections, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const [selectedClasses, setSelectedClasses] = useState<DamageClass[]>([
    'Pothole', 
    'Longitudinal Crack', 
    'Transverse Crack'
  ]);
  const [selectedSeverities, setSelectedSeverities] = useState<Severity[]>([
    'Low', 
    'Medium', 
    'High'
  ]);

  const filteredData = useMemo(() => {
    return allData.filter(item => 
      selectedClasses.includes(item.damage_class) && 
      selectedSeverities.includes(item.severity)
    );
  }, [allData, selectedClasses, selectedSeverities]);

  const stats = useMemo(() => {
    const total = filteredData.length;
    const avgConf = total > 0 
      ? filteredData.reduce((acc, curr) => acc + curr.model_confidence, 0) / total 
      : 0;
    const highSeverity = filteredData.filter(item => item.severity === 'High').length;
    
    return { total, avgConf, highSeverity };
  }, [filteredData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetch(`${API_BASE_URL}/detections`)
      .then(res => res.json())
      .then(json => {
        if (json.data && json.data.length > 0) {
          const transformed = json.data.map((item: any) => ({
            id: item.id,
            timestamp: item.timestamp,
            latitude: item.latitude,
            longitude: item.longitude,
            damage_class: item.damage_class,
            severity: item.severity,
            model_confidence: item.confidence * 100,
          }));
          setAllData(transformed);
        }
        setIsRefreshing(false);
      })
      .catch(() => {
        console.log('Refresh failed, keeping current data');
        setIsRefreshing(false);
      });
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-200 font-sans selection:bg-cyan-500/30 pb-20">
      <CyberBackground />
      <CustomCursor />
      
      <Navbar 
        selectedClasses={selectedClasses}
        setSelectedClasses={setSelectedClasses}
        selectedSeverities={selectedSeverities}
        setSelectedSeverities={setSelectedSeverities}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="max-w-7xl mx-auto px-8 pt-32">
        {/* HUD Elements */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
          <div className="absolute top-32 left-8 flex flex-col gap-4">
            <div className="w-1 h-32 bg-gradient-to-b from-cyan-500/50 to-transparent rounded-full" />
            <div className="text-[8px] font-black text-cyan-500/50 uppercase tracking-[0.5em] rotate-90 origin-left mt-4 whitespace-nowrap">
              System_Integrity_v2.4
            </div>
          </div>
          <div className="absolute bottom-8 right-8 flex flex-col items-end gap-4">
            <div className="text-[8px] font-black text-cyan-500/50 uppercase tracking-[0.5em] mb-4">
              Sector_07_Active
            </div>
            <div className="w-32 h-1 bg-gradient-to-l from-cyan-500/50 to-transparent rounded-full" />
          </div>
        </div>

        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 relative"
        >
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-[10px] font-black uppercase tracking-[0.2em] border border-cyan-500/20 shadow-[0_0_15px_rgba(0,186,255,0.1)]">
                <Activity className="w-3 h-3" />
                System Live
              </span>
              <span className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
                Sector: Coimbatore_Grid_07
              </span>
            </div>
            <h2 className="text-6xl font-black text-white font-display tracking-tighter leading-none glitch" data-text="NEURAL SURVEILLANCE">
              NEURAL <span className="text-cyan-500">SURVEILLANCE</span>
            </h2>
            <div className="flex items-center gap-6 mt-6">
              <p className="text-slate-500 max-w-xl text-sm font-medium leading-relaxed">
                Autonomous road infrastructure monitoring system utilizing edge-based YOLOv8 inference and geospatial neural tagging.
              </p>
              <div className="hidden xl:block w-px h-12 bg-white/5" />
              <div className="hidden xl:block">
                <CyberTerminal />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="cyber-button flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
            >
              <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-500' : ''}`} />
              Sync Neural Link
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: '0_0_25px_rgba(0,186,255,0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="cyber-button flex items-center gap-3 px-8 py-3 bg-cyan-500 rounded-2xl text-xs font-black uppercase tracking-widest text-black transition-all"
            >
              <Share2 className="w-4 h-4" />
              Export Intelligence
            </motion.button>
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <StatsCards 
                totalDetections={stats.total}
                avgConfidence={stats.avgConf}
                highSeverityCount={stats.highSeverity}
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="lg:col-span-2"
                >
                  <div className="cyber-card p-8 rounded-3xl h-full group">
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                          <Globe className="w-5 h-5 text-cyan-500" />
                        </div>
                        <div>
                          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Geospatial Matrix</h3>
                          <p className="text-xs font-bold text-white">Live Coimbatore Sector</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.6)]"></span>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Critical</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(0,186,255,0.6)]"></span>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden border border-white/5">
                      <div className="absolute inset-0 pointer-events-none z-10 border-[20px] border-transparent shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"></div>
                      <DamageMap data={filteredData} />
                    </div>
                  </div>
                </motion.div>
                
                <div className="space-y-10">
                  <ConfidenceChart data={driftData} />
                  
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="cyber-card p-10 rounded-3xl"
                  >
                    <div className="flex items-center gap-4 mb-10">
                      <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                        <Shield className="w-5 h-5 text-cyan-500" />
                      </div>
                      <div>
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">System Core</h3>
                        <p className="text-xs font-bold text-white">MLOps Integrity</p>
                      </div>
                    </div>
                    
                    <div className="space-y-8">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Edge Node 01</span>
                        <span className="flex items-center gap-2 text-[9px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                          <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
                          Operational
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Drift Engine</span>
                        <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">Stable</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Retraining</span>
                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10">Standby</span>
                      </div>
                      
                      <div className="pt-6">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Neural Load</span>
                          <span className="text-[10px] font-black text-cyan-500">85%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '85%' }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-full rounded-full shadow-[0_0_15px_rgba(0,186,255,0.4)]"
                          ></motion.div>
                        </div>
                        <div className="flex items-center gap-3 mt-6 text-slate-600">
                          <Cpu className="w-4 h-4" />
                          <p className="text-[10px] font-black uppercase tracking-widest">Kernel: v2.4.1-STABLE</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                    <Database className="w-5 h-5 text-cyan-500" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Raw Detections Database</h3>
                    <p className="text-xs font-bold text-white">PostGIS Live View</p>
                  </div>
                </div>
                <DataTable data={filteredData} />
              </div>
            </motion.div>
          )}

          {activeTab === 'edge' && (
            <motion.div
              key="edge"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <EdgeSimulation />
            </motion.div>
          )}

          {activeTab === 'mlops' && (
            <motion.div
              key="mlops"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <MLOpsPipeline />
            </motion.div>
          )}

          {activeTab === 'topology' && (
            <motion.div
              key="topology"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <PipelineTopology />
            </motion.div>
          )}
        </AnimatePresence>
        
        <footer className="mt-20 pt-10 border-t border-white/5 text-center">
          <div className="flex justify-center gap-8 mb-6">
            <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em]">Protocol 0.1</span>
            <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em]">Encryption Active</span>
            <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em]">Secure Link</span>
          </div>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">
            © 2026 RoadGuard X Systems • Neural Infrastructure Division
          </p>
        </footer>
      </main>
    </div>
  );
}
