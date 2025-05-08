
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import NotificationCenterTrigger from './NotificationCenterTrigger';

const AppLayout = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen h-screen w-screen flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm py-3 px-4 flex items-center justify-between md:hidden z-10">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-2"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          <img 
            src="/logo.png" 
            alt="WA Transportes" 
            className="h-8" 
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/150x40?text=WA+Transportes';
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <NotificationCenterTrigger />
          <span className="text-sm font-medium">Olá, {user?.username}</span>
        </div>
      </header>

      {/* Sidebar for mobile and desktop */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 768) && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 z-50 md:relative md:z-0 ${
              isSidebarOpen ? 'block' : 'hidden md:block'
            }`}
          >
            <div 
              className="absolute inset-0 bg-black/50 md:hidden"
              onClick={toggleSidebar}
            />
            <Sidebar closeSidebar={() => setSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col overflow-hidden">
        <div className="hidden md:flex items-center justify-end p-2 border-b bg-white shadow-sm">
          <div className="flex items-center gap-2">
            <NotificationCenterTrigger />
            <span className="text-sm font-medium">Olá, {user?.username}</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 min-h-full"
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
