import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Zap } from 'lucide-react';

export const XPToastContainer: React.FC = () => {
  const { xpToasts } = useAuth();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
      <AnimatePresence>
        {xpToasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="pointer-events-auto bg-white border border-gray-200/90 text-gray-900 px-4 py-3 rounded-2xl shadow-2xl shadow-indigo-900/10 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-lg font-bold text-white shadow-md shadow-indigo-600/30">
                {toast.icon || '⚡'}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 leading-tight">{toast.message}</p>
                <p className="text-xs text-gray-500 font-medium">Recompensa instantánea</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200 text-xs font-black whitespace-nowrap">
              <Zap className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600" />
              +{toast.amount} XP
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
