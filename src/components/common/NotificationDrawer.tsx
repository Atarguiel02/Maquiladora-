import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { AppNotification } from '../../shared/types';
import { Bell, CheckCheck, X, Zap, Trophy, Flame, TrendingUp, AlertTriangle } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { user, markNotificationsAsRead } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api
        .getNotifications(user?.id)
        .then((data) => setNotifications(data))
        .finally(() => setLoading(false));
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleMarkAll = async () => {
    await markNotificationsAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'badge':
        return <Trophy className="w-4 h-4 text-amber-500" />;
      case 'streak':
        return <Flame className="w-4 h-4 text-orange-500" />;
      case 'production':
        return <TrendingUp className="w-4 h-4 text-indigo-600" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'xp':
      default:
        return <Zap className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm bg-white border-l border-gray-200 h-full flex flex-col z-10 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                <Bell className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-gray-900 font-heading">Notificaciones</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkAll}
                title="Marcar todas como leídas"
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Leer todas</span>
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {loading ? (
              <div className="text-center py-8 text-gray-400 text-xs">Cargando alertas...</div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2 opacity-50" />
                <p className="text-xs text-gray-500 font-medium">No tienes notificaciones pendientes</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    n.isRead
                      ? 'bg-gray-50/60 border-gray-100 text-gray-400'
                      : 'bg-white border-indigo-100 text-gray-900 shadow-sm ring-1 ring-indigo-50/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5 border border-gray-100">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs font-bold truncate ${n.isRead ? 'text-gray-600' : 'text-gray-900'}`}>{n.title}</p>
                        <span className="text-[10px] text-gray-400 font-mono flex-shrink-0">{n.createdAt}</span>
                      </div>
                      <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">{n.message}</p>
                      {n.xpAmount && (
                        <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
                          <Zap className="w-3 h-3 fill-indigo-600" />
                          +{n.xpAmount} XP
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
