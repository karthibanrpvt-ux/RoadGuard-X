import { RoadDamage, Severity, DamageClass, DriftData } from './types';

export const COIMBATORE_LOCATION = 'Coimbatore, Tamil Nadu';

const COIMBATORE_BOUNDS = {
  latMin: 10.95,
  latMax: 11.05,
  lngMin: 76.90,
  lngMax: 77.05,
};

const COIMBATORE_AREAS = [
  'Gandhipuram',
  'RS Puram',
  'Peelamedu',
  'Singanallur',
  'Saibaba Colony',
  'Saravanampatti',
];

const DAMAGE_CLASSES: DamageClass[] = ['Pothole', 'Longitudinal Crack', 'Transverse Crack'];
const SEVERITIES: Severity[] = ['Low', 'Medium', 'High'];

export const generateMockData = (count: number): RoadDamage[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `dmg-${i}`,
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    location: `${COIMBATORE_LOCATION} - ${COIMBATORE_AREAS[i % COIMBATORE_AREAS.length]}`,
    latitude: COIMBATORE_BOUNDS.latMin + Math.random() * (COIMBATORE_BOUNDS.latMax - COIMBATORE_BOUNDS.latMin),
    longitude: COIMBATORE_BOUNDS.lngMin + Math.random() * (COIMBATORE_BOUNDS.lngMax - COIMBATORE_BOUNDS.lngMin),
    damage_class: DAMAGE_CLASSES[Math.floor(Math.random() * DAMAGE_CLASSES.length)],
    severity: SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)],
    model_confidence: 0.5 + Math.random() * 0.49,
  })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const generateDriftData = (): DriftData[] => {
  const data: DriftData[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      avgConfidence: 0.75 + (Math.random() - 0.5) * 0.1,
    });
  }
  return data;
};
