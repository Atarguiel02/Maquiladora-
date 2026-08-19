import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Flame, Zap, Bell, Moon, Sun, Sparkles, ChevronDown, ShieldCheck } from 'lucide-react';
import { UserRole } from '../../shared/types';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenAi: () => void;
  onOpenScanner: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onOpenAi,
  onOpenScanner
}) => {
  const { user, availableUsers, switchUser, unreadCount, setActiveTab } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!user) return null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200/90 px-4 sm:px-8 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand & Active Role Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
              <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-lg sm:text-xl tracking-tight text-indigo-950">
                  MAQUILA<span className="text-indigo-600">HUB</span>
                </span>
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {user.role}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium truncate max-w-[120px] sm:max-w-[200px]">
                {user.department}
              </p>
            </div>
          </button>
        </div>

        {/* Dynamic Quick Stats: Streak, XP, Level, Buttons */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* XP and Level Bar */}
          <button
            onClick={() => setActiveTab('gamification')}
            className="hidden md:flex flex-col items-end group focus:outline-none"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Nivel {user.level}
              </span>
              <span className="px-2 py-0.5 bg-yellow-400 text-yellow-950 text-[10px] font-black rounded-full shadow-xs">
                {user.level >= 10 ? 'EXPERTO' : user.level >= 5 ? 'AVANZADO' : 'NOVATO'}
              </span>
            </div>
            <div className="w-28 sm:w-36 h-2 bg-gray-100 rounded-full mt-1.5 overflow-hidden p-0.5 border border-gray-200/60">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300 shadow-sm"
                style={{ width: `${user.xp % 100}%` }}
              />
            </div>
          </button>

          {/* AI Assistant Button */}
          <button
            onClick={onOpenAi}
            title="MaquiBot AI Assistant"
            className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-xs hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            title="Notificaciones"
            className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white shadow-md">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Profile with Flame badge */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="relative flex items-center gap-1.5 focus:outline-none group"
            >
              <div className="relative">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-11 h-11 rounded-2xl bg-indigo-100 border-2 border-white shadow-sm object-cover group-hover:ring-2 group-hover:ring-indigo-400 transition-all"
                />
                <div className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-orange-500 text-white flex items-center justify-center rounded-full border-2 border-white text-[10px] font-bold shadow-xs">
                  🔥{user.currentStreak}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block group-hover:text-gray-700" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-72 rounded-3xl bg-white border border-gray-200 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 mb-2">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                      {user.role}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-600 font-semibold mt-0.5">{user.rankTitle}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{user.email}</p>
                </div>

                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2 py-1">
                  Cambiar Rol / Demo
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1 my-1">
                  {availableUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setShowUserMenu(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs transition-colors ${
                        u.id === user.id ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <img src={u.avatarUrl} alt={u.name} className="w-7 h-7 rounded-lg object-cover bg-gray-100" />
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-[12px] font-medium">{u.name}</p>
                        <p className="text-[10px] text-gray-400">{u.role} • {u.department}</p>
                      </div>
                      {u.id === user.id && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
                    </button>
                  ))}
                </div>

                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-center py-2 text-xs text-indigo-600 hover:text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors"
                  >
                    Ver Perfil Completo y Ajustes ⚙️
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
