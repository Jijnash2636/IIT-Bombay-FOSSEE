export interface EquipmentData {
  id: string;
  timestamp: string;
  equipment_id: string;
  flowrate: number;
  pressure: number;
  temperature: number;
  type: string; // e.g., "Pump", "Reactor", "Exchanger"
  status: 'Normal' | 'Warning' | 'Critical';
}

export interface DatasetSummary {
  id: string;
  fileName: string;
  uploadDate: string;
  totalCount: number;
  avgFlowrate: number;
  avgPressure: number;
  avgTemperature: number;
  outlierCount: number;
  typeDistribution: Record<string, number>;
  aiInsights?: string; // Analysis insights
  classification?: string;
  dataQualityScore?: number;
}

export interface User {
  username: string;
  isAuthenticated: boolean;
}

export enum AppView {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  HISTORY = 'HISTORY',
  REPORT = 'REPORT'
}
