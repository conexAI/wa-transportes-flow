
import React from 'react';
import NotificationCenter from './NotificationCenter';
import { useNotificationContext } from '@/contexts/NotificationContext';

const NotificationCenterTrigger: React.FC = () => {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    getUnreadCount 
  } = useNotificationContext();
  
  return (
    <NotificationCenter 
      notifications={notifications}
      onMarkAsRead={markAsRead}
      onMarkAllAsRead={markAllAsRead}
    />
  );
};

export default NotificationCenterTrigger;
