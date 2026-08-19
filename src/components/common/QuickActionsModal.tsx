import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import {
  Zap,
  TrendingUp,
  CheckCircle2,
  QrCode,
  Target,
  HeartHandshake,
  Sparkles,
  Package,
  Wrench,
  X
} from 'lucide-react';

interface QuickActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenScanner: () => void;
  onOpenAi: () => void;
}

export const QuickActionsModal: React.FC<QuickActionsModalProps> = ({
  isOpen,
  onClose,
  onOpenScanner,
  onOpenAi
}) => {
  const { user, quickLogProduction, performCheckIn, todayAttendance, setActiveTab } = useAuth();
  const [customUnits, setCustomUnits] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  if (!isOpen || !user) return null;

  const handleQuickAdd = (amount: number) => {
    quickLogProduction(amount);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customUnits, 10);
    if (val > 0) {
      quickLogProduction(val);
      setCustomUnits('');
      setShowCustomInput(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white border border-gray-200/80 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl z-10 max-h-[85vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/30">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900 font-heading">Acciones Ultrarrápidas</h3>
                <p className="text-xs text-gray-500">Completa tareas frecuentes en menos de 3 segundos</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 1-Tap Production Section */}
          <div className="mt-4 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-black uppercase tracking-wider text-indigo-900">
                  + Registrar Producción al Instante
                </span>
              </div>
              <span className="text-[11px] text-indigo-700 font-mono font-bold bg-white px-2 py-0.5 rounded-full border border-indigo-200">+1 XP x 5u</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[25, 50, 100, 200].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleQuickAdd(amt)}
                  className="py-2.5 px-2 rounded-xl bg-white hover:bg-indigo-600 border border-indigo-200 hover:border-indigo-600 text-indigo-950 hover:text-white font-black text-sm shadow-sm hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center group"
                >
                  <span className="group-hover:text-white">+{amt}</span>
                  <span className="text-[10px] text-indigo-600 group-hover:text-indigo-100 font-medium">unidades</span>
                </button>
              ))}
            </div>

            {showCustomInput ? (
              <form onSubmit={handleCustomSubmit} className="mt-3 flex gap-2">
                <input
                  type="number"
                  placeholder="Cantidad exacta..."
                  value={customUnits}
                  onChange={(e) => setCustomUnits(e.target.value)}
                  className="flex-1 bg-white border border-indigo-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  Registrar
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowCustomInput(true)}
                className="w-full mt-2.5 py-1 text-center text-xs text-indigo-700 hover:text-indigo-900 font-bold"
              >
                ¿Otra cantidad? Escribir número personalizado ✏️
              </button>
            )}
          </div>

          {/* Quick Grid of Core Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4">
            {/* Check in / Attendance */}
            <button
              onClick={() => {
                if (!todayAttendance) performCheckIn();
                else setActiveTab('attendance');
                onClose();
              }}
              className="p-3.5 rounded-2xl bg-gray-50/80 hover:bg-white border border-gray-200 hover:border-indigo-300 text-left transition-all hover:scale-[1.02] flex flex-col justify-between shadow-xs group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 border border-emerald-100">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 group-hover:text-indigo-600">
                  {todayAttendance ? 'Ver Mi Jornada' : 'Marcar Entrada'}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  {todayAttendance ? 'Jornada activa' : '+20 XP y Racha'}
                </p>
              </div>
            </button>

            {/* QR Scanner */}
            <button
              onClick={() => {
                onClose();
                onOpenScanner();
              }}
              className="p-3.5 rounded-2xl bg-gray-50/80 hover:bg-white border border-gray-200 hover:border-indigo-300 text-left transition-all hover:scale-[1.02] flex flex-col justify-between shadow-xs group"
            >
              <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-2 border border-cyan-100">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 group-hover:text-indigo-600">Escanear QR</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Máquina, lote o tela</p>
              </div>
            </button>

            {/* MaquiBot AI */}
            <button
              onClick={() => {
                onClose();
                onOpenAi();
              }}
              className="p-3.5 rounded-2xl bg-gray-50/80 hover:bg-white border border-gray-200 hover:border-indigo-300 text-left transition-all hover:scale-[1.02] flex flex-col justify-between shadow-xs group"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2 border border-purple-100">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 group-hover:text-indigo-600">MaquiBot AI</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Consultar planta</p>
              </div>
            </button>

            {/* Quality Defect Log */}
            <button
              onClick={() => {
                setActiveTab('quality');
                onClose();
              }}
              className="p-3.5 rounded-2xl bg-gray-50/80 hover:bg-white border border-gray-200 hover:border-indigo-300 text-left transition-all hover:scale-[1.02] flex flex-col justify-between shadow-xs group"
            >
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2 border border-rose-100">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 group-hover:text-indigo-600">Reportar Defecto</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Control de calidad</p>
              </div>
            </button>

            {/* Give Kudos */}
            <button
              onClick={() => {
                setActiveTab('social');
                onClose();
              }}
              className="p-3.5 rounded-2xl bg-gray-50/80 hover:bg-white border border-gray-200 hover:border-indigo-300 text-left transition-all hover:scale-[1.02] flex flex-col justify-between shadow-xs group"
            >
              <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-2 border border-pink-100">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 group-hover:text-indigo-600">Dar Kudos</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Reconocer compañero</p>
              </div>
            </button>

            {/* Inventory Quick Lookup */}
            <button
              onClick={() => {
                setActiveTab('inventory');
                onClose();
              }}
              className="p-3.5 rounded-2xl bg-gray-50/80 hover:bg-white border border-gray-200 hover:border-indigo-300 text-left transition-all hover:scale-[1.02] flex flex-col justify-between shadow-xs group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 border border-amber-100">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 group-hover:text-indigo-600">Ver Inventario</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Consultar stock</p>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
