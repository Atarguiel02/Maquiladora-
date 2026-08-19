import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  Zap,
  TrendingUp,
  Award,
  User as UserIcon,
  Factory,
  Users,
  Target,
  BarChart3,
  Package,
  Wrench,
  QrCode,
  HeartHandshake,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { UserRole } from '../../shared/types';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface BottomNavProps {
  onOpenQuickAction: () => void;
  onOpenScanner: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenQuickAction, onOpenScanner }) => {
  const { user, activeTab, setActiveTab } = useAuth();

  if (!user) return null;

  const getNavItems = (role: UserRole): NavItem[] => {
    switch (role) {
      case 'OPERATOR':
        return [
          { id: 'home', label: 'Inicio', icon: <Home className="w-5 h-5" /> },
          { id: 'attendance', label: 'Jornada', icon: <CheckCircle2 className="w-5 h-5" /> },
          { id: 'production', label: 'Producción', icon: <TrendingUp className="w-5 h-5" /> },
          { id: 'gamification', label: 'XP & Logros', icon: <Award className="w-5 h-5" /> },
          { id: 'social', label: 'Kudos', icon: <HeartHandshake className="w-5 h-5" /> }
        ];

      case 'SUPERVISOR':
        return [
          { id: 'home', label: 'Resumen', icon: <Home className="w-5 h-5" /> },
          { id: 'lines', label: 'Líneas', icon: <Factory className="w-5 h-5" /> },
          { id: 'team', label: 'Equipo', icon: <Users className="w-5 h-5" /> },
          { id: 'quality', label: 'Calidad', icon: <Target className="w-5 h-5" /> },
          { id: 'gamification', label: 'Rankings', icon: <Award className="w-5 h-5" /> }
        ];

      case 'QUALITY':
        return [
          { id: 'home', label: 'Calidad', icon: <Target className="w-5 h-5" /> },
          { id: 'inspection', label: 'Inspección', icon: <CheckCircle2 className="w-5 h-5" /> },
          { id: 'lines', label: 'Líneas', icon: <Factory className="w-5 h-5" /> },
          { id: 'reports', label: 'Defectos', icon: <BarChart3 className="w-5 h-5" /> },
          { id: 'profile', label: 'Perfil', icon: <UserIcon className="w-5 h-5" /> }
        ];

      case 'WAREHOUSE':
        return [
          { id: 'home', label: 'Almacén', icon: <Package className="w-5 h-5" /> },
          { id: 'inventory', label: 'Stock', icon: <Package className="w-5 h-5" /> },
          { id: 'movements', label: 'Movimientos', icon: <TrendingUp className="w-5 h-5" /> },
          { id: 'social', label: 'Comunidad', icon: <HeartHandshake className="w-5 h-5" /> },
          { id: 'profile', label: 'Perfil', icon: <UserIcon className="w-5 h-5" /> }
        ];

      case 'MAINTENANCE':
        return [
          { id: 'home', label: 'Máquinas', icon: <Wrench className="w-5 h-5" /> },
          { id: 'tickets', label: 'Tickets', icon: <CheckCircle2 className="w-5 h-5" /> },
          { id: 'lines', label: 'Planta', icon: <Factory className="w-5 h-5" /> },
          { id: 'gamification', label: 'Retos', icon: <Award className="w-5 h-5" /> },
          { id: 'profile', label: 'Perfil', icon: <UserIcon className="w-5 h-5" /> }
        ];

      case 'HR':
        return [
          { id: 'home', label: 'Personal', icon: <Users className="w-5 h-5" /> },
          { id: 'attendance', label: 'Asistencias', icon: <CheckCircle2 className="w-5 h-5" /> },
          { id: 'gamification', label: 'Reconocimientos', icon: <Award className="w-5 h-5" /> },
          { id: 'reports', label: 'Métricas', icon: <BarChart3 className="w-5 h-5" /> },
          { id: 'profile', label: 'Perfil', icon: <UserIcon className="w-5 h-5" /> }
        ];

      case 'MANAGER':
      case 'ADMIN':
      default:
        return [
          { id: 'home', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
          { id: 'lines', label: 'Líneas', icon: <Factory className="w-5 h-5" /> },
          { id: 'inventory', label: 'Inventario', icon: <Package className="w-5 h-5" /> },
          { id: 'reports', label: 'Reportes', icon: <FileSpreadsheet className="w-5 h-5" /> },
          { id: 'profile', label: 'Perfil', icon: <UserIcon className="w-5 h-5" /> }
        ];
    }
  };

  const navItems = getNavItems(user.role);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-200/90 px-3 pb-safe shadow-2xl">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 relative">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all relative ${
                isActive ? 'text-indigo-600 font-bold' : 'text-gray-400 hover:text-gray-700 font-semibold'
              }`}
            >
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-600 scale-110 shadow-xs'
                    : 'bg-transparent text-gray-400 hover:bg-gray-100'
                }`}
              >
                {item.icon}
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight truncate max-w-[64px] ${
                  isActive ? 'font-black text-indigo-600 uppercase' : 'font-medium text-gray-500'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-indigo-600" />
              )}
            </button>
          );
        })}

        {/* Floating Quick Action Trigger */}
        <div className="absolute -top-5 right-4 sm:right-6">
          <button
            onClick={onOpenQuickAction}
            title="Acción Rápida (<3 seg)"
            className="w-12 h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-xl shadow-indigo-600/40 hover:scale-105 active:scale-95 transition-all border-2 border-white"
          >
            <Zap className="w-6 h-6 fill-white" />
          </button>
        </div>
      </div>
    </nav>
  );
};
