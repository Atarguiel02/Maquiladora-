import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  User as UserIcon,
  Flame,
  Zap,
  Award,
  ShieldCheck,
  Moon,
  Sun,
  Smartphone,
  Database,
  Bell,
  LogOut,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, todayAttendance, showXpToast } = useAuth();
  const { theme, toggleTheme, hapticsEnabled, toggleHaptics } = useTheme();

  if (!user) return null;

  const handleInstallPrompt = () => {
    showXpToast(20, '¡Aplicación PWA lista para instalar en pantalla de inicio!', '📱');
  };

  return (
    <div className="space-y-4 pb-20 max-w-4xl mx-auto px-1 sm:px-2 pt-1">
      {/* 1. Profile Hero Card */}
      <div className="bg-white border border-gray-200/80 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-indigo-50 p-1 shadow-sm border border-indigo-100">
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-[14px] object-cover" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-xl bg-white border border-indigo-200 shadow-sm flex items-center justify-center text-xs">
            ⚡
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 font-heading">{user.name}</h1>
            <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {user.role}
            </span>
          </div>

          <p className="text-xs text-indigo-700 font-bold mt-0.5">{user.rankTitle}</p>
          <p className="text-xs text-gray-500 mt-1">
            {user.department} • Código {user.id} • {user.email}
          </p>
        </div>

        {/* Quick XP Summary */}
        <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 text-center min-w-[130px]">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Total Acumulado</span>
          <span className="text-xl font-black text-gray-900 font-mono">{user.xp.toLocaleString()} XP</span>
          <span className="text-[10px] text-indigo-700 block font-black mt-0.5">Nivel {user.level}</span>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 text-center shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-1.5 border border-amber-100">
            <Flame className="w-4 h-4" />
          </div>
          <span className="text-xs text-gray-500 font-medium block">Racha Actual</span>
          <p className="text-lg font-black text-gray-900 font-mono">{user.currentStreak} días</p>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 text-center shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-1.5 border border-indigo-100">
            <Zap className="w-4 h-4" />
          </div>
          <span className="text-xs text-gray-500 font-medium block">Nivel Operativo</span>
          <p className="text-lg font-black text-indigo-600 font-mono">Nv. {user.level}</p>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 text-center shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-1.5 border border-emerald-100">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-xs text-gray-500 font-medium block">Puntualidad</span>
          <p className="text-lg font-black text-emerald-700 font-mono">98.4%</p>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 text-center shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-1.5 border border-purple-100">
            <Award className="w-4 h-4" />
          </div>
          <span className="text-xs text-gray-500 font-medium block">Insignias</span>
          <p className="text-lg font-black text-purple-700 font-mono">10 / 12</p>
        </div>
      </div>

      {/* 3. Settings & Preferences */}
      <div className="bg-white border border-gray-200/80 rounded-3xl p-5 sm:p-6 shadow-sm">
        <h3 className="text-sm font-black text-gray-900 font-heading mb-4">Preferencias de la Aplicación</h3>

        <div className="divide-y divide-gray-100">
          {/* Theme switch */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 border border-gray-200">
                {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-500" />}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Tema Visual</p>
                <p className="text-[11px] text-gray-500">Paleta Vibrante Clara (Alta Legibilidad)</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-800 rounded-xl border border-gray-200 transition-colors"
            >
              Alternar
            </button>
          </div>

          {/* Haptics & Sound */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 border border-gray-200">
                <Sparkles className="w-4 h-4 text-fuchsia-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Microinteracciones y Confetti</p>
                <p className="text-[11px] text-gray-500">Animaciones de recompensas y logros al ganar XP</p>
              </div>
            </div>
            <button
              onClick={toggleHaptics}
              className={`px-3.5 py-1.5 text-xs rounded-xl border transition-colors ${
                hapticsEnabled
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold'
                  : 'bg-gray-100 text-gray-500 border-gray-200'
              }`}
            >
              {hapticsEnabled ? 'Activadas ✓' : 'Desactivadas'}
            </button>
          </div>

          {/* PWA Mobile App */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 border border-gray-200">
                <Smartphone className="w-4 h-4 text-cyan-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Instalación Móvil (PWA)</p>
                <p className="text-[11px] text-gray-500">Usar como aplicación nativa en Android / iOS</p>
              </div>
            </div>
            <button
              onClick={handleInstallPrompt}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
            >
              Instalar App
            </button>
          </div>

          {/* Supabase / PostgreSQL Ready Indicator */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 border border-gray-200">
                <Database className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Arquitectura de Datos</p>
                <p className="text-[11px] text-gray-500">
                  Proveedor activo: <span className="text-indigo-600 font-mono font-bold">Mock Data Store (Supabase Ready)</span>
                </p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Repository Pattern OK
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
