import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { RoadDamage, Severity } from '../types';
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
    <div className="h-[500px] w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm z-0">
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data.map((item) => (
          <CircleMarker
            key={item.id}
            center={[item.latitude, item.longitude]}
            radius={8}
            pathOptions={{
              fillColor: getSeverityColor(item.severity),
              color: '#fff',
              weight: 2,
              fillOpacity: 0.8,
            }}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-slate-900">{item.damage_class}</h3>
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
    </div>
  );
};

export default DamageMap;
