import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const CyberTerminal: React.FC = () => {
  const [lines, setLines] = useState<string[]>([]);
  const logs = [
    "[INFO] Initializing Neural Link...",
    "[OK] Connection established to Sector 07",
    "[WARN] Minor drift detected in Edge Node 01",
    "[INFO] Syncing geospatial matrix...",
    "[OK] YOLOv8 inference engine: ACTIVE",
    "[INFO] Monitoring road infrastructure...",
    "[DATA] Pothole detected at 11.0183, 76.9558",
    "[DATA] Confidence: 0.94",
    "[INFO] Updating global damage map...",
    "[OK] System integrity: 98.4%",
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setLines(prev => [...prev.slice(-5), logs[i]]);
      i = (i + 1) % logs.length;
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-[10px] text-cyan-500/60 space-y-1">
      {lines.map((line, idx) => (
        <motion.div
          key={idx + line}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-2"
        >
          <span className="text-cyan-500/30">[{new Date().toLocaleTimeString()}]</span>
          <span>{line}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default CyberTerminal;
