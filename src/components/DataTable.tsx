import React from 'react';
import { RoadDamage } from '../types';
import { motion } from 'motion/react';
import { Terminal, Hash } from 'lucide-react';

interface DataTableProps {
  data: RoadDamage[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="cyber-card rounded-2xl overflow-hidden"
    >
      <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <Terminal className="w-4 h-4 text-cyan-500" />
          </div>
          <div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Neural Logs</h3>
            <p className="text-xs font-bold text-white">Inference Stream Output</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
          <Hash className="w-3 h-3 text-cyan-500" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{data.length} Packets</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#0a0c14] text-slate-600 font-black uppercase tracking-widest text-[9px]">
            <tr>
              <th className="px-10 py-5">Timestamp</th>
              <th className="px-10 py-5">Classification</th>
              <th className="px-10 py-5">Priority</th>
              <th className="px-10 py-5">Confidence</th>
              <th className="px-10 py-5">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((item, idx) => (
              <motion.tr 
                key={item.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.01 }}
                className="hover:bg-cyan-500/[0.02] transition-all group"
              >
                <td className="px-10 py-5 text-slate-500 font-mono text-[10px]">
                  {new Date(item.timestamp).toISOString().replace('T', ' ').split('.')[0]}
                </td>
                <td className="px-10 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(0,186,255,0.5)]"></div>
                    <span className="font-bold text-slate-200 uppercase tracking-tight">{item.damage_class}</span>
                  </div>
                </td>
                <td className="px-10 py-5">
                  <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.2em] border ${
                    item.severity === 'High' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]' :
                    item.severity === 'Medium' ? 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20 shadow-[0_0_10px_rgba(0,186,255,0.1)]' :
                    'bg-slate-500/10 text-slate-400 border-white/10'
                  }`}>
                    {item.severity}
                  </span>
                </td>
                <td className="px-10 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-20 bg-white/5 rounded-full h-1 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.model_confidence * 100}%` }}
                        transition={{ duration: 1, delay: 0.2 + idx * 0.01 }}
                        className="bg-cyan-500 h-full rounded-full shadow-[0_0_10px_rgba(0,186,255,0.5)]"
                      />
                    </div>
                    <span className="font-black text-cyan-500/80 text-[10px] font-mono">
                      {(item.model_confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="px-10 py-5 text-slate-600 text-[10px] font-mono group-hover:text-cyan-400 transition-colors">
                  <div className="font-bold text-slate-300 mb-1">{item.location}</div>
                  {item.latitude.toFixed(6)}°N <span className="mx-1 text-white/10">|</span> {item.longitude.toFixed(6)}°E
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default DataTable;
