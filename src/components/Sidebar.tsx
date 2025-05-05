
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart2, Clipboard, Home, Settings, CheckSquare, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface SidebarProps {
  closeSidebar: () => void;
}

const Sidebar = ({ closeSidebar }: SidebarProps) => {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { name: 'Início', path: '/dashboard', icon: Home },
    { name: 'Histórico', path: '/dashboard/history', icon: BarChart2 },
    { 
      name: 'Checklist', 
      path: '/dashboard/checklist', 
      icon: CheckSquare,
      highlight: true 
    },
    { name: 'Configurações', path: '/dashboard/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ duration: 0.3 }}
      className="w-64 h-full bg-wa-default fixed left-0 top-0 shadow-lg flex flex-col z-50"
    >
      <div className="p-6 border-b border-blue-700 flex items-center justify-center">
        <img 
          src="/logo.png" 
          alt="WA Transportes" 
          className="h-8" 
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/150x40?text=WA+Transportes';
            e.currentTarget.style.filter = 'brightness(0) invert(1)';
          }}
        />
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => closeSidebar()}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md group transition-all",
                  isActive
                    ? "bg-blue-700 text-white"
                    : "text-blue-100 hover:bg-blue-700/30 hover:text-white",
                  item.highlight && !isActive && "bg-green-500/20 border-l-4 border-green-400"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 transition-colors",
                      isActive ? "text-white" : "text-blue-200 group-hover:text-white"
                    )}
                  />
                  <span>{item.name}</span>
                  {item.highlight && !isActive && (
                    <span className="ml-auto bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                      Novo
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-blue-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2 text-sm font-medium text-blue-100 rounded-md hover:bg-blue-700 hover:text-white transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span>Sair</span>
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
