
import { useState, useEffect } from 'react';
import { Notification } from '@/components/NotificationCenter';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

// Initial mock notifications
const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'CT-e #35887 aguardando ação',
    description: 'NF-e recebida há mais de 2 horas sem emissão de CT-e',
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    read: false,
    link: '/dashboard/tracking/1',
    type: 'warning'
  },
  {
    id: '2',
    title: 'Nova ocorrência registrada',
    description: 'Ocorrência de atraso no CT-e #45612',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    read: false,
    link: '/dashboard/occurrences/1',
    type: 'alert'
  },
  {
    id: '3',
    title: 'Entrega confirmada',
    description: 'CT-e #35897 entregue com sucesso',
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    read: true,
    link: '/dashboard/tracking/2', 
    type: 'success'
  }
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  
  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  // Add a new notification
  const addNotification = (
    title: string, 
    description: string, 
    type: Notification['type'] = 'info',
    link?: string
  ) => {
    const newNotification: Notification = {
      id: uuidv4(),
      title,
      description,
      timestamp: new Date().toISOString(),
      read: false,
      link,
      type
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Also show a toast for the new notification
    toast(title, {
      description: description,
      action: {
        label: "Ver",
        onClick: () => {
          markAsRead(newNotification.id);
          if (link) {
            window.location.href = link;
          }
        }
      }
    });
    
    return newNotification;
  };
  
  // Simulate new notifications coming in periodically (for demo purposes)
  useEffect(() => {
    const events = [
      {
        title: 'CT-e #42355 emitido',
        description: 'O CT-e foi emitido com sucesso',
        type: 'success' as const,
        link: '/dashboard/tracking/3'
      },
      {
        title: 'Checklist pendente',
        description: 'Veículo PLQ-3540 sem checklist de saída',
        type: 'warning' as const,
        link: '/dashboard/checklist'
      },
      {
        title: 'Alerta de atraso',
        description: 'CT-e #38976 com atraso previsto de 1h30',
        type: 'alert' as const,
        link: '/dashboard/tracking/1'
      }
    ];
    
    const interval = setInterval(() => {
      // 20% chance of triggering a notification every 30 seconds
      if (Math.random() < 0.2) {
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        addNotification(
          randomEvent.title,
          randomEvent.description,
          randomEvent.type,
          randomEvent.link
        );
      }
    }, 30000); // every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Get unread count for UI badges
  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };
  
  return {
    notifications,
    markAsRead,
    markAllAsRead,
    addNotification,
    getUnreadCount
  };
};
