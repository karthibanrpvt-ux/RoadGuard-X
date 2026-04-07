import React from 'react';
import { motion } from 'motion/react';
import { 
  Cpu, 
  Video, 
  MapPin, 
  Database, 
  Cloud, 
  Layers, 
  Workflow, 
  Zap, 
  Activity, 
  Eye, 
  Github, 
  Radio, 
  ArrowRight,
  ShieldCheck,
  Terminal,
  Server
} from 'lucide-react';

const Node = ({ icon: Icon, title, subtitle, color = 'cyan' }: { icon: any, title: string, subtitle: string, color?: string }) => {
  const colorClass = color === 'cyan' ? 'border-cyan-500/30 shadow-[0_0_15px_rgba(0,186,255,0.2)] hover:shadow-[0_0_25px_rgba(0,186,255,0.4)] hover:border-cyan-500/60' : 
                     color === 'orange' ? 'border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] hover:border-orange-500/60' :
                     'border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:border-emerald-500/60';
  
  const iconColor = color === 'cyan' ? 'text-cyan-500' : color === 'orange' ? 'text-orange-500' : 'text-emerald-500';

  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -2 }}
      className={`p-4 bg-[#0a0c14]/80 backdrop-blur-md border rounded-xl transition-all duration-300 group ${colorClass}`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 bg-white/5 rounded-lg ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-0.5">{title}</h4>
          <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
};

const Connection = ({ color = 'emerald' }: { color?: 'emerald' | 'orange' }) => {
  const colorClass = color === 'emerald' ? 'text-emerald-500/50' : 'text-orange-500/50';
  return (
    <div className={`flex items-center justify-center px-2 ${colorClass}`}>
      <motion.div
        animate={{ x: [0, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowRight className="w-4 h-4" />
      </motion.div>
    </div>
  );
};

const ZoneHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
  <div className="flex items-center gap-3 mb-6 px-2">
    <Icon className="w-4 h-4 text-cyan-500/50" />
    <h3 className="text-[10px] font-black text-cyan-500/50 uppercase tracking-[0.4em]">{title}</h3>
  </div>
);

const PipelineTopology: React.FC = () => {
  return (
    <div className="space-y-12 pb-20">
      {/* Architecture Diagram */}
      <div className="cyber-card p-10 rounded-3xl overflow-x-auto">
        <div className="min-w-[1000px] flex justify-between items-start gap-4">
          
          {/* Zone 1: Edge Layer */}
          <div className="flex-1">
            <ZoneHeader title="Edge Layer" icon={Cpu} />
            <div className="space-y-4">
              <Node icon={Video} title="Dashcam Feed" subtitle="Raw MP4 Stream" />
              <div className="h-4 flex justify-center"><div className="w-px h-full bg-cyan-500/20" /></div>
              <Node icon={Cpu} title="Edge Inference" subtitle="YOLOv8 ONNX + Jetson" />
              <div className="h-4 flex justify-center"><div className="w-px h-full bg-cyan-500/20" /></div>
              <Node icon={MapPin} title="GPS Sync" subtitle="Neural Tagging" />
            </div>
          </div>

          <div className="pt-24"><Connection color="emerald" /></div>

          {/* Zone 2: Data Lake */}
          <div className="flex-1">
            <ZoneHeader title="Data Lake" icon={Database} />
            <div className="space-y-4">
              <Node icon={Cloud} title="S3 Storage" subtitle="Raw Video Lake" color="emerald" />
              <div className="h-4 flex justify-center"><div className="w-px h-full bg-emerald-500/20" /></div>
              <Node icon={Layers} title="DVC Store" subtitle="Feature Versioning" color="emerald" />
              <div className="h-4 flex justify-center"><div className="w-px h-full bg-emerald-500/20" /></div>
              <Node icon={Server} title="PostGIS DB" subtitle="Spatial Metadata" color="emerald" />
            </div>
          </div>

          <div className="pt-24"><Connection color="orange" /></div>

          {/* Zone 3: Continuous Training */}
          <div className="flex-1">
            <ZoneHeader title="Training" icon={Workflow} />
            <div className="space-y-4">
              <Node icon={Zap} title="Airflow" subtitle="DAG Orchestrator" color="orange" />
              <div className="h-4 flex justify-center"><div className="w-px h-full bg-orange-500/20" /></div>
              <Node icon={Activity} title="Fine-Tuning" subtitle="YOLOv8 PyTorch" color="orange" />
              <div className="h-4 flex justify-center"><div className="w-px h-full bg-orange-500/20" /></div>
              <Node icon={Database} title="MLflow" subtitle="Model Registry" color="orange" />
            </div>
          </div>

          <div className="pt-24"><Connection color="emerald" /></div>

          {/* Zone 4: Monitoring */}
          <div className="flex-1">
            <ZoneHeader title="Deployment" icon={ShieldCheck} />
            <div className="space-y-4">
              <Node icon={Eye} title="Evidently AI" subtitle="Drift Detection" />
              <div className="h-4 flex justify-center"><div className="w-px h-full bg-cyan-500/20" /></div>
              <Node icon={Github} title="CI/CD" subtitle="GitHub Actions" />
              <div className="h-4 flex justify-center"><div className="w-px h-full bg-cyan-500/20" /></div>
              <Node icon={Radio} title="OTA Deploy" subtitle="Edge Sync" />
            </div>
          </div>

        </div>
      </div>

      {/* System Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Edge Nodes', value: 'ONLINE (12 active)', icon: Cpu, status: 'text-emerald-500' },
          { label: 'MLflow Registry', value: 'v2.4.1 (STABLE)', icon: Database, status: 'text-cyan-500' },
          { label: 'Drift Monitor', value: 'NOMINAL (mAP 0.76)', icon: Activity, status: 'text-emerald-500' },
          { label: 'Last Retrain', value: '4 days ago', icon: Zap, status: 'text-orange-500' },
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="cyber-card p-6 rounded-2xl border border-white/5 flex items-center gap-4 group hover:bg-white/5 transition-all"
          >
            <div className={`p-3 bg-white/5 rounded-xl ${item.status}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">{item.label}</p>
              <p className="text-[10px] font-mono font-black text-white uppercase tracking-widest">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Terminal Style Status */}
      <div className="cyber-card p-8 rounded-3xl bg-black/40 border border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <Terminal className="w-4 h-4 text-cyan-500" />
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Topology Diagnostics</h3>
        </div>
        <div className="font-mono text-[10px] space-y-2 text-slate-400">
          <p className="flex gap-4"><span className="text-cyan-500/50">[04:50:30]</span> <span className="text-emerald-500">SUCCESS:</span> Edge Node connection established via encrypted tunnel.</p>
          <p className="flex gap-4"><span className="text-cyan-500/50">[04:50:31]</span> <span className="text-cyan-500">INFO:</span> S3 bucket 'roadguard-raw-video' sync complete.</p>
          <p className="flex gap-4"><span className="text-cyan-500/50">[04:50:32]</span> <span className="text-cyan-500">INFO:</span> MLflow model 'yolov8-road-damage' version 2.4.1 loaded.</p>
          <p className="flex gap-4"><span className="text-cyan-500/50">[04:50:33]</span> <span className="text-emerald-500">SUCCESS:</span> Drift monitor reporting nominal mAP levels.</p>
        </div>
      </div>
    </div>
  );
};

export default PipelineTopology;
