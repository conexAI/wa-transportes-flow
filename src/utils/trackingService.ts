
import { TrackingDetail, TrackingStatus, Comment, DeliveryConfirmation } from '@/types/tracking';

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
    trackingLink: 'https://wat.app/track/35230987654321098765',
    comments: [
      {
        id: '1',
        authorName: 'Ana Silva',
        text: 'Cliente confirmou recebimento para amanhã às 10h',
        timestamp: '2023-05-09T14:30:00'
      },
      {
        id: '2',
        authorName: 'Carlos Oliveira',
        text: 'Motorista avisou que chegará com 1h de atraso',
        timestamp: '2023-05-10T09:15:00'
      }
    ]
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
    trackingLink: 'https://wat.app/track/35230987654321098766',
    comments: [],
    deliveryConfirmation: {
      photoUrl: 'https://placehold.co/600x400?text=Foto+de+Entrega',
      signatureUrl: 'https://placehold.co/400x200?text=Assinatura',
      confirmedBy: 'João Motorista',
      confirmedAt: '2023-05-08T16:20:00'
    }
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
    trackingLink: 'https://wat.app/track/35230987654321098767',
    comments: []
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
      
      // Update status if delivered
      if (stepId === 'delivered' && completed) {
        updatedTracking.status = 'Entregue';
      }
      
      trackingDetailsData[id] = updatedTracking;
      resolve(updatedTracking);
    }, 500);
  });
};

export const addComment = async (id: string, comment: Comment): Promise<TrackingDetail | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tracking = trackingDetailsData[id];
      if (!tracking) return resolve(null);
      
      const updatedTracking = {
        ...tracking,
        comments: tracking.comments ? [comment, ...tracking.comments] : [comment],
        lastUpdated: new Date().toISOString(),
      };
      
      trackingDetailsData[id] = updatedTracking;
      resolve(updatedTracking);
    }, 500);
  });
};

export const addDeliveryConfirmation = async (
  id: string, 
  confirmation: Partial<DeliveryConfirmation>,
  photos?: File[],
  signatureData?: string
): Promise<TrackingDetail | null> => {
  // In a real app, you would upload the photos and signature to a server here
  return new Promise((resolve) => {
    setTimeout(() => {
      const tracking = trackingDetailsData[id];
      if (!tracking) return resolve(null);
      
      // Mock URLs for photo and signature in this demo
      const photoUrl = photos && photos.length > 0 
        ? 'https://placehold.co/600x400?text=Uploaded+Photo' 
        : undefined;
      
      const signatureUrl = signatureData 
        ? signatureData // In a real app, we'd upload this and get a URL
        : undefined;
      
      const updatedTracking = {
        ...tracking,
        deliveryConfirmation: {
          ...confirmation,
          photoUrl: photoUrl || confirmation.photoUrl,
          signatureUrl: signatureUrl || confirmation.signatureUrl,
        },
        lastUpdated: new Date().toISOString(),
      };
      
      // Ensure delivered status
      if (!tracking.steps.find(s => s.id === 'delivered' && s.completed)) {
        const updatedSteps = tracking.steps.map(step => {
          if (step.id === 'delivered') {
            return {
              ...step,
              completed: true,
              active: true,
              timestamp: new Date().toISOString(),
              comments: [...(step.comments || []), 'Confirmação de entrega registrada no sistema']
            };
          } else if (step.active) {
            return { ...step, active: false };
          }
          return step;
        });
        
        updatedTracking.steps = updatedSteps;
        updatedTracking.status = 'Entregue';
      }
      
      trackingDetailsData[id] = updatedTracking;
      resolve(updatedTracking);
    }, 1000);
  });
};
