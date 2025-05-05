
import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/utils/animations';

const Settings = () => {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
        <p className="text-gray-600">Gerencie as configurações do sistema</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-gray-600">Esta página está em desenvolvimento. Em breve você poderá configurar o sistema aqui.</p>
      </div>
    </motion.div>
  );
};

export default Settings;
