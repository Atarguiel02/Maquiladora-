import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { ProductionRecord, Challenge } from '../../shared/types';
import {
  Flame,
  Zap,
  TrendingUp,
  Clock,
  Award,
  Users,
  Target,
  Plus,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

interface OperatorDashboardProps {
  onOpenQuickAction: () => void;
  onOpenScanner: () => void;
}

export const OperatorDashboard: React.FC<OperatorDashboardProps> = ({
  onOpenQuickAction,
  onOpenScanner
}) => {
  const {
    user,
    todayAttendance,
    todayProduction,
    dailyGoal,
    performCheckIn,
    performCheckOut,
    quickLogProduction,
    setActiveTab
  } = useAuth();

  const [records, setRecords] = useState<ProductionRecord[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [shiftSeconds, setShiftSeconds] = useState(28934); // ~8 hours 2 min

  useEffect(() => {
    if (user) {
      api.getRecentRecords(user.id).then((data) => setRecords(data));
      api.getChallenges().then((data) => setChallenges(data));
    }
  }, [user, todayProduction]);

  // Live shift timer
  useEffect(() => {
    const timer = setInterval(() => {
      setShiftSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatShiftTime = (sec: number) => {
    const hrs = Math.floor(sec / 3600).toString().padStart(2, '0');
    const mins = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const secs = (sec % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  if (!user) return null;

  const progressPercent = Math.min(100, Math.round((todayProduction / dailyGoal) * 100));
  const remaining = Math.max(0, dailyGoal - todayProduction);

  return (
    <div className="space-y-4 pb-20 max-w-4xl mx-auto px-1 sm:px-2 pt-1">
      {/* 1. Header Hero Greeting */}
      <div className="flex items-center justify-between bg-white border border-gray-200/80 rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 font-heading tracking-tight">
              Hola, {user.name.split(' ')[0]} 👋
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
              Turno Activo
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Línea 03 • Confección • Turno 08:00 → 17:00
          </p>
        </div>

        {/* Level badge */}
        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => setActiveTab('gamification')}
            className="text-right group focus:outline-none"
          >
            <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-black">
              Nivel {user.level}
            </span>
            <span className="text-sm sm:text-base font-black text-indigo-600 group-hover:text-indigo-700 font-mono">
              {user.xp.toLocaleString()} XP
            </span>
          </button>
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 p-0.5 border-2 border-white shadow-md">
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-[14px] object-cover" />
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 w-48 h-48 bg-indigo-50 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Shift / Check-In Status Card */}
      <div className="bg-white border border-gray-200/80 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
                Jornada en Curso
              </span>
            </div>
            <p className="text-2xl font-black font-mono text-gray-900 tracking-wide mt-0.5">
              {formatShiftTime(shiftSeconds)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {!todayAttendance ? (
            <button
              onClick={performCheckIn}
              className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Registrar Entrada (+20 XP)
            </button>
          ) : (
            <button
              onClick={performCheckOut}
              className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs border border-gray-200 transition-colors"
            >
              Terminar Jornada
            </button>
          )}

          <button
            onClick={onOpenScanner}
            className="p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 transition-colors"
            title="Escanear Gafete / Estación"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Main Production Target (High Impact Vibrant Hero Card) */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs uppercase font-black tracking-widest text-indigo-200 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-indigo-200" /> Tu meta de hoy
            </span>
            <p className="text-3xl sm:text-4xl font-black font-heading mt-1">
              {todayProduction.toLocaleString()} <span className="text-indigo-200 text-xl font-normal">/ {dailyGoal.toLocaleString()} un</span>
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl sm:text-4xl font-black text-yellow-300 font-mono">
              {progressPercent}%
            </span>
            <p className="text-xs text-emerald-300 font-bold flex items-center justify-end gap-1 mt-1">
              <Flame className="w-4 h-4 fill-emerald-300" /> +12% vs ayer
            </p>
          </div>
        </div>

        {/* High-contrast progress bar */}
        <div className="w-full h-4 bg-indigo-950/40 rounded-full overflow-hidden p-0.5 border border-white/20">
          <div
            className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-emerald-400 transition-all duration-500 shadow-md"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Milestone info */}
        <div className="flex items-center justify-between text-xs mt-3.5 pt-3.5 border-t border-white/15 text-indigo-100 font-medium">
          <span>🎯 Próximo objetivo: <strong className="text-white font-bold">+{remaining} unidades</strong> para meta</span>
          <span className="bg-yellow-400 text-yellow-950 px-2 py-0.5 rounded-full font-black text-[10px] shadow-xs">
            +100 XP BONO
          </span>
        </div>

        {/* 1-Tap Quick Action Buttons */}
        <div className="mt-5 pt-3 border-t border-white/10">
          <p className="text-[11px] font-black uppercase tracking-widest text-indigo-200 mb-2.5">
            Registro rápido de piezas:
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[25, 50, 100, 200].map((amt) => (
              <button
                key={amt}
                onClick={() => quickLogProduction(amt)}
                className="py-3 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 border border-white/20 text-white font-black text-xs sm:text-sm transition-all flex flex-col items-center justify-center shadow-sm"
              >
                <span>+{amt}</span>
                <span className="text-[9px] text-indigo-200 font-semibold uppercase">piezas</span>
              </button>
            ))}
          </div>

          <button
            onClick={onOpenQuickAction}
            className="w-full mt-3 py-3 rounded-2xl bg-white text-indigo-700 hover:bg-indigo-50 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            + Registrar otra cantidad o escanear orden
          </button>
        </div>
      </div>

      {/* 4. Team & Standings Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Team Standing */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-black tracking-widest text-gray-400 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-600" /> Tu Equipo
              </span>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                #2 de 4
              </span>
            </div>
            <h4 className="text-base font-bold text-gray-900">Streetwear Squad (Línea 03)</h4>
            <p className="text-xs text-gray-500 mt-1">
              Líder: <span className="text-gray-800 font-semibold">Sofía Mendoza</span> • 16 integrantes
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-100 text-center">
            <div className="bg-gray-50 p-2.5 rounded-2xl border border-gray-100">
              <span className="text-[10px] text-gray-400 font-medium block">Eficiencia</span>
              <span className="text-sm font-bold text-emerald-600">92%</span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-2xl border border-gray-100">
              <span className="text-[10px] text-gray-400 font-medium block">Calidad</span>
              <span className="text-sm font-bold text-indigo-600">97.2%</span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-2xl border border-gray-100">
              <span className="text-[10px] text-gray-400 font-medium block">Asistencia</span>
              <span className="text-sm font-bold text-purple-600">98%</span>
            </div>
          </div>
        </div>

        {/* Active Challenge Preview */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-black tracking-widest text-gray-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" /> Reto Semanal
              </span>
              <span className="text-xs font-black text-yellow-950 bg-yellow-400 px-2.5 py-0.5 rounded-full shadow-xs">
                +500 XP
              </span>
            </div>
            <h4 className="text-base font-bold text-gray-900">100% Zero Defectos</h4>
            <p className="text-xs text-gray-500 mt-1">
              Mantener tasa de defectos debajo de 1.5% en la orden de Hoodies.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-gray-500">Progreso del reto</span>
              <span className="text-amber-600">82%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden p-0.5">
              <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" style={{ width: '82%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Hourly Production History */}
      <div className="bg-white border border-gray-200/80 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-gray-900 font-heading">Tus últimos registros de hoy</h3>
          <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2.5 py-1 rounded-full">Turno Matutino</span>
        </div>

        <div className="divide-y divide-gray-100">
          {records.slice(0, 5).map((r) => (
            <div key={r.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-mono text-[11px] font-bold border border-indigo-100">
                  {r.hourSlot}
                </div>
                <div>
                  <span className="text-gray-900 font-bold">+{r.units} prendas</span>
                  <span className="text-gray-400 text-[10px] ml-1.5">({r.lineCode})</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl text-[11px] border border-indigo-100">
                <Zap className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600" />
                +{r.xpEarned} XP
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
