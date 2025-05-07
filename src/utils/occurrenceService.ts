
import { v4 as uuidv4 } from 'uuid';
import { Occurrence, OccurrenceType } from '@/types/occurrence';
import { toast } from 'sonner';

// Simulated database
let occurrences: Occurrence[] = [
  {
    id: '1',
    cteNumber: '35220607887993000104550010000267801002267805',
    type: 'damage',
    comment: 'Embalagem danificada durante o transporte',
    photos: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1605493825663-9e50351c9d36?q=80&w=1000&auto=format&fit=crop',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    createdBy: 'João Motorista',
    status: 'pending',
    notified: true,
  },
  {
    id: '2',
    cteNumber: '35220608314808000173570000000012901011276781',
    type: 'refused',
    comment: 'Cliente recusou a entrega por atraso',
    photos: [
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=1000&auto=format&fit=crop',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    createdBy: 'Maria Operadora',
    status: 'resolved',
    notified: true,
  },
];

// Valid CTE numbers for validation
const validCteNumbers = [
  '35220607887993000104550010000267801002267805',
  '35220608314808000173570000000012901011276781',
  '35220605090833000134550010002475201253436702',
  '35220603277816000100570010000270131000270131',
  '35220607887993000104550010000267807002267811',
];

export const getOccurrences = async (): Promise<Occurrence[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...occurrences];
};

export const getOccurrenceById = async (id: string): Promise<Occurrence | undefined> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return occurrences.find((occurrence) => occurrence.id === id);
};

export const getOccurrencesByCte = async (cteNumber: string): Promise<Occurrence[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return occurrences.filter((occurrence) => occurrence.cteNumber === cteNumber);
};

export const validateCteNumber = async (cteNumber: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return validCteNumbers.includes(cteNumber);
};

export const createOccurrence = async (
  cteNumber: string,
  type: OccurrenceType,
  comment: string,
  photos: File[]
): Promise<Occurrence> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Validate CTE
  const isValidCte = await validateCteNumber(cteNumber);
  if (!isValidCte) {
    throw new Error('Número de CT-e inválido');
  }

  // Simulate photo upload
  const uploadedPhotos = await Promise.all(
    photos.map(async (file) => {
      // In a real app, this would upload to a storage service
      // For this demo, we'll create a fake URL using object URLs
      const fakeUrl = URL.createObjectURL(file);
      
      return {
        id: uuidv4(),
        url: fakeUrl,
        timestamp: new Date().toISOString(),
      };
    })
  );

  const newOccurrence: Occurrence = {
    id: uuidv4(),
    cteNumber,
    type,
    comment,
    photos: uploadedPhotos,
    createdAt: new Date().toISOString(),
    createdBy: 'Usuário Atual', // In a real app, get from auth context
    status: 'pending',
    notified: false,
  };

  // Add to "database"
  occurrences = [newOccurrence, ...occurrences];

  // Send notification (mock)
  sendOccurrenceNotification(newOccurrence);

  return newOccurrence;
};

export const resolveOccurrence = async (id: string): Promise<Occurrence> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const index = occurrences.findIndex((o) => o.id === id);
  if (index === -1) throw new Error('Ocorrência não encontrada');

  const updatedOccurrence = {
    ...occurrences[index],
    status: 'resolved' as const,
  };

  occurrences = [
    ...occurrences.slice(0, index),
    updatedOccurrence,
    ...occurrences.slice(index + 1),
  ];

  return updatedOccurrence;
};

// Mock function to simulate sending notifications
const sendOccurrenceNotification = (occurrence: Occurrence): void => {
  console.log(`[NOTIFICATION] New occurrence reported for CT-e ${occurrence.cteNumber}: ${occurrence.type}`);
  
  // In a real app, this would send emails, push notifications, etc.
  // Mark as notified in our mock database
  const index = occurrences.findIndex((o) => o.id === occurrence.id);
  if (index !== -1) {
    occurrences[index].notified = true;
  }
  
  // Show toast notification
  toast.info(`Nova ocorrência registrada`, {
    description: `CT-e: ${occurrence.cteNumber}`,
    duration: 5000,
  });
};
