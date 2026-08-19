import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { User } from '../../shared/types';
import { useAuth } from '../../context/AuthContext';
import { Users, CheckCircle2, Clock, Award, ShieldCheck, HeartHandshake, Search } from 'lucide-react';

export const HrDashboard: React.FC = () => {
  const { availableUsers, showXpToast, setActiveTab } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');

  const filtered = availableUsers.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = selectedRole === 'ALL' || u.role === selectedRole;
    return matchSearch && matchRole;
  });

  const handleBonusGrant = (userName: string) => {
    showXpToast(100, `Bono de +100 XP otorgado a ${userName}`, '🏆');
  };

  return (
    <div className="space-y-4 pb-20 max-w-5xl mx-auto px-1 sm:px-2 pt-1">
      {/* 1. HR Header KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200/80 rounded-3xl p-4 shadow-sm">
          <span className="text-xs text-gray-500 font-semibold block">Total Colaboradores</span>
          <p className="text-2xl font-black text-gray-900 font-mono mt-1">78 activos</p>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">100% Contratación Formal</span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-3xl p-4 shadow-sm">
          <span className="text-xs text-gray-500 font-semibold block">Puntualidad Hoy</span>
          <p className="text-2xl font-black text-emerald-600 font-mono mt-1">96.8%</p>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">73 en turno / 5 descansos</span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-3xl p-4 shadow-sm">
          <span className="text-xs text-gray-500 font-semibold block">Racha Promedio Planta</span>
          <p className="text-2xl font-black text-amber-600 font-mono mt-1">8.4 días 🔥</p>
          <span className="text-[10px] text-gray-400 font-medium">Compromiso en alza</span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-3xl p-4 shadow-sm">
          <span className="text-xs text-gray-500 font-semibold block">Kudos Enviados (Semana)</span>
          <p className="text-2xl font-black text-pink-600 font-mono mt-1">142</p>
          <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-full inline-block mt-0.5">+34% cultura positiva</span>
        </div>
      </div>

      {/* 2. Employee Directory */}
      <div className="bg-white border border-gray-200/80 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-black text-gray-900 font-heading">Directorio de Colaboradores y Desempeño</h3>
            <p className="text-xs text-gray-500">Control de asistencia, gamificación y entrega de incentivos</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            >
              <option value="ALL">Todos los roles</option>
              <option value="OPERATOR">Operarios</option>
              <option value="SUPERVISOR">Supervisores</option>
              <option value="QUALITY">Calidad</option>
              <option value="MAINTENANCE">Mantenimiento</option>
            </select>
          </div>
        </div>

        {/* Directory List */}
        <div className="divide-y divide-gray-100 mt-2">
          {filtered.map((emp) => (
            <div key={emp.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <img src={emp.avatarUrl} alt={emp.name} className="w-10 h-10 rounded-2xl object-cover ring-2 ring-gray-100" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">{emp.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {emp.role}
                    </span>
                  </div>
                  <p className="text-gray-500 text-[11px] mt-0.5">
                    {emp.rankTitle} • {emp.department} • 🔥 {emp.currentStreak} días racha
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:justify-end">
                <div className="text-right mr-2 hidden sm:block">
                  <span className="text-xs font-black text-indigo-600 font-mono">{emp.xp.toLocaleString()} XP</span>
                  <span className="text-[10px] text-gray-400 block font-medium">Nivel {emp.level}</span>
                </div>

                <button
                  onClick={() => handleBonusGrant(emp.name)}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-transform active:scale-95 flex items-center gap-1"
                >
                  Otorgar Bono (+100 XP) 🏆
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
