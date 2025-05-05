
import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/utils/animations';

const History = () => {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Histórico</h1>
        <p className="text-gray-600">Visualize o histórico de operações</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-gray-600">Esta página está em desenvolvimento. Em breve você poderá ver todo o histórico de operações aqui.</p>
      </div>
    </motion.div>
  );
};

export default History;
