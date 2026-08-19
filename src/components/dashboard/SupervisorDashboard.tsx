import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ProductionLine, ProductionOrder } from '../../shared/types';
import { useAuth } from '../../context/AuthContext';
import {
  Factory,
  Users,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Clock,
  Send,
  Zap,
  Target,
  Sparkles
} from 'lucide-react';

export const SupervisorDashboard: React.FC = () => {
  const { showXpToast, setActiveTab } = useAuth();
  const [lines, setLines] = useState<ProductionLine[]>([]);
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [selectedLine, setSelectedLine] = useState<ProductionLine | null>(null);

  useEffect(() => {
    api.getLines().then((data) => {
      setLines(data);
      if (data.length > 0) setSelectedLine(data[0]);
    });
    api.getOrders().then((data) => setOrders(data));
  }, []);

  const handleSendNudge = (lineName: string) => {
    showXpToast(25, `¡Mensaje de ánimo enviado a ${lineName}!`, '📢');
  };

  return (
    <div className="space-y-4 pb-20 max-w-5xl mx-auto px-1 sm:px-2 pt-1">
      {/* 1. Supervisor KPI Header Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200/80 rounded-3xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1.5 font-semibold">
            <span>Operarios Activos</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 font-mono">73 <span className="text-xs font-medium text-gray-400">/ 78</span></p>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
            93.5% Asistencia hoy
          </span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-3xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1.5 font-semibold">
            <span>Eficiencia Planta</span>
            <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-indigo-600 font-mono">91.4%</p>
          <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-full inline-block mt-1">
            +3.2% vs semana ant.
          </span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-3xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1.5 font-semibold">
            <span>Producción Total</span>
            <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Factory className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 font-mono">14,280 <span className="text-xs font-medium text-gray-400">un</span></p>
          <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-full inline-block mt-1">
            Meta turno: 15,000
          </span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-3xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1.5 font-semibold">
            <span>Tasa de Defectos</span>
            <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 font-mono">1.8%</p>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
            Dentro del umbral (&lt;2.5%)
          </span>
        </div>
      </div>

      {/* 2. Real-Time Lines Grid */}
      <div className="bg-white border border-gray-200/80 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-black text-gray-900 font-heading">Monitoreo en Tiempo Real de Líneas</h2>
            <p className="text-xs text-gray-500">Estado operativo y avance de órdenes por módulo</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> En Vivo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {lines.map((line) => {
            const isOptimal = line.efficiency >= 90;
            const isWarning = line.efficiency < 90 && line.efficiency >= 75;
            const isCritical = line.efficiency < 75;

            return (
              <div
                key={line.id}
                onClick={() => setSelectedLine(line)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedLine?.id === line.id
                    ? 'bg-indigo-50/50 border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                    : 'bg-gray-50/60 border-gray-200 hover:border-indigo-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-heading font-black text-sm text-gray-900">{line.code}</span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      isOptimal
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : isWarning
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {isOptimal ? '🟢 Óptimo' : isWarning ? '🟡 Precaución' : '🔴 Cuello Botella'}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-gray-800 truncate">{line.name}</h4>
                <p className="text-[11px] text-gray-500 mt-0.5 font-medium">Líder: {line.supervisorName}</p>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs font-mono mb-1 font-semibold">
                    <span className="text-gray-400 text-[11px]">Avance</span>
                    <span className="text-gray-900 font-bold">
                      {line.currentOutput} / {line.targetOutput} un ({Math.round((line.currentOutput / line.targetOutput) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOptimal
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                          : isWarning
                          ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                          : 'bg-gradient-to-r from-rose-500 to-red-500'
                      }`}
                      style={{ width: `${Math.min(100, (line.currentOutput / line.targetOutput) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Micro metrics */}
                <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-gray-200 text-center text-[10px]">
                  <div>
                    <span className="text-gray-400 font-medium block">Eficiencia</span>
                    <span className="font-black text-gray-900 font-mono text-xs">{line.efficiency}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium block">Personal</span>
                    <span className="font-bold text-gray-700 font-mono text-xs">{line.activeWorkers} op</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium block">Defectos</span>
                    <span className={`font-black font-mono text-xs ${line.defectRate > 2 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {line.defectRate}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Detailed Selected Line Action Box */}
      {selectedLine && (
        <div className="bg-white border border-gray-200/80 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-gray-900">{selectedLine.code} - {selectedLine.name}</h3>
              <span className="text-xs text-indigo-700 font-mono font-bold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                Orden: {selectedLine.activeOrderNumber}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Producto en confección: <strong className="text-gray-900">{selectedLine.productType}</strong> • {selectedLine.activeWorkers} operarios en módulo.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleSendNudge(selectedLine.name)}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Enviar Motivación (+25 XP)
            </button>
            <button
              onClick={() => setActiveTab('quality')}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-2xl border border-gray-200 transition-colors"
            >
              Inspeccionar Calidad
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
