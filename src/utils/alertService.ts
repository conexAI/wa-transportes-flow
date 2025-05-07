
import { Alert } from '@/hooks/useAlerts';
import { v4 as uuidv4 } from 'uuid';

// Mock data for initial alerts
export const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "cte-delay",
    description: "NF-e 35220607887993000104550010000267801002267805 recebida há 25 minutos e CT-e ainda não foi emitido",
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 minutes ago
    recipients: ["equipe.emissao@watransportes.com", "WhatsApp: Grupo Emissão"],
    resolved: false,
    referenceId: "35220607887993000104550010000267801002267805",
    notificationsSent: {
      email: true,
      whatsapp: true
    }
  },
  {
    id: "2",
    type: "shipment-delay",
    description: "CT-e 35220608314808000173570000000012901011276781 emitido há 3h30min e carga não saiu do pátio",
    timestamp: new Date(Date.now() - 1000 * 60 * 210).toISOString(), // 3.5 hours ago
    recipients: ["gestor.logistica@watransportes.com", "WhatsApp: Paulo (Gerente)"],
    resolved: false,
    referenceId: "35220608314808000173570000000012901011276781",
    notificationsSent: {
      email: true,
      whatsapp: true
    }
  },
  {
    id: "3",
    type: "cte-delay",
    description: "NF-e 35220605090833000134550010002475201253436702 recebida há 18 minutos e CT-e ainda não foi emitido",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    recipients: ["equipe.emissao@watransportes.com", "WhatsApp: Grupo Emissão"],
    resolved: true,
    referenceId: "35220605090833000134550010002475201253436702",
    notificationsSent: {
      email: true,
      whatsapp: true
    }
  },
  {
    id: "4",
    type: "shipment-delay",
    description: "CT-e 35220603277816000100570010000270131000270131 emitido há 5h e carga não saiu do pátio",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    recipients: ["gestor.logistica@watransportes.com", "WhatsApp: Paulo (Gerente)"],
    resolved: true,
    referenceId: "35220603277816000100570010000270131000270131",
    notificationsSent: {
      email: true,
      whatsapp: true
    }
  },
  {
    id: "5",
    type: "cte-delay",
    description: "NF-e 35220607887993000104550010000267807002267811 recebida há 22 minutos e CT-e ainda não foi emitido",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 26 hours ago
    recipients: ["equipe.emissao@watransportes.com", "WhatsApp: Grupo Emissão"],
    resolved: true,
    referenceId: "35220607887993000104550010000267807002267811",
    notificationsSent: {
      email: true,
      whatsapp: true
    }
  }
];

// Mock pending documents to monitor
const pendingNFes = [
  {
    id: "35230405090833000134550010002475201253436711",
    receivedAt: new Date(Date.now() - 1000 * 60 * 14) // 14 minutes ago
  },
  {
    id: "35230405090833000134550010002475201253436712", 
    receivedAt: new Date(Date.now() - 1000 * 60 * 13) // 13 minutes ago
  }
];

const pendingShipments = [
  {
    cteId: "35230408314808000173570000000032901011276799",
    issuedAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    status: "issued"
  },
  {
    cteId: "35230408314808000173570000000032901011276800",
    issuedAt: new Date(Date.now() - 1000 * 60 * 170), // 2h 50m ago
    status: "issued"
  }
];

// Simulate alert generation based on rules
export const monitorConditions = (): Alert | null => {
  // This is a demo function that simulates monitoring
  // In a real app, this would check against actual data from the backend
  
  // Rule 1: Check for NF-e without CT-e for more than 15 minutes
  for (const nfe of pendingNFes) {
    const minutesSinceReceived = (Date.now() - nfe.receivedAt.getTime()) / (1000 * 60);
    
    if (minutesSinceReceived >= 15) {
      // Create alert for CT-e delay
      pendingNFes.splice(pendingNFes.indexOf(nfe), 1); // Remove from pending list
      
      return {
        id: uuidv4(),
        type: "cte-delay",
        description: `NF-e ${nfe.id} recebida há ${Math.floor(minutesSinceReceived)} minutos e CT-e ainda não foi emitido`,
        timestamp: new Date().toISOString(),
        recipients: ["equipe.emissao@watransportes.com", "WhatsApp: Grupo Emissão"],
        resolved: false,
        referenceId: nfe.id,
        notificationsSent: {
          email: true,
          whatsapp: true
        }
      };
    }
  }
  
  // Rule 2: Check for CT-e issued but shipment not departed for more than 3 hours
  for (const shipment of pendingShipments) {
    const hoursSinceIssued = (Date.now() - shipment.issuedAt.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceIssued >= 3 && shipment.status === "issued") {
      // Create alert for shipment delay
      pendingShipments.splice(pendingShipments.indexOf(shipment), 1); // Remove from pending list
      
      return {
        id: uuidv4(),
        type: "shipment-delay",
        description: `CT-e ${shipment.cteId} emitido há ${Math.floor(hoursSinceIssued)}h e carga não saiu do pátio`,
        timestamp: new Date().toISOString(),
        recipients: ["gestor.logistica@watransportes.com", "WhatsApp: Paulo (Gerente)"],
        resolved: false,
        referenceId: shipment.cteId,
        notificationsSent: {
          email: true,
          whatsapp: true
        }
      };
    }
  }
  
  // No alerts to generate at this moment
  return null;
};

// Mock function for sending alerts (would be implemented with actual API calls)
export const sendAlert = (alert: Alert) => {
  console.log(`Alert sent: ${alert.type} - ${alert.description}`);
  
  // In a real implementation, this would call WhatsApp API, email service, etc.
  // For demo purposes, we'll just return success
  return {
    success: true,
    channels: {
      email: alert.recipients.filter(r => r.includes('@')).length > 0,
      whatsapp: alert.recipients.filter(r => r.includes('WhatsApp')).length > 0
    }
  };
};
