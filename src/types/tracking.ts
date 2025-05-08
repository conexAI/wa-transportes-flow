
export type TrackingStatus = 'nfe-received' | 'cte-issued' | 'loaded' | 'in-transit' | 'delivered';

export interface TrackingStep {
  id: TrackingStatus;
  name: string;
  timestamp: string | null;
  completed: boolean;
  active: boolean;
  comments?: string[];
}

export interface TrackingDetail {
  id: string;
  cteNumber: string;
  status: string;
  steps: TrackingStep[];
  createdAt: string;
  lastUpdated: string;
  accessCount: number;
  trackingLink: string;
}
