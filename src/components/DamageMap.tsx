import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { RoadDamage, Severity } from '../types';
import { COIMBATORE_LOCATION } from '../mockData';
import 'leaflet/dist/leaflet.css';

interface DamageMapProps {
  data: RoadDamage[];
}

const getSeverityColor = (severity: Severity) => {
  switch (severity) {
    case 'High': return '#ef4444'; // red-500
    case 'Medium': return '#f97316'; // orange-500
    case 'Low': return '#eab308'; // yellow-500
    default: return '#64748b'; // slate-500
  }
};

const DamageMap: React.FC<DamageMapProps> = ({ data }) => {
  const center: [number, number] = [11.0168, 76.9558]; // Coimbatore center

  return (
    <div className="relative h-[500px] w-full rounded-3xl overflow-hidden border border-cyan-500/15 bg-[#08111d] shadow-[0_0_40px_rgba(0,0,0,0.35)] z-0">
      <MapContainer center={center} zoom={13} className="roadguard-map" style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {data.map((item) => (
          <CircleMarker
            key={item.id}
            center={[item.latitude, item.longitude]}
            radius={9}
            pathOptions={{
              fillColor: getSeverityColor(item.severity),
              color: '#fff',
              weight: 3,
              fillOpacity: 0.95,
            }}
          >
            <Popup>
              <div className="p-1 min-w-[200px]">
                <h3 className="font-bold text-slate-900 text-sm">{item.damage_class}</h3>
                <p className="text-xs text-slate-500 mb-1 font-medium">{item.location}</p>
                <p className="text-xs text-slate-500 mb-1">{new Date(item.timestamp).toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium text-white`} style={{ backgroundColor: getSeverityColor(item.severity) }}>
                    {item.severity}
                  </span>
                  <span className="text-xs font-mono text-slate-600">
                    Conf: {(item.model_confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      <div className="pointer-events-none absolute left-4 top-4 z-[1] rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 backdrop-blur-md shadow-lg">
        <div className="text-[9px] font-black uppercase tracking-[0.35em] text-cyan-400 mb-2">Damage Legend</div>
        <div className="space-y-1 text-[10px] font-medium text-slate-300">
          <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />Low severity</div>
          <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />Medium severity</div>
          <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />High severity</div>
        </div>
      </div>
      <div className="absolute right-4 bottom-4 z-[1] rounded-full bg-slate-950/75 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300 border border-cyan-500/20 backdrop-blur-md">
        {COIMBATORE_LOCATION}
      </div>
    </div>
  );
};

export default DamageMap;
