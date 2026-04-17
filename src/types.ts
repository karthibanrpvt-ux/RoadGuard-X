export type Severity = 'Low' | 'Medium' | 'High';
export type DamageClass = 'Pothole' | 'Longitudinal Crack' | 'Transverse Crack';

export interface RoadDamage {
  id: string;
  timestamp: string;
  location: string;
  latitude: number;
  longitude: number;
  damage_class: DamageClass;
  severity: Severity;
  model_confidence: number;
}

export interface DriftData {
  date: string;
  avgConfidence: number;
}
