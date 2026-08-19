import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, UserRole, AttendanceRecord, AppNotification } from '../shared/types';
import { api } from '../services/api';
import { fireCelebrationConfetti, fireSmallSuccessConfetti } from '../utils/confetti';

interface XpToastData {
  id: string;
  amount: number;
  message: string;
  icon?: string;
}

interface AuthContextType {
  user: User | null;
  availableUsers: User[];
  loading: boolean;
  todayAttendance: AttendanceRecord | null;
  todayProduction: number;
  dailyGoal: number;
  activeTab: string;
  unreadCount: number;
  xpToasts: XpToastData[];
  setActiveTab: (tab: string) => void;
  switchRole: (role: UserRole) => Promise<void>;
  switchUser: (userId: string) => Promise<void>;
  performCheckIn: () => Promise<void>;
  performCheckOut: () => Promise<void>;
  quickLogProduction: (units: number) => Promise<void>;
  showXpToast: (amount: number, message: string, icon?: string) => void;
  refreshUserData: () => Promise<void>;
  markNotificationsAsRead: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);
  const [todayProduction, setTodayProduction] = useState(820);
  const [dailyGoal] = useState(1000);
  const [activeTab, setActiveTab] = useState('home');
  const [unreadCount, setUnreadCount] = useState(2);
  const [xpToasts, setXpToasts] = useState<XpToastData[]>([]);

  const showXpToast = useCallback((amount: number, message: string, icon = '⚡') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setXpToasts((prev) => [...prev, { id, amount, message, icon }]);
    setTimeout(() => {
      setXpToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const refreshUserData = useCallback(async () => {
    try {
      const users = await api.getUsers();
      setAvailableUsers(users);

      if (!user && users.length > 0) {
        // default to Carlos (Operator)
        const carlos = users.find((u) => u.id === 'usr-carlos') || users[0];
        setUser(carlos);
        const att = await api.getTodayAttendance(carlos.id);
        setTodayAttendance(att);
      } else if (user) {
        const updated = users.find((u) => u.id === user.id);
        if (updated) setUser(updated);
        const att = await api.getTodayAttendance(user.id);
        setTodayAttendance(att);
      }

      const notifs = await api.getNotifications(user?.id);
      setUnreadCount(notifs.filter((n) => !n.isRead).length);
    } catch (err) {
      console.error('Error loading user data', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshUserData();
  }, []);

  const switchRole = async (role: UserRole) => {
    try {
      setLoading(true);
      const switched = await api.switchRole(role);
      setUser(switched);
      const att = await api.getTodayAttendance(switched.id);
      setTodayAttendance(att);
      setActiveTab('home');
      showXpToast(10, `Modo ${role} activado`, '🔄');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const switchUser = async (userId: string) => {
    try {
      setLoading(true);
      const switched = await api.login(userId);
      setUser(switched);
      const att = await api.getTodayAttendance(switched.id);
      setTodayAttendance(att);
      setActiveTab('home');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const performCheckIn = async () => {
    if (!user) return;
    try {
      const res = await api.checkIn(user.id, user.name);
      setTodayAttendance(res.record);
      setUser((prev) => (prev ? { ...prev, xp: prev.xp + res.xpGranted, currentStreak: prev.currentStreak + 1 } : prev));
      fireCelebrationConfetti();
      showXpToast(res.xpGranted, res.isLate ? 'Entrada registrada' : '¡Puntualidad perfecta! Racha aumentada 🔥', '🟢');
    } catch (e) {
      console.error(e);
    }
  };

  const performCheckOut = async () => {
    if (!user) return;
    try {
      const res = await api.checkOut(user.id);
      setTodayAttendance(res);
      showXpToast(15, '¡Jornada finalizada con éxito! Descansa bien.', '🏁');
    } catch (e) {
      console.error(e);
    }
  };

  const quickLogProduction = async (units: number) => {
    if (!user) return;
    try {
      const res = await api.logProduction({
        orderId: 'ORD-2026-083',
        lineCode: user.lineId || 'LINE-03',
        userId: user.id,
        userName: user.name,
        units
      });
      setTodayProduction((prev) => prev + units);
      setUser((prev) => (prev ? { ...prev, xp: prev.xp + res.xpEarned } : prev));
      
      if (todayProduction + units >= dailyGoal && todayProduction < dailyGoal) {
        fireCelebrationConfetti();
        showXpToast(100, '🎯 ¡META DIARIA CUMPLIDA AL 100%!', '🏆');
      } else {
        fireSmallSuccessConfetti();
        showXpToast(res.xpEarned, `+${units} prendas añadidas a tu meta`, '⚡');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      await fetch('/api/social/notifications/read-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id })
      });
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        availableUsers,
        loading,
        todayAttendance,
        todayProduction,
        dailyGoal,
        activeTab,
        unreadCount,
        xpToasts,
        setActiveTab,
        switchRole,
        switchUser,
        performCheckIn,
        performCheckOut,
        quickLogProduction,
        showXpToast,
        refreshUserData,
        markNotificationsAsRead
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
