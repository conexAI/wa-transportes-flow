
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { mockAlerts, monitorConditions } from '@/utils/alertService';

export interface Alert {
  id: string;
  type: 'cte-delay' | 'shipment-delay' | string;
  description: string;
  timestamp: string;
  recipients: string[];
  resolved: boolean;
  referenceId?: string;
  notificationsSent?: {
    email?: boolean;
    whatsapp?: boolean;
    push?: boolean;
  };
}

export interface AlertStats {
  pending: number;
  resolved: number;
  today: number;
  total: number;
}

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [alertStats, setAlertStats] = useState<AlertStats>({
    pending: 0,
    resolved: 0,
    today: 0,
    total: 0
  });

  // Calculate stats whenever alerts change
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const stats = {
      pending: alerts.filter(a => !a.resolved).length,
      resolved: alerts.filter(a => a.resolved).length,
      today: alerts.filter(a => new Date(a.timestamp) >= today).length,
      total: alerts.length
    };
    
    setAlertStats(stats);
  }, [alerts]);

  // Simulate monitoring and alert generation
  useEffect(() => {
    const intervalId = setInterval(() => {
      const newAlert = monitorConditions();
      if (newAlert) {
        setAlerts(prev => [newAlert, ...prev]);
        
        // Show toast notification for new alert
        toast.warning(`Novo alerta: ${newAlert.description}`, {
          description: `Enviado para ${newAlert.recipients.join(', ')}`,
          duration: 5000,
        });
      }
    }, 30000); // Check every 30 seconds in this demo
    
    return () => clearInterval(intervalId);
  }, []);

  // Resolve an alert
  const resolveAlert = (id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, resolved: true } : alert
      )
    );
    
    toast.success('Alerta marcado como resolvido', {
      description: 'O status do alerta foi atualizado com sucesso.',
    });
  };

  // Get pending alerts count for UI badges
  const getPendingAlertsCount = () => {
    return alerts.filter(a => !a.resolved).length;
  };

  return {
    alerts,
    alertStats,
    resolveAlert,
    getPendingAlertsCount
  };
};
