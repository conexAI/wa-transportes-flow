
import { TrackingDetail } from '@/types/tracking';

// Mock data for tracking details
const trackingDetailsData: Record<string, TrackingDetail> = {
  '1': {
    id: '1',
    cteNumber: 'CT-e 35230987654321098765',
    status: 'Em trânsito',
    steps: [
      {
        id: 'nfe-received',
        name: 'NF-e Recebida',
        timestamp: '2023-05-08T09:30:00',
        completed: true,
        active: false,
        comments: ['Recebido por Carlos - Central']
      },
      {
        id: 'cte-issued',
        name: 'CT-e Emitido',
        timestamp: '2023-05-09T11:15:00',
        completed: true,
        active: false,
        comments: ['Emitido automaticamente pelo sistema']
      },
      {
        id: 'loaded',
        name: 'Carga Carregada',
        timestamp: '2023-05-10T08:45:00',
        completed: true,
        active: false,
        comments: ['Carregado por Marcos - Pátio Sul']
      },
      {
        id: 'in-transit',
        name: 'Em Trânsito',
        timestamp: '2023-05-10T10:20:00',
        completed: true,
        active: true,
        comments: ['Motorista João - Veículo PLQ-8723', 'ETA: 12/05 às 14:00']
      },
      {
        id: 'delivered',
        name: 'Entregue',
        timestamp: null,
        completed: false,
        active: false
      }
    ],
    createdAt: '2023-05-08T09:30:00',
    lastUpdated: '2023-05-10T10:20:00',
    accessCount: 12,
    trackingLink: 'https://wat.app/track/35230987654321098765'
  },
  '2': {
    id: '2',
    cteNumber: 'CT-e 35230987654321098766',
    status: 'Entregue',
    steps: [
      {
        id: 'nfe-received',
        name: 'NF-e Recebida',
        timestamp: '2023-05-06T10:15:00',
        completed: true,
        active: false
      },
      {
        id: 'cte-issued',
        name: 'CT-e Emitido',
        timestamp: '2023-05-06T14:30:00',
        completed: true,
        active: false
      },
      {
        id: 'loaded',
        name: 'Carga Carregada',
        timestamp: '2023-05-07T07:15:00',
        completed: true,
        active: false
      },
      {
        id: 'in-transit',
        name: 'Em Trânsito',
        timestamp: '2023-05-07T09:45:00',
        completed: true,
        active: false
      },
      {
        id: 'delivered',
        name: 'Entregue',
        timestamp: '2023-05-08T16:20:00',
        completed: true,
        active: true,
        comments: ['Recebido por Maria - Financeiro', 'Assinado eletronicamente']
      }
    ],
    createdAt: '2023-05-06T10:15:00',
    lastUpdated: '2023-05-08T16:20:00',
    accessCount: 8,
    trackingLink: 'https://wat.app/track/35230987654321098766'
  },
  '3': {
    id: '3',
    cteNumber: 'CT-e 35230987654321098767',
    status: 'Aguardando coleta',
    steps: [
      {
        id: 'nfe-received',
        name: 'NF-e Recebida',
        timestamp: '2023-05-11T09:00:00',
        completed: true,
        active: false,
        comments: ['Recebido por Ana - Central']
      },
      {
        id: 'cte-issued',
        name: 'CT-e Emitido',
        timestamp: '2023-05-11T10:30:00',
        completed: true,
        active: true,
        comments: ['Aguardando coleta programada para 12/05']
      },
      {
        id: 'loaded',
        name: 'Carga Carregada',
        timestamp: null,
        completed: false,
        active: false
      },
      {
        id: 'in-transit',
        name: 'Em Trânsito',
        timestamp: null,
        completed: false,
        active: false
      },
      {
        id: 'delivered',
        name: 'Entregue',
        timestamp: null,
        completed: false,
        active: false
      }
    ],
    createdAt: '2023-05-11T09:00:00',
    lastUpdated: '2023-05-11T10:30:00',
    accessCount: 3,
    trackingLink: 'https://wat.app/track/35230987654321098767'
  }
};

export const getTrackingDetails = async (id: string): Promise<TrackingDetail | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(trackingDetailsData[id] || null);
    }, 500);
  });
};

export const updateTrackingStep = async (
  id: string, 
  stepId: string, 
  completed: boolean,
  active: boolean,
  comment?: string
): Promise<TrackingDetail | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tracking = trackingDetailsData[id];
      if (!tracking) return resolve(null);
      
      const updatedSteps = tracking.steps.map(step => {
        if (step.id === stepId) {
          return {
            ...step,
            completed,
            active,
            timestamp: completed || active ? new Date().toISOString() : step.timestamp,
            comments: comment ? [...(step.comments || []), comment] : step.comments
          };
        } else if (active && step.active) {
          // Make sure only one step is active
          return { ...step, active: false };
        }
        return step;
      });
      
      const updatedTracking = {
        ...tracking,
        steps: updatedSteps,
        lastUpdated: new Date().toISOString(),
      };
      
      trackingDetailsData[id] = updatedTracking;
      resolve(updatedTracking);
    }, 500);
  });
};
