import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../shared/types';
import { UserCheck, Sparkles } from 'lucide-react';

const ROLES_META: { role: UserRole; label: string; icon: string; name: string }[] = [
  { role: 'OPERATOR', label: 'Operario', icon: '⚡', name: 'Carlos' },
  { role: 'SUPERVISOR', label: 'Supervisor', icon: '🏭', name: 'Sofía' },
  { role: 'QUALITY', label: 'Calidad', icon: '🎯', name: 'Diego' },
  { role: 'WAREHOUSE', label: 'Almacén', icon: '📦', name: 'Marco' },
  { role: 'MAINTENANCE', label: 'Mtto', icon: '⚙️', name: 'Roberto' },
  { role: 'HR', label: 'RRHH', icon: '👥', name: 'Elena' },
  { role: 'MANAGER', label: 'Gerente', icon: '📊', name: 'Lucía' },
  { role: 'ADMIN', label: 'Admin', icon: '🛡️', name: 'General' }
];

export const RoleSwitcherBanner: React.FC = () => {
  const { user, switchRole } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-3 py-2 overflow-x-auto scrollbar-none shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max text-xs">
        <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-gray-400 mr-1 pl-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden sm:inline">Modo Demo:</span>
        </div>

        {ROLES_META.map((item) => {
          const isActive = user.role === item.role;
          return (
            <button
              key={item.role}
              onClick={() => switchRole(item.role)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all text-xs ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]'
                  : 'bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              <span className={`text-[10px] ${isActive ? 'text-indigo-200 font-medium' : 'text-gray-400'}`}>
                ({item.name})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
