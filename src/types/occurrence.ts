
export type OccurrenceType = 'damage' | 'loss' | 'refused' | 'other';

export interface OccurrencePhoto {
  id: string;
  url: string;
  timestamp: string;
}

export interface Occurrence {
  id: string;
  cteNumber: string;
  type: OccurrenceType;
  comment?: string;
  photos: OccurrencePhoto[];
  createdAt: string;
  createdBy: string;
  status: 'pending' | 'resolved' | 'cancelled';
  notified: boolean;
}
