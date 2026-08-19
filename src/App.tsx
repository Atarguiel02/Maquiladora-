import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/common/Header';
import { RoleSwitcherBanner } from './components/common/RoleSwitcherBanner';
import { BottomNav } from './components/common/BottomNav';
import { XPToastContainer } from './components/common/XPToast';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { QuickActionsModal } from './components/common/QuickActionsModal';
import { QRScannerModal } from './components/scanner/QRScannerModal';
import { AiAssistantModal } from './components/ai/AiAssistantModal';

import { OperatorDashboard } from './components/dashboard/OperatorDashboard';
import { SupervisorDashboard } from './components/dashboard/SupervisorDashboard';
import { QualityDashboard } from './components/dashboard/QualityDashboard';
import { WarehouseDashboard } from './components/dashboard/WarehouseDashboard';
import { MaintenanceDashboard } from './components/dashboard/MaintenanceDashboard';
import { HrDashboard } from './components/dashboard/HrDashboard';
import { ManagerDashboard } from './components/dashboard/ManagerDashboard';
import { GamificationView } from './components/gamification/GamificationView';
import { SocialView } from './components/social/SocialView';
import { ProfileView } from './components/profile/ProfileView';

const MainApp: React.FC = () => {
  const { user, activeTab, loading } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center text-gray-900">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-700 flex items-center justify-center animate-bounce mb-3 shadow-xl shadow-indigo-600/30">
          <span className="font-heading font-black text-2xl text-white">M</span>
        </div>
        <p className="text-sm font-black text-indigo-950 font-heading tracking-tight">MAQUILA HUB</p>
        <p className="text-xs text-indigo-600 font-medium mt-1">Cargando planta operativa...</p>
      </div>
    );
  }

  const renderActiveView = () => {
    // Tab based routing
    switch (activeTab) {
      case 'home':
        if (user.role === 'OPERATOR') {
          return (
            <OperatorDashboard
              onOpenQuickAction={() => setShowQuickActions(true)}
              onOpenScanner={() => setShowScanner(true)}
            />
          );
        }
        if (user.role === 'SUPERVISOR') return <SupervisorDashboard />;
        if (user.role === 'QUALITY') return <QualityDashboard />;
        if (user.role === 'WAREHOUSE') {
          return <WarehouseDashboard onOpenScanner={() => setShowScanner(true)} />;
        }
        if (user.role === 'MAINTENANCE') {
          return <MaintenanceDashboard onOpenScanner={() => setShowScanner(true)} />;
        }
        if (user.role === 'HR') return <HrDashboard />;
        return <ManagerDashboard />;

      case 'attendance':
        return user.role === 'HR' ? (
          <HrDashboard />
        ) : (
          <OperatorDashboard
            onOpenQuickAction={() => setShowQuickActions(true)}
            onOpenScanner={() => setShowScanner(true)}
          />
        );

      case 'production':
      case 'lines':
        return <SupervisorDashboard />;

      case 'quality':
      case 'inspection':
        return <QualityDashboard />;

      case 'inventory':
      case 'movements':
        return <WarehouseDashboard onOpenScanner={() => setShowScanner(true)} />;

      case 'tickets':
        return <MaintenanceDashboard onOpenScanner={() => setShowScanner(true)} />;

      case 'gamification':
      case 'team':
        return <GamificationView />;

      case 'social':
        return <SocialView />;

      case 'reports':
        return <ManagerDashboard />;

      case 'profile':
        return <ProfileView />;

      default:
        return (
          <OperatorDashboard
            onOpenQuickAction={() => setShowQuickActions(true)}
            onOpenScanner={() => setShowScanner(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#1A1A1A] font-sans selection:bg-indigo-600 selection:text-white flex flex-col">
      {/* 1. Header */}
      <Header
        onOpenNotifications={() => setShowNotifications(true)}
        onOpenAi={() => setShowAiModal(true)}
        onOpenScanner={() => setShowScanner(true)}
      />

      {/* 2. Instant Demo Role Switcher Top Ribbon */}
      <RoleSwitcherBanner />

      {/* 3. Main Dynamic Content Container */}
      <main className="max-w-7xl mx-auto w-full pt-3 pb-24 px-3 sm:px-6 flex-1">
        {renderActiveView()}
      </main>

      {/* 4. Bottom Navigation Bar */}
      <BottomNav
        onOpenQuickAction={() => setShowQuickActions(true)}
        onOpenScanner={() => setShowScanner(true)}
      />

      {/* 5. XP Toast Floating Microinteraction Overlay */}
      <XPToastContainer />

      {/* 6. Slide-Over Notifications Drawer */}
      <NotificationDrawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* 7. 1-Tap Quick Actions Modal */}
      <QuickActionsModal
        isOpen={showQuickActions}
        onClose={() => setShowQuickActions(false)}
        onOpenScanner={() => setShowScanner(true)}
        onOpenAi={() => setShowAiModal(true)}
      />

      {/* 8. QR Industrial Scanner Modal */}
      <QRScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
      />

      {/* 9. MaquiBot AI Assistant Chat Modal */}
      <AiAssistantModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
