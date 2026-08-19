import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  TrendingUp,
  BarChart3,
  Factory,
  Target,
  DollarSign,
  Award,
  Users,
  Sparkles,
  Download,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ManagerDashboard: React.FC = () => {
  const { showXpToast } = useAuth();
  const [kpis, setKpis] = useState<any>(null);

  useEffect(() => {
    api.getExecutiveKpis().then((data) => setKpis(data));
  }, []);

  const handleExportReport = () => {
    showXpToast(20, 'Reporte Ejecutivo Descargado en Formato PDF/Excel', '📊');
  };

  return (
    <div className="space-y-4 pb-20 max-w-5xl mx-auto px-1 sm:px-2 pt-1">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-gray-200/80 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div>
          <span className="text-xs uppercase font-black tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
            Vista Gerencial y Resultados
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-heading mt-2">
            Dashboard Ejecutivo de Operaciones
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Consolidado de OEE, entregas a tiempo, costos y productividad global de planta
          </p>
        </div>

        <button
          onClick={handleExportReport}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/25 transition-transform flex items-center gap-1.5"
        >
          <Download className="w-4 h-4" />
          Exportar Informe Ejecutivo
        </button>
      </div>

      {/* 2. Top Executive KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* OEE Gauge */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>OEE Global</span>
            <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Factory className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <p className="text-3xl font-black text-gray-900 font-mono">87.4%</p>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">+2.8% vs mes previo</span>
          </div>
          <div className="text-[10px] text-gray-400 font-medium pt-2 border-t border-gray-100">
            Disp: 94% • Rend: 91% • Cal: 98.2%
          </div>
        </div>

        {/* On-Time Delivery */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Entregas On-Time (OTIF)</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <p className="text-3xl font-black text-emerald-600 font-mono">98.5%</p>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">Excelente cumplimiento</span>
          </div>
          <div className="text-[10px] text-gray-400 font-medium pt-2 border-t border-gray-100">
            Nike • Zara • Patagonia • H&M
          </div>
        </div>

        {/* First Pass Yield */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>First Pass Yield</span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <p className="text-3xl font-black text-gray-900 font-mono">97.8%</p>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full inline-block mt-1">Merma estándar &lt;2.2%</span>
          </div>
          <div className="text-[10px] text-gray-400 font-medium pt-2 border-t border-gray-100">
            42,800 unidades semanales
          </div>
        </div>

        {/* Cost / Unit */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Costo Unitario Promedio</span>
            <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <p className="text-3xl font-black text-gray-900 font-mono">$1.42 <span className="text-xs font-normal text-gray-400">USD</span></p>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">-4.1% ahorro eficiencia</span>
          </div>
          <div className="text-[10px] text-gray-400 font-medium pt-2 border-t border-gray-100">
            Optimizada con gamificación
          </div>
        </div>
      </div>

      {/* 3. Output by Client Brand */}
      <div className="bg-white border border-gray-200/80 rounded-3xl p-5 sm:p-6 shadow-sm">
        <h3 className="text-base font-black text-gray-900 font-heading mb-4">
          Volumen Producido y Eficiencia por Marca / Cliente
        </h3>

        <div className="space-y-3.5">
          {[
            { client: 'Nike Sportswear', po: 'PO-88403 (Hoodies Fleece)', units: '5,100 / 6,000 un', percent: 85, color: 'from-indigo-600 to-purple-600' },
            { client: 'Zara Woman', po: 'PO-90122 (Blusas Lino Premium)', units: '4,100 / 4,500 un', percent: 91, color: 'from-pink-500 to-rose-500' },
            { client: 'Patagonia Outdoor', po: 'PO-77410 (Chalecos Térmicos)', units: '3,200 / 3,500 un', percent: 91.4, color: 'from-emerald-500 to-teal-500' },
            { client: 'H&M Essentials', po: 'PO-65200 (Polos Básicos Cuello V)', units: '8,400 / 9,000 un', percent: 93.3, color: 'from-amber-400 to-orange-500' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
                <div>
                  <span className="font-black text-gray-900 text-sm">{item.client}</span>
                  <span className="text-xs text-gray-500 ml-2 font-medium">{item.po}</span>
                </div>
                <div className="text-xs font-mono font-black text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 self-start sm:self-auto">
                  {item.units} ({item.percent}%)
                </div>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden p-0.5">
                <div className={`h-full bg-gradient-to-r ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
