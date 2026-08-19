import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { QualityInspection } from '../../shared/types';
import { useAuth } from '../../context/AuthContext';
import { Target, CheckCircle2, AlertOctagon, Plus, ShieldCheck, BarChart2 } from 'lucide-react';

const DEFECT_TYPES = [
  { id: 'costura', label: 'Costura abierta / saltada', emoji: '🧵' },
  { id: 'mancha', label: 'Mancha de aceite / suciedad', emoji: '💧' },
  { id: 'medida', label: 'Tolerancia de medida fuera', emoji: '📏' },
  { id: 'color', label: 'Variación de tono / tintura', emoji: '🎨' },
  { id: 'rotura', label: 'Piquete o tela dañada', emoji: '✂️' },
  { id: 'etiqueta', label: 'Etiqueta o marquilla torcida', emoji: '🏷️' }
];

export const QualityDashboard: React.FC = () => {
  const { user, showXpToast } = useAuth();
  const [inspections, setInspections] = useState<QualityInspection[]>([]);
  const [pareto, setPareto] = useState<{ defectType: string; count: number; percentage: number }[]>([]);
  const [sampleSize, setSampleSize] = useState(50);
  const [defectCounts, setDefectCounts] = useState<Record<string, number>>({
    costura: 0,
    mancha: 0,
    medida: 0,
    color: 0,
    rotura: 0,
    etiqueta: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const insp = await api.getQualityInspections();
    const par = await api.getDefectPareto();
    setInspections(insp);
    setPareto(par);
  };

  const totalDefects: number = Object.keys(defectCounts).reduce(
    (acc, key) => acc + (defectCounts[key] || 0),
    0
  );
  const passedUnits: number = Math.max(0, sampleSize - totalDefects);

  const handleIncrementDefect = (key: string) => {
    setDefectCounts((prev) => ({ ...prev, [key]: (Number(prev[key]) || 0) + 1 }));
  };

  const handleDecrementDefect = (key: string) => {
    setDefectCounts((prev) => ({ ...prev, [key]: Math.max(0, (Number(prev[key]) || 0) - 1) }));
  };

  const handleSaveInspection = async () => {
    const defectsArray = Object.entries(defectCounts)
      .filter(([_, count]) => Number(count) > 0)
      .map(([type, count]) => {
        const item = DEFECT_TYPES.find((d) => d.id === type);
        return { type, label: item?.label || type, count: Number(count) };
      });

    await api.logQualityInspection({
      orderNumber: 'ORD-2026-083',
      productName: 'Hoodie Fleece Minimal',
      lineCode: 'LINE-03',
      inspectorName: user?.name || 'Diego Morales',
      sampleSize,
      passedUnits,
      defectUnits: totalDefects,
      defects: defectsArray
    });

    showXpToast(30, 'Inspección de Calidad Guardada (+30 XP)', '🎯');
    setDefectCounts({ costura: 0, mancha: 0, medida: 0, color: 0, rotura: 0, etiqueta: 0 });
    loadData();
  };

  return (
    <div className="space-y-4 pb-20 max-w-5xl mx-auto px-1 sm:px-2 pt-1">
      {/* 1. Header Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200/80 rounded-3xl p-4 shadow-sm">
          <span className="text-xs text-gray-500 font-semibold block">Tasa de Aprobación</span>
          <p className="text-2xl font-black text-emerald-600 font-mono mt-1">98.2%</p>
          <span className="text-[10px] text-gray-400 font-medium">Muestras hoy: 850 prendas</span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-3xl p-4 shadow-sm">
          <span className="text-xs text-gray-500 font-semibold block">Lote más limpio</span>
          <p className="text-sm font-black text-gray-900 mt-1 truncate">Línea 01 (Polos Pima)</p>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
            99.1% First Pass Yield
          </span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-3xl p-4 shadow-sm">
          <span className="text-xs text-gray-500 font-semibold block">Defecto Frecuente</span>
          <p className="text-sm font-black text-rose-600 mt-1 truncate">Costura Abierta (42%)</p>
          <span className="text-[10px] text-gray-400 font-medium">Pareto principal</span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-3xl p-4 shadow-sm">
          <span className="text-xs text-gray-500 font-semibold block">Auditorías Hoy</span>
          <p className="text-2xl font-black text-indigo-600 font-mono mt-1">12 lotes</p>
          <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
            10 Aprobados / 2 Obs.
          </span>
        </div>
      </div>

      {/* 2. 1-Tap Defect Logger Panel */}
      <div className="bg-white border border-gray-200/80 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900 font-heading">Registro de Defectos 1-Tap</h3>
              <p className="text-xs text-gray-500">Inspección rápida por estación o lote en proceso</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-semibold">Muestra:</span>
            <select
              value={sampleSize}
              onChange={(e) => setSampleSize(Number(e.target.value))}
              className="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-1.5 text-xs font-mono font-bold"
            >
              <option value={20}>20 prendas</option>
              <option value={50}>50 prendas</option>
              <option value={100}>100 prendas</option>
            </select>
          </div>
        </div>

        {/* 6 Visual Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {DEFECT_TYPES.map((d) => {
            const count = defectCounts[d.id] || 0;
            return (
              <div
                key={d.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  count > 0
                    ? 'bg-rose-50 border-rose-300 shadow-sm'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{d.emoji}</span>
                  <div className="flex items-center gap-1.5">
                    {count > 0 && (
                      <button
                        onClick={() => handleDecrementDefect(d.id)}
                        className="w-7 h-7 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs flex items-center justify-center font-bold"
                      >
                        -
                      </button>
                    )}
                    <span className="w-6 text-center font-mono font-black text-gray-900 text-sm">
                      {count}
                    </span>
                    <button
                      onClick={() => handleIncrementDefect(d.id)}
                      className="w-7 h-7 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs flex items-center justify-center font-bold shadow-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="text-xs font-bold text-gray-800 truncate">{d.label}</p>
              </div>
            );
          })}
        </div>

        {/* Inspection Summary Bar & Save Button */}
        <div className="mt-5 pt-3.5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs font-mono font-bold">
            <span className="text-gray-500">
              Aprobadas: <strong className="text-emerald-600 font-black">{passedUnits}</strong>
            </span>
            <span className="text-gray-500">
              Defectos: <strong className={totalDefects > 0 ? 'text-rose-600 font-black' : 'text-gray-400'}>{totalDefects}</strong>
            </span>
            <span className="text-gray-500">
              Calidad: <strong className="text-indigo-600 font-black">{Math.round((passedUnits / sampleSize) * 100)}%</strong>
            </span>
          </div>

          <button
            onClick={handleSaveInspection}
            className="w-full sm:w-auto px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-rose-600/25 transition-all"
          >
            Guardar Inspección (+30 XP)
          </button>
        </div>
      </div>

      {/* 3. Pareto Analysis & Recent Inspections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pareto Chart */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-gray-900 font-heading">Distribución Pareto de Defectos</h3>
            <BarChart2 className="w-5 h-5 text-indigo-600" />
          </div>

          <div className="space-y-3">
            {pareto.map((p, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-700 font-bold">{p.defectType}</span>
                  <span className="text-gray-500 font-mono font-medium">{p.count} hallazgos ({p.percentage}%)</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-rose-500 rounded-full"
                    style={{ width: `${p.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Inspections Log */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-gray-900 font-heading">Últimas Auditorías Registradas</h3>
            <span className="text-xs text-gray-400 font-mono font-medium">Total {inspections.length}</span>
          </div>

          <div className="divide-y divide-gray-100 max-h-56 overflow-y-auto">
            {inspections.map((insp) => (
              <div key={insp.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-gray-900">{insp.orderNumber}</span>
                    <span className="text-[10px] text-gray-400 font-medium">({insp.lineCode})</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">{insp.productName} • {insp.inspectorName}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      insp.status === 'passed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {insp.status === 'passed' ? 'Aprobado' : 'Observado'}
                  </span>
                  <p className="text-[10px] text-gray-400 font-mono font-medium mt-0.5">
                    {insp.passedUnits}/{insp.sampleSize} ok
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
